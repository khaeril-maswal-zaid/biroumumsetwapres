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


    public function status(PermintaanAtk $permintaanAtk, Request $request)
    {
        dd($request->all());

        $validated = $request->validate([
            'status' => 'required|in:pending,partial,confirmed,reject',
            'message' => 'required_if:status,reject|string|max:255',
            'items' => 'sometimes|array',
        ], [
            'status.required' => 'Status wajib diisi.',
            'status.in' => 'Status harus salah satu dari: pending, partial, confirmed, reject.',
            'message.required_if' => 'Alasan / pesan wajib diisi saat menolak.',
        ]);

        // Ambil mapping input item: ekspektasi FE: items => [ '<daftar_atk_id>' => <approvedQty>, ... ]
        $inputItems = $validated['items'] ?? [];

        // Ambil daftar_kebutuhan original (format array of objects)
        $originalItems = collect($permintaanAtk->daftar_kebutuhan ?? []);

        // Update setiap item approved jika ada di payload
        $updatedItems = $originalItems->map(function ($item) use ($inputItems) {
            $itemId = (string) $item['id']; // pastikan key string/ints konsisten
            if (isset($inputItems[$itemId])) {
                // cast ke int supaya aman
                $item['approved'] = (int) $inputItems[$itemId];
            }
            return $item;
        });

        // Tentukan status yang disimpan (pakai value langsung dari client)
        $statusToStore = $validated['status'];

        // Susun data update
        $updateData = [
            'status' => $statusToStore,
            'daftar_kebutuhan' => $updatedItems->values()->all(),
        ];
        if (isset($validated['message'])) {
            $updateData['keterangan'] = $validated['message'];
        }

        // Mulai transaksi: update permintaan + proses pemakaian per item
        DB::transaction(function () use ($permintaanAtk, $updateData, $updatedItems) {

            // 1) Update permintaan (status + daftar_kebutuhan + keterangan)
            $permintaanAtk->update($updateData);

            // 2) Proses setiap approved item: buat StockOpname (Pemakaian) & update DaftarAtk
            foreach ($updatedItems as $item) {
                $approved = isset($item['approved']) ? (int) $item['approved'] : 0;
                if ($approved <= 0) {
                    continue; // tidak ada yang disetujui untuk item ini
                }

                $daftarAtkId = (int) $item['id'];
                $kodeUnit = Auth::user()->pegawai?->unit?->kode_unit ?? null;

                // Ambil daftar Perolehan (FIFO) yang masih punya remaining
                $perolehans = StockOpname::where('daftar_atk_id', $daftarAtkId)
                    ->where('type', 'Perolehan')
                    ->where('remaining_quantity', '>', 0)
                    ->orderBy('id') // FIFO; jika ingin berdasarkan created_at ubah ke ->orderBy('created_at')
                    ->lockForUpdate()
                    ->get();

                $qtyToConsume = $approved;

                // 2A) Ambil dari perolehan sebanyak mungkin (ambil batch per batch)
                foreach ($perolehans as $per) {
                    if ($qtyToConsume <= 0) break;

                    $available = (int) $per->remaining_quantity;
                    if ($available <= 0) continue;

                    $take = min($available, $qtyToConsume);

                    // buat record Pemakaian yang mengacu ke perolehan ($per->id) dan copy unit_price
                    StockOpname::create([
                        'kode_unit' => $kodeUnit,
                        'daftar_atk_id' => $daftarAtkId,
                        'quantity' => $take,
                        'remaining_quantity' => null,
                        'type' => 'Pemakaian',
                        'permintaan_atk_id' => $permintaanAtk->id,
                        'source_stockopname_id' => $per->id,
                        'unit_price' => $per->unit_price,
                        'total_price' => $per->unit_price * $take,
                    ]);

                    // kurangi remaining pada perolehan sumber
                    $per->remaining_quantity = max(0, $per->remaining_quantity - $take);
                    $per->save();

                    $qtyToConsume -= $take;
                }

                // 2B) Jika masih ada sisa yang belum ter-cover oleh Perolehan,
                //      buat Pemakaian fallback dengan unit_price = 0 agar tercatat.
                if ($qtyToConsume > 0) {
                    StockOpname::create([
                        'kode_unit' => $kodeUnit,
                        'daftar_atk_id' => $daftarAtkId,
                        'quantity' => $qtyToConsume,
                        'remaining_quantity' => null,
                        'type' => 'Pemakaian',
                        'permintaan_atk_id' => $permintaanAtk->id,
                        'source_stockopname_id' => null,
                        'unit_price' => 0,
                        'total_price' => 0,
                    ]);
                    // qtyToConsume jadi 0 setelah ini
                    $qtyToConsume = 0;
                }

                // 3) Kurangi stok master DaftarAtk (kurangi total stock tersedia)
                $daftarAtk = DaftarAtk::lockForUpdate()->find($daftarAtkId);
                if ($daftarAtk) {
                    // Pastikan tidak jadi negative (opsional)
                    $decrementBy = $approved;
                    // Jika ingin mencegah stok negatif, ubah $decrementBy = min($approved, $daftarAtk->quantity);
                    $daftarAtk->decrement('quantity', $decrementBy);
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
