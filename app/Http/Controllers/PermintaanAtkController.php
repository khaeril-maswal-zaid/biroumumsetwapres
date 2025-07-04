<?php

namespace App\Http\Controllers;

use App\Models\PermintaanAtk;
use App\Http\Requests\StorePermintaanAtkRequest;
use App\Http\Requests\UpdatePermintaanAtkRequest;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PermintaanAtkController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $data = [
            'permintaanAtk' => PermintaanAtk::with('pemesan')->paginate(15)
        ];

        return Inertia::render('admin/supplies/page', $data);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('biroumum/supplies/page');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePermintaanAtkRequest $request)
    {
        // dd($request->all());

        PermintaanAtk::create([
            'user_id' => Auth::id(),
            'daftar_kebutuhan' => $request->items,
            'deskripsi' => $request->justification,
            'urgensi' => $request->urgency,
            'no_hp' => $request->contact,
            'kode_pelaporan' => '123',
            'status' => 'Pengajuan',
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
}
