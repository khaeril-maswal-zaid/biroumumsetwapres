<?php

namespace App\Http\Controllers;

use App\Models\DaftarAtk;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DaftarAtkController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('admin/daftaratk/page', [
            'daftarAtk' => DaftarAtk::orderBy('name', 'asc')->get(),
        ]);
    }

    public function update(DaftarAtk $daftarAtk, Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:250',
            'category' => 'required|string|max:250',
            'satuan' => 'required|string|max:250',
            'available_stock' => 'required|integer|min:0',
        ]);

        $daftarAtk->update($validated);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:250',
            'category' => 'required|string|max:250',
            'satuan' => 'required|string|max:250',
            'available_stock' => 'required|integer|min:0',
        ]);

        $validated['kode_unit'] = Auth::user()->pegawai?->unit?->kode_unit;

        DaftarAtk::create([
            'name' => $validated['name'],
            'category' => $validated['category'],
            'satuan' => $validated['satuan'],
            'kode_unit' => $validated['kode_unit'] ?? null,
            'available_stock' => $validated['available_stock'],
        ]);
    }

    public function destroy(DaftarAtk $daftarAtk)
    {
        $daftarAtk->delete();
    }
}
