<?php

namespace App\Http\Controllers;

use App\Models\KategoriAtk;
use App\Http\Requests\StoreKategoriAtkRequest;
use App\Http\Requests\UpdateKategoriAtkRequest;
use Inertia\Inertia;
use Inertia\Response;

class KategoriAtkController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $data = [
            'categoriesAtk' => KategoriAtk::select('id', 'nama_kategori', 'kode_kategori')->orderBy('nama_kategori', 'asc')->get(),
        ];

        return Inertia::render('admin/kategoriatk/page', $data);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreKategoriAtkRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(KategoriAtk $kategoriAtk)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(KategoriAtk $kategoriAtk)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateKategoriAtkRequest $request, KategoriAtk $kategoriAtk)
    {
        $kategoriAtk->update($request->validated());
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(KategoriAtk $kategoriAtk)
    {
        //
    }
}
