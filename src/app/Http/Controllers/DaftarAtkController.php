<?php

namespace App\Http\Controllers;

use App\Exports\AtkTemplateExport;
use App\Models\DaftarAtk;
use App\Models\KategoriAtk;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class DaftarAtkController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('admin/daftaratk/page', [
            'daftarAtk' => DaftarAtk::orderBy('name', 'asc')
                ->with('kategoriAtk:id,nama_kategori')
                ->get(),
            'categories' => KategoriAtk::select('id', 'nama_kategori')->orderBy('nama_kategori', 'asc')->get(),
        ]);
    }

    public function update(DaftarAtk $daftarAtk, Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:250',
            'kategori_atk_id' => 'required|exists:kategori_atks,id',
            'satuan' => 'required|string|max:250',
            'available_stock' => 'required|integer|min:0',
        ]);

        $daftarAtk->update($validated);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:250',
            'kode_kategori_atk' => 'required|exists:kategori_atks,kode_kategori',
            'satuan' => 'required|string|max:250',
            'available_stock' => 'required|integer|min:0',
        ]);

        $validated['kode_unit'] = Auth::user()->pegawai?->unit?->kode_unit;

        DaftarAtk::create([
            'name' => $validated['name'],
            'kategori_atk_id' => KategoriAtk::where('kode_kategori', $validated['kode_kategori_atk'])->first()->id,
            'satuan' => $validated['satuan'],
            'kode_unit' => $validated['kode_unit'] ?? null,
            'available_stock' => $validated['available_stock'],
        ]);
    }

    public function destroy(DaftarAtk $daftarAtk)
    {
        $daftarAtk->delete();
    }

    public function downloadTemplate()
    {
        return Excel::download(new AtkTemplateExport, 'template-import-perolehan-atk.xlsx');
    }
}
