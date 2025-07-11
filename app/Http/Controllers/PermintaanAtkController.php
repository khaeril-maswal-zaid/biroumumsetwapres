<?php

namespace App\Http\Controllers;

use App\Models\PermintaanAtk;
use App\Http\Requests\StorePermintaanAtkRequest;
use App\Http\Requests\UpdatePermintaanAtkRequest;
use App\Models\DaftarAtk;
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
            'permintaanAtk' => PermintaanAtk::with('pemesan')->latest()->paginate(15)
        ];

        return Inertia::render('admin/supplies/page', $data);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('biroumum/supplies/page', [
            'availableATK' => DaftarAtk::select(['id', 'name', 'unit'])->get()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePermintaanAtkRequest $request)
    {
        PermintaanAtk::create([
            'user_id' => Auth::id(),
            'daftar_kebutuhan' => $request->items ?? [],
            'deskripsi' => $request->justification,
            'urgensi' => $request->urgency,
            'no_hp' => $request->contact,
            'kode_pelaporan' => 'Atk-' . now()->format('Ymd') . '-' . strtoupper(Str::random(5)),
            'status' => 'pending',
            'keterangan' => '',
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(PermintaanAtk $permintaanAtk)
    {
        //
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
        $inputItems = $request->input('item'); // array: id => approved

        // Ambil data asli dari kolom JSON
        $originalItems = collect($permintaanAtk->daftar_kebutuhan);

        // Lakukan update hanya pada field 'approved' sesuai id
        $updatedItems = $originalItems->map(function ($item) use ($inputItems) {
            $itemId = (int) $item['id']; // pastikan integer agar cocok
            if (isset($inputItems[$itemId])) {
                $item['approved'] = $inputItems[$itemId];
            }
            return $item;
        });

        // Simpan hasil
        $permintaanAtk->update([
            'daftar_kebutuhan' => $updatedItems,
            'status' => $request->input('status'),
            'keterangan' => $request->input('message'),
        ]);
    }
}
