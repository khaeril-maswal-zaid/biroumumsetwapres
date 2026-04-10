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
        $validated = $request->validate(
            [
                'name' => 'required|string|max:250',
                'bagian_kategori' => 'required|string|max:250|in:Bangunan,Perlengkapan',
                'sub_kategori' => 'nullable|array',
                'sub_kategori.*' => 'nullable|string|max:250',
            ],
            [
                'name.required' => 'Nama kategori wajib diisi.',
                'name.string' => 'Nama kategori harus berupa teks.',
                'name.max' => 'Nama kategori maksimal 250 karakter.',

                'bagian_kategori.required' => 'Bagian kategori wajib dipilih.',
                'bagian_kategori.string' => 'Bagian kategori harus berupa teks.',
                'bagian_kategori.max' => 'Bagian kategori maksimal 250 karakter.',
                'bagian_kategori.in' => 'Bagian kategori harus berupa Bangunan atau Perlengkapan.',

                'sub_kategori.array' => 'Sub kategori harus berupa daftar.',
                'sub_kategori.*.string' => 'Sub kategori harus berupa teks.',
                'sub_kategori.*.max' => 'Sub kategori maksimal 250 karakter.',
            ]
        );

        $validated['kode_unit'] = Auth::user()->pegawai?->unit?->kode_unit;

        KategoriKerusakan::create($validated);
    }

    public function update(KategoriKerusakan $kategoriKerusakan, Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:250',
            'bagian_kategori' => 'required|string|max:250|in:Bangunan,Perlengkapan',
            'sub_kategori' => 'nullable|array',
            'sub_kategori.*' => 'nullable|string|max:250',
        ], [
            'name.required' => 'Nama kategori wajib diisi.',
            'name.string' => 'Nama kategori harus berupa teks.',
            'name.max' => 'Nama kategori maksimal 250 karakter.',

            'bagian_kategori.required' => 'Bagian kategori wajib dipilih.',
            'bagian_kategori.string' => 'Bagian kategori harus berupa teks.',
            'bagian_kategori.max' => 'Bagian kategori maksimal 250 karakter.',
            'bagian_kategori.in' => 'Bagian kategori harus berupa Bangunan atau Perlengkapan.',

            'sub_kategori.array' => 'Sub kategori harus berupa daftar.',
            'sub_kategori.*.string' => 'Sub kategori harus berupa teks.',
            'sub_kategori.*.max' => 'Sub kategori maksimal 250 karakter.',
        ]);

        $kategoriKerusakan->update($validated);
    }

    public function destroy(KategoriKerusakan $kategoriKerusakan)
    {
        $kategoriKerusakan->delete();
    }
}
