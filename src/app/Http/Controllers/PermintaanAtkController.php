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

    public function status(PermintaanAtk $permintaanAtk, Request $request)
    {
        dd($request->all());
        $validated = $request->validate([
            'status'       => 'required|in:pending,partial,confirmed,reject',
            'message'      => 'required_if:status,reject|string|max:255',
            'items'        => 'sometimes|array',
            'newRequests'  => 'sometimes|array',
        ]);

        $inputItems  = $validated['items'] ?? [];        // mapping: [ '<id-or-tempId>' => approvedDelta ]
        $newRequests = $validated['newRequests'] ?? [];  // array of converted requests

        $originalItems = collect($permintaanAtk->daftar_kebutuhan ?? []);

        // 1) Build lookup for newRequests by originalItemId (to mark replaced items)
        $newByOrigin = collect($newRequests)->keyBy(function ($nr) {
            return (string) ($nr['originalItemId'] ?? '');
        });

        // 2) Update existing items' approved (add, not overwrite) and mark replaced if needed.
        $updatedItems = $originalItems->map(function ($item) use ($inputItems, $newByOrigin) {
            $itemIdKey = (string) ($item['id'] ?? '');

            // ensure fields exist
            $item['requested'] = isset($item['requested']) ? (int) $item['requested'] : 0;
            $item['approved']  = isset($item['approved']) ? (int) $item['approved'] : 0;

            // if FE provided an approved delta for this item, add it (but cap to requested)
            if (isset($inputItems[$itemIdKey])) {
                $incoming = (int) $inputItems[$itemIdKey];
                $item['approved'] = min($item['requested'], $item['approved'] + $incoming);
            }

            // default status: numeric id => normal, else custom (lain-lain string)
            if (is_numeric($item['id']) && (int)$item['id'] > 0) {
                $item['status'] = 'normal';
            } else {
                $item['status'] = 'custom';
            }

            // if this original item was replaced (exists in newRequests), mark replaced + replacedBy
            if ($newByOrigin->has($itemIdKey)) {
                $nr = $newByOrigin->get($itemIdKey);
                $item['status'] = 'replaced';
                $item['replacedBy'] = (int) ($nr['id'] ?? null);
            }

            return $item;
        });

        // 3) Prepare appended items from newRequests (these are master ATK entries)
        $appendedItems = collect($newRequests)->map(function ($nr) use ($inputItems) {
            $requested = isset($nr['requested']) ? (int) $nr['requested'] : 0;
            $approvedFromNr = isset($nr['approved']) ? (int) $nr['approved'] : 0;

            // If FE also sent a mapping for this newRequest id (rare), add it to approved but cap to requested
            $extra = 0;
            $nrIdKey = (string) ($nr['id'] ?? '');
            // FE might include mapping keyed by numeric id as well
            if (isset($inputItems[$nrIdKey])) {
                $extra = (int) $inputItems[$nrIdKey];
            }

            $approved = min($requested, $approvedFromNr + $extra);

            return [
                'id'        => (int) $nr['id'],
                'name'      => $nr['name'] ?? null,
                'satuan'    => $nr['satuan'] ?? null,
                'requested' => $requested,
                'approved'  => $approved,
                // now newRequests are master items => status replacement
                'status'    => 'replacement',
                'origin_id' => $nr['originalItemId'] ?? null,
            ];
        });

        // 4) Final items = existing (with replaced flags) + appended newRequests
        $finalItems = $updatedItems->concat($appendedItems)->values();

        // 5) Prepare update payload for permintaan
        $updateData = [
            'status'           => $validated['status'],
            'daftar_kebutuhan' => $finalItems->all(),
        ];
        if (!empty($validated['message'])) {
            $updateData['keterangan'] = $validated['message'];
        }

        // 6) DB transaction: update permintaan + process stock (only for numeric master ids)
        DB::transaction(function () use ($permintaanAtk, $updateData, $finalItems) {
            $permintaanAtk->update($updateData);

            $kodeUnit = Auth::user()->pegawai?->unit?->kode_unit ?? null;

            foreach ($finalItems as $item) {
                $approved = (int) ($item['approved'] ?? 0);
                if ($approved <= 0) continue;

                // Only act on items that have a valid master ATK id (numeric > 0)
                if (!isset($item['id']) || !is_numeric($item['id']) || (int) $item['id'] <= 0) {
                    continue;
                }

                $daftarAtkId = (int) $item['id'];
                $qtyToConsume = $approved;

                // FIFO perolehan
                $perolehans = StockOpname::where('daftar_atk_id', $daftarAtkId)
                    ->where('type', 'Perolehan')
                    ->where('remaining_quantity', '>', 0)
                    ->orderBy('id')
                    ->lockForUpdate()
                    ->get();

                foreach ($perolehans as $per) {
                    if ($qtyToConsume <= 0) break;

                    $available = (int) $per->remaining_quantity;
                    if ($available <= 0) continue;

                    $take = min($available, $qtyToConsume);

                    StockOpname::create([
                        'kode_unit'             => $kodeUnit,
                        'daftar_atk_id'         => $daftarAtkId,
                        'quantity'              => $take,
                        'remaining_quantity'    => null,
                        'type'                  => 'Pemakaian',
                        'permintaan_atk_id'     => $permintaanAtk->id,
                        'source_stockopname_id' => $per->id,
                        'unit_price'            => $per->unit_price,
                        'total_price'           => $per->unit_price * $take,
                    ]);

                    $per->remaining_quantity = max(0, $per->remaining_quantity - $take);
                    $per->save();

                    $qtyToConsume -= $take;
                }

                // fallback jika stok perolehan tidak cukup
                if ($qtyToConsume > 0) {
                    StockOpname::create([
                        'kode_unit'             => $kodeUnit,
                        'daftar_atk_id'         => $daftarAtkId,
                        'quantity'              => $qtyToConsume,
                        'remaining_quantity'    => null,
                        'type'                  => 'Pemakaian',
                        'permintaan_atk_id'     => $permintaanAtk->id,
                        'source_stockopname_id' => null,
                        'unit_price'            => 0,
                        'total_price'           => 0,
                    ]);
                }

                // update master stock
                $daftarAtk = DaftarAtk::lockForUpdate()->find($daftarAtkId);
                if ($daftarAtk) {
                    $daftarAtk->decrement('quantity', $approved);
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
