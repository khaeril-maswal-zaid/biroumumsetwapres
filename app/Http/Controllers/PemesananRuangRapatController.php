<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

use App\Models\PemesananRuangRapat;
use App\Http\Requests\StorePemesananRuangRapatRequest;
use App\Http\Requests\UpdatePemesananRuangRapatRequest;

class PemesananRuangRapatController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('admin/bookings/page');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('biroumum/booking/page');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePemesananRuangRapatRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(PemesananRuangRapat $pemesananRuangRapat)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(PemesananRuangRapat $pemesananRuangRapat)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePemesananRuangRapatRequest $request, PemesananRuangRapat $pemesananRuangRapat)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PemesananRuangRapat $pemesananRuangRapat)
    {
        //
    }
}
