<?php

namespace App\Http\Controllers;

use App\Models\LogProses;
use App\Http\Requests\StoreLogProsesRequest;
use App\Http\Requests\UpdateLogProsesRequest;
use App\Models\KerusakanGedung;

class LogProsesController extends Controller
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
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreLogProsesRequest $request)
    {
        $kerusan = KerusakanGedung::where('kode_pelaporan', $request->kodePelaporan)->first();

        if ($kerusan->item != $request->itemLaporanKerusakan) {
            return redirect()->route('kerusakangedung.index');
        }

        LogProses::create([
            'kerusakan_gedung_id' => $kerusan->id,
            'tanggal' => $request->dateUpdateLog,
            'title' => $request->textUpdateLog,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(LogProses $logProses)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(LogProses $logProses)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateLogProsesRequest $request, LogProses $logProses)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(LogProses $logProses)
    {
        $logProses->delete();
    }
}
