<?php

namespace App\Http\Controllers;

use App\Models\PermintaanKendaraan;
use App\Http\Requests\StorePermintaanKendaraanRequest;
use App\Http\Requests\UpdatePermintaanKendaraanRequest;
use Inertia\Inertia;

class PermintaanKendaraanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('biroumum/vehicle/page');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePermintaanKendaraanRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(PermintaanKendaraan $permintaanKendaraan)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(PermintaanKendaraan $permintaanKendaraan)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePermintaanKendaraanRequest $request, PermintaanKendaraan $permintaanKendaraan)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PermintaanKendaraan $permintaanKendaraan)
    {
        //
    }
}
