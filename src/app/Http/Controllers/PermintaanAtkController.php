<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePermintaanAtkRequest;
use App\Models\DaftarAtk;
use App\Http\Requests\UpdatePermintaanAtkRequest;
use App\Http\Requests\UpdatePermintaanAtkStatusRequest;
use Illuminate\Support\Facades\DB;
use App\Models\Notification;
use App\Models\PermintaanAtk;
use App\Models\StockOpname;
use App\Services\PermintaanAtkStatusService;
use App\Services\StockOpnameService;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Inertia\Response;

class PermintaanAtkController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $permintaanAtk = PermintaanAtk::with('pemesan.pegawai')->latest()->paginate(50);

        // Tambahkan stock ke daftar_kebutuhan
        $permintaanAtk->getCollection()->transform(function ($permintaan) {
            if ($permintaan->daftar_kebutuhan) {
                $permintaan->daftar_kebutuhan = collect($permintaan->daftar_kebutuhan)->map(function ($item) {
                    $daftarAtk = DaftarAtk::find($item['id']);
                    $item['stock'] = $daftarAtk ? $daftarAtk->quantity : 0;
                    return $item;
                })->toArray();
            }
            return $permintaan;
        });


        $data = [
            'permintaanAtk' =>  PermintaanAtk::with('pemesan.pegawai')->latest()->paginate(50),
        ];

        return Inertia::render('admin/supplies/page', $data);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('biroumum/supplies/page', [
            'availableATK' => DaftarAtk::select(['id', 'name', 'category', 'satuan'])->orderBy('name', 'asc')->get(),
        ]);
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

        return Inertia::render('admin/supplies/review', [
            'selectedRequest' => $permintaanAtk->load('pemesan.pegawai.biro'),
            'daftarAtk' => DaftarAtk::select(['id', 'name', 'kode_atk', 'category', 'satuan', 'quantity'])->orderBy('name', 'asc')->get(),
        ]);
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
        dd($request->all());

        $finalItems = $statusService->handle(
            permintaan: $permintaanAtk,
            items: $request->input('items', []),
            newRequests: $request->input('newRequests', []),
            partialApprovals: $request->input('partialApprovals', []),
        );

        DB::transaction(function () use ($permintaanAtk, $request, $finalItems, $stockService) {

            $permintaanAtk->update([
                'status'           => $request->status,
                'daftar_kebutuhan' => $finalItems,
                'keterangan'       => $request->message ?? '',
            ]);

            $kodeUnit = Auth::user()?->pegawai?->unit?->kode_unit;

            foreach ($finalItems as $item) {
                if (is_numeric($item['id']) && (int) $item['approved'] > 0) {
                    $stockService->consume(
                        (int) $item['id'],
                        (int) $item['approved'],
                        $permintaanAtk->id,
                        $kodeUnit
                    );
                }
            }
        });
    }


    public function reports()
    {
        $reportsData = new PermintaanAtk();

        $data = [
            'summaryData' => $reportsData->summaryData(),
            'itemComparison' => $reportsData->itemComparison(),
            'monthlyTrend' => $reportsData->monthlyTrends(),
            'topUsers' => $reportsData->topUsersStats(),
            'divisionStats' => $reportsData->divisionStats(),
            'statusDistribution' => $reportsData->statusDistribution(),
            'urgencyData' => $reportsData->urgencyData(),
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
}
