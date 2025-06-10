<?php

namespace App\Http\Controllers;

use App\Models\KerusakanGedung;
use App\Http\Requests\StoreKerusakanGedungRequest;
use App\Http\Requests\UpdateKerusakanGedungRequest;
use Inertia\Inertia;

class KerusakanGedungController extends Controller
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
        return Inertia::render('biroumum/damage/page');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreKerusakanGedungRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(KerusakanGedung $kerusakanGedung)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(KerusakanGedung $kerusakanGedung)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateKerusakanGedungRequest $request, KerusakanGedung $kerusakanGedung)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(KerusakanGedung $kerusakanGedung)
    {
        //
    }
}
