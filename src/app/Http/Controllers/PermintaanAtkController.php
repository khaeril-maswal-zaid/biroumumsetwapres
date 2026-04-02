<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePermintaanAtkRequest;
use App\Models\DaftarAtk;
use App\Http\Requests\UpdatePermintaanAtkRequest;
use App\Http\Requests\UpdatePermintaanAtkStatusRequest;
use Illuminate\Support\Facades\DB;
use App\Models\Notification;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Models\PermintaanAtk;
use App\Services\PermintaanAtkStatusService;
use App\Services\StockOpnameService;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Inertia\Response;

class PermintaanAtkController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {

        $data = [
            'permintaanAtk' =>  PermintaanAtk::with('pemesan.pegawai')->latest()->paginate(150),
        ];

        return Inertia::render('admin/supplies/page', $data);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $data = [
            'availableATK' => DaftarAtk::select(['id', 'name', 'satuan', 'kategori_atk_id'])
                ->with('kategoriAtk:id,nama_kategori')
                ->orderBy('name', 'asc')
                ->get(),
        ];

        return Inertia::render('biroumum/supplies/page', $data);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePermintaanAtkRequest $request)
    {
        $items = collect($request->items)->map(function ($item) {
            return [
                'id'        => $item['id'],
                'name'      => $item['name'],
                'satuan'    => $item['satuan'],
                'status'    => $item['status'],
                'requested' => (int) $item['requested'],
                'approved'  => (int) $item['approved'],
            ];
        })->values()->toArray();

        // Simpan permintaan ATK
        $permintaan = PermintaanAtk::create([
            'user_id'         => Auth::id(),
            'kode_unit'       => Auth::user()->pegawai?->unit?->kode_unit,
            'daftar_kebutuhan' => $items ?? [],
            'deskripsi'       => $request->justification,
            'no_hp'           => $request->contact,
            'kode_pelaporan'  => 'ATK-' . now()->format('md') . '-' . strtoupper(Str::random(3)),
            'status'          => 'pending',
            // 'memo'         => $path,
        ]);

        $pegawai = $permintaan->pemesan->pegawai;
        $message = "Permintaan ATK dari {$pegawai->name} ({$pegawai->jabatan}) menunggu tindak lanjut.";

        // Buat notifikasi
        Notification::create([
            'kode_unit'   => $permintaan->pemesan->pegawai->unit->kode_unit,
            'kode_unit'   => $permintaan->kode_unit,
            'permissions' => ["view_supplies"],
            'type'        => 'new',
            'category'    => 'supplies',
            'title'       => 'Permintaan ATK Baru',
            'message'     =>  $message,
            'priority'    => 'medium',
            'action_url'  => route('permintaanatk.show', $permintaan->kode_pelaporan, false),
        ]);
    }


    /**
     * Display the specified resource.
     */
    public function show(PermintaanAtk $permintaanAtk)
    {
        $permintaanAtk->update([
            'is_read' => true,
        ]);

        if ($permintaanAtk->daftar_kebutuhan) {
            $permintaanAtk->daftar_kebutuhan = collect($permintaanAtk->daftar_kebutuhan)
                ->map(function ($item) {
                    $daftarAtk = DaftarAtk::find($item['id']);

                    return array_merge($item, [
                        'quantity' => $daftarAtk?->quantity ?? 0,
                    ]);
                })
                ->values()
                ->toArray();
        }

        $data = [
            'selectedRequest' => $permintaanAtk->load('pemesan.pegawai.biro'),
            'daftarAtk' => DaftarAtk::select(['id', 'name', 'kode_atk',  'satuan', 'quantity', 'kategori_atk_id'])
                ->with('kategoriAtk:id,nama_kategori')
                ->orderBy('name', 'asc')
                ->get(),
        ];

        return Inertia::render('admin/supplies/review', $data);
    }


    /**
     * Show the form for editing the specified resource.
     */
    public function edit(PermintaanAtk $permintaanAtk)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePermintaanAtkRequest $request, PermintaanAtk $permintaanAtk)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PermintaanAtk $permintaanAtk)
    {
        //
    }

    public function status(
        PermintaanAtk $permintaanAtk,
        UpdatePermintaanAtkStatusRequest $request,
        PermintaanAtkStatusService $statusService,
        StockOpnameService $stockService
    ) {
        $beforeItems = collect($permintaanAtk->daftar_kebutuhan ?? [])
            ->keyBy(fn($i) => (string) $i['id']);

        $finalItems = $statusService->handle(
            permintaan: $permintaanAtk,
            items: $request->input('items', []),
            newRequests: $request->input('newRequests', []),
            partialApprovals: $request->input('partialApprovals', []),
        );

        DB::transaction(function () use (
            $permintaanAtk,
            $request,
            $finalItems,
            $beforeItems,
            $stockService
        ) {

            $permintaanAtk->update([
                'status'           => $request->status,
                'daftar_kebutuhan' => $finalItems,
                'keterangan'       => $request->message ?? '',
            ]);

            $kodeUnit = Auth::user()?->pegawai?->unit?->kode_unit;

            foreach ($finalItems as $item) {
                if (!is_numeric($item['id'])) continue;

                $itemId = (string) $item['id'];

                $approvedBefore = (int) ($beforeItems[$itemId]['approved'] ?? 0);
                $approvedAfter  = (int) $item['approved'];

                $delta = $approvedAfter - $approvedBefore;

                if ($delta <= 0) continue;

                $stockService->consume(
                    (int) $item['id'],
                    $delta, // ✅ DELTA ONLY
                    $permintaanAtk->id,
                    $kodeUnit
                );
            }
        });
    }


    public function reports(PermintaanAtk $permintaanAtk)
    {
        $data = [
            'summaryData' => $permintaanAtk->summaryData(),
            'itemComparison' => $permintaanAtk->itemComparison(),
            'monthlyTrend' => $permintaanAtk->monthlyTrends(),
            'topUsers' => $permintaanAtk->topUsersStats(),
            'divisionStats' => $permintaanAtk->divisionStats(),
            'statusDistribution' => $permintaanAtk->statusDistribution(),
            'urgencyData' => $permintaanAtk->urgencyData(),
        ];

        return Inertia::render('admin/reportssupplies/page', $data);
    }

    public function showMemo($filename)
    {
        $path = storage_path("app/public/memo/{$filename}");

        if (! file_exists($path)) {
            abort(404, 'File not found.');
        }

        return response()->file($path, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'inline; filename="' . $filename . '"'
        ]);
    }

    public function tandaTerima(PermintaanAtk $permintaanAtk)
    {
        $items = collect($permintaanAtk->daftar_kebutuhan)
            ->where('approved', '>', 0)
            ->values()
            ->all();

        $data = [
            'penerima' => $permintaanAtk->load('pemesan.pegawai')->pemesan->pegawai->name ?? '____________________',
            'tanggal' => now()->format('d-m-Y'),
            'items' => $items
        ];

        $pdf = Pdf::loadView('pdf.tanda-terima-atk', $data)
            ->setPaper('A4', 'portrait');

        return $pdf->stream();
        return $pdf->download("buku-persediaan-{$bulan}-{$tahun}.pdf");
    }
}
