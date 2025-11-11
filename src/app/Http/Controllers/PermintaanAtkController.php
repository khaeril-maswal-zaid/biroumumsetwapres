<?php

namespace App\Http\Controllers;

use App\Models\PermintaanAtk;
use App\Http\Requests\StorePermintaanAtkRequest;
use App\Http\Requests\UpdatePermintaanAtkRequest;
use App\Models\DaftarAtk;
use App\Models\UnitKerja;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Http\Request;

class PermintaanAtkController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $data = [
            'permintaanAtk' => PermintaanAtk::with('pemesan.pegawai')->latest()->paginate(50)
        ];

        return Inertia::render('admin/supplies/page', $data);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('biroumum/supplies/page', [
            'availableATK' => DaftarAtk::select(['id', 'name', 'category', 'satuan'])->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePermintaanAtkRequest $request)
    {

        $path = $request->file('memo')->store('memos', 'public');

        PermintaanAtk::create([
            'user_id' => Auth::id(),
            'kode_unit' => Auth::user()->pegawai?->unit?->kode_unit,
            'daftar_kebutuhan' => $request->items ?? [],
            'deskripsi' => $request->justification,
            // 'urgensi' => $request->urgency,
            'no_hp' => $request->contact,
            'kode_pelaporan' => 'ATK-' . now()->format('md') . '-' . strtoupper(Str::random(3)),
            'status' => 'pending',
            'memo' => $path,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(PermintaanAtk $permintaanAtk)
    {
        $permintaanAtk->update(([
            'is_read' => true
        ]));

        return Inertia::render('admin/supplies/review', [
            'selectedRequest' => $permintaanAtk->load('pemesan.pegawai.biro')
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
        $validated = $request->validate([
            'status' => 'required|in:pending,process,confirmed,reject',
            'message' => 'required_if:action,rejected|string|max:255',
            'item' => 'array',
        ], [
            'status.required' => 'Status wajib diisi.',
            'status.in' => 'Status harus salah satu dari: Tolak, Proses dan Selesai.',
            'item.required' => 'Item tidak boleh kosong.',
        ]);

        $status = $validated['status'] === 'process' ? 'process' : 'confirmed';

        $inputItems = $validated['item'];

        $originalItems = collect($permintaanAtk->daftar_kebutuhan);

        $updatedItems = $originalItems->map(function ($item) use ($inputItems) {
            $itemId = (int) $item['id'];
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
