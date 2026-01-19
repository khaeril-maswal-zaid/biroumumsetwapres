<?php

namespace App\Http\Controllers;

use App\Models\PermintaanAtk;
use App\Http\Requests\StorePermintaanAtkRequest;
use App\Models\DaftarAtk;
use App\Http\Requests\UpdatePermintaanAtkRequest;
use Illuminate\Support\Facades\DB;
use App\Models\Notification;
use App\Models\StockOpname;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
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
        // Simpan permintaan ATK
        $permintaan = PermintaanAtk::create([
            'user_id'         => Auth::id(),
            'kode_unit'       => Auth::user()->pegawai?->unit?->kode_unit,
            'daftar_kebutuhan' => $request->items ?? [],
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
                        'stock' => $daftarAtk?->quantity ?? 0,
                    ]);
                })
                ->values()
                ->toArray();
        }

        return Inertia::render('admin/supplies/review', [
            'selectedRequest' => $permintaanAtk->load('pemesan.pegawai.biro'),
            'daftarAtk' => DaftarAtk::all()
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

    public function statusX(PermintaanAtk $permintaanAtk, Request $request)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,partial,confirmed,reject',
            'message' => 'required_if:action,rejected|string|max:255',
            'items' => 'array',
        ], [
            'status.required' => 'Status wajib diisi.',
            'status.in' => 'Status harus salah satu dari: Tolak, Proses dan Selesai.',
            'item.required' => 'Item tidak boleh kosong.',
        ]);

        $status = $validated['status'] === 'partial' ? 'partial' : 'confirmed';

        $inputItems = $validated['items'];

        $originalItems = collect($permintaanAtk->daftar_kebutuhan);

        $updatedItems = $originalItems->map(function ($item) use ($inputItems) {
            $itemId =  $item['id'];
            if (isset($inputItems[$itemId])) {
                $item['approved'] = $inputItems[$itemId];
            }
            return $item;
        });

        $updateData = collect([
            'status' => $status,
            'daftar_kebutuhan' => $updatedItems,
        ]);

        if (isset($validated['message'])) {
            $updateData->put('keterangan', $validated['message']);
        }

        $permintaanAtk->update($updateData->all());

        // Proses approved items: buat log StockOpname dan kurangi stock DaftarAtk
        foreach ($updatedItems as $item) {
            if (isset($item['approved']) && $item['approved'] > 0) {
                $daftarAtk = DaftarAtk::find($item['id']);
                if ($daftarAtk) {

                    StockOpname::create([
                        'daftar_atk_id' => $item['id'],
                        'kode_unit' => Auth::user()->pegawai?->unit?->kode_unit,
                        'quantity' => $item['approved'],
                        'type' => 'Pemakaian',
                        'permintaan_atk_id' => $permintaanAtk->id,
                        'unit_price' => 0,
                        'total_price' => 0,
                    ]);

                    // Kurangi stock di DaftarAtk
                    $daftarAtk->decrement('quantity', $item['approved']);
                }
            }
        }
    }

    public function status(PermintaanAtk $permintaanAtk, Request $request)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,partial,confirmed,reject',
            // perbaiki required_if: gunakan 'status'
            'message' => 'required_if:status,reject|string|max:255',
            'items' => 'array',
        ], [
            'status.required' => 'Status wajib diisi.',
            'status.in' => 'Status harus salah satu dari: pending, partial, confirmed, reject.',
            'items.array' => 'Items harus bertipe array.',
        ]);

        $status = $validated['status'] === 'partial' ? 'partial' : 'confirmed';
        $inputItems = $validated['items'] ?? [];
        $originalItems = collect($permintaanAtk->daftar_kebutuhan ?? []);
        $updatedItems = $originalItems->map(function ($item) use ($inputItems) {
            $itemId = $item['id'];
            if (isset($inputItems[$itemId])) {
                $item['approved'] = $inputItems[$itemId];
            }
            return $item;
        });

        $updateData = collect([
            'status' => $status,
            'daftar_kebutuhan' => $updatedItems,
        ]);

        if (isset($validated['message'])) {
            $updateData->put('keterangan', $validated['message']);
        }

        // update permintaan terlebih dulu
        $permintaanAtk->update($updateData->all());

        // --- PROSES PEMAKAIAN DENGAN FIFO ---
        DB::transaction(function () use ($updatedItems, $permintaanAtk) {
            foreach ($updatedItems as $item) {
                if (!isset($item['approved']) || (int)$item['approved'] <= 0) {
                    continue;
                }

                $toConsume = (int) $item['approved'];
                $daftarAtkId = $item['id'];

                // 🔑 FIFO BENAR: pakai remaining_quantity
                $perolehanRows = StockOpname::where('daftar_atk_id', $daftarAtkId)
                    ->where('type', 'Perolehan')
                    ->where('remaining_quantity', '>', 0)
                    ->orderBy('created_at')
                    ->lockForUpdate()
                    ->get();

                foreach ($perolehanRows as $perolehan) {
                    if ($toConsume <= 0) break;

                    $available = (int) $perolehan->remaining_quantity;
                    if ($available <= 0) continue;

                    $take = min($available, $toConsume);

                    StockOpname::create([
                        'daftar_atk_id' => $daftarAtkId,
                        'kode_unit' => Auth::user()->pegawai?->unit?->kode_unit,
                        'quantity' => $take,
                        'type' => 'Pemakaian',
                        'permintaan_atk_id' => $permintaanAtk->id,
                        'unit_price' => $perolehan->unit_price,
                        'total_price' => $perolehan->unit_price * $take,
                        'source_stockopname_id' => $perolehan->id,
                    ]);

                    // 🔑 KURANGI SISA BATCH, BUKAN quantity
                    $perolehan->decrement('remaining_quantity', $take);

                    $toConsume -= $take;
                }

                // Jika stok batch tidak cukup
                if ($toConsume > 0) {
                    Log::warning('FIFO stok tidak cukup', [
                        'permintaan_atk_id' => $permintaanAtk->id,
                        'daftar_atk_id' => $daftarAtkId,
                        'sisa' => $toConsume,
                    ]);

                    // opsi: throw exception (lebih aman)
                    throw new \Exception("Stok ATK tidak mencukupi (ID: {$daftarAtkId})");
                }

                // stok total (ringkas)
                DaftarAtk::where('id', $daftarAtkId)
                    ->decrement('quantity', (int)$item['approved']);
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
