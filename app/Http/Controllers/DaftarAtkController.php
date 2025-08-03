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
            'daftarAtk' => DaftarAtk::latest()->paginate(15),
        ]);
    }

    public function update(DaftarAtk $daftarAtk, Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:250',
            'category' => 'required|string|max:250',
            'unit' => 'required|string|max:250',
        ]);

        $daftarAtk->update($validated);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'kode_atk' => 'required|string|max:250|unique:daftar_atks,kode_atk',
            'name' => 'required|string|max:250',
            'category' => 'required|string|max:250',
            'unit' => 'required|string|max:250',
        ]);

        $query = array_merge($validated, [
            'instansi_id' => Auth::user()->instansi_id
        ]);

        DaftarAtk::create($query);
    }

    public function destroy(DaftarAtk $daftarAtk)
    {
        $daftarAtk->delete();
    }
}
