<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

use App\Models\PemesananRuangRapat;
use App\Http\Requests\StorePemesananRuangRapatRequest;
use App\Http\Requests\UpdatePemesananRuangRapatRequest;
use App\Models\DaftarRuangan;
use Illuminate\Support\Facades\Auth;

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
        $data = [
            'daftarruangans' => DaftarRuangan::select(['id', 'nama_ruangan', 'kode_ruangan', 'lokasi', 'kapasitas', 'image', 'fasilitas'])->get()
        ];

        return Inertia::render('biroumum/booking/page', $data);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePemesananRuangRapatRequest $request)
    {
        PemesananRuangRapat::create([
            'user_id' => Auth::id(),
            'tanggal_penggunaan' => $request->date,
            'jam_mulai' => $request->startTime,
            'jam_selesai' => $request->endTime,
            'daftar_ruangan_id' => 1, // $request->room,
            'deskripsi' => $request->purpose,
            'no_hp' => $request->contact,
            'keterangan' => '',
            'status' => 'Pengajuan',
        ]);
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
