<?php

namespace App\Http\Controllers;

use App\Models\PermintaanAtk;
use App\Services\PengambilanAtkService;
use Illuminate\Http\Request;

class PengambilanAtkController extends Controller
{
    public function index(PermintaanAtk $permintaanAtk)
    {
        $data = [
            'permintaanAtk' => $permintaanAtk->load('pemesan.pegawai'),
            'pengambilanAtk' => $permintaanAtk->pengambilanDetails()->get(),
        ];

        return inertia('admin/pengambilanatk/page', $data);
    }

    public function store(Request $request, PermintaanAtk $permintaanAtk, PengambilanAtkService $service)
    {
        $validated = $request->validate([
            'nama_pengambil' => 'required|string|max:255',
            'no_hp' => 'nullable|string|max:25',
            'tanggal_ambil' => 'required|date',
            'keterangan' => 'nullable|string|max:255',
            'details' => 'required|array|min:1',
            'details.*.item_id' => 'required|string',
            'details.*.qty_diambil' => 'required|integer|min:1',
        ], [
            'nama_pengambil.required' => 'Nama pengambil wajib diisi.',
            'tanggal_ambil.required' => 'Tanggal ambil wajib diisi.',
            'details.required' => 'Minimal satu item harus diambil.',
            'details.*.qty_diambil.required' => 'Qty wajib diisi.',
            'details.*.qty_diambil.min' => 'Qty minimal 1.',
        ]);

        $service->handle(
            $permintaanAtk,
            $validated['details'],
            $validated['nama_pengambil'],
            $validated['no_hp'] ?? null,
            $validated['keterangan'] ?? null
        );

        return back()->with('success', 'Pengambilan berhasil disimpan.');
    }
}
