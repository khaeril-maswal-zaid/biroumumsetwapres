<?php

namespace App\Http\Controllers;

use App\Models\KategoriKerusakan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class KategoriKerusakanController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/kategorikerusakan/page', [
            'kategoriKerusakan' => KategoriKerusakan::latest()->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:250',
            'kode_kerusakan' => 'required|string|max:50|unique:kategori_kerusakans,kode_kerusakan',
            'sub_kategori' => 'nullable|array',
            'sub_kategori.*' => 'nullable|string|max:250',
        ]);

        $validated['kode_unit'] = Auth::user()->pegawai?->unit?->kode_unit;

        KategoriKerusakan::create($validated);
    }



    public function update(KategoriKerusakan $kategoriKerusakan, Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:250',
            'sub_kategori' => 'nullable|array',
            'sub_kategori.*' => 'nullable|string|max:250',
        ]);

        $kategoriKerusakan->update($validated);
    }

    public function destroy(KategoriKerusakan $kategoriKerusakan)
    {
        $kategoriKerusakan->delete();
    }
}
