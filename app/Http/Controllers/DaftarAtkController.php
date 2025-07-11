<?php

namespace App\Http\Controllers;

use App\Models\DaftarAtk;
use Illuminate\Http\Request;
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
        $daftarAtk->update([
            'name' => $request->input('name'),
            'category' => $request->input('category'),
            'unit' => $request->input('unit'),
        ]);
    }

    public function store(Request $request)
    {
        DaftarAtk::create([
            'kode_atk' => $request->input('kode_atk'),
            'name' => $request->input('name'),
            'category' => $request->input('category'),
            'unit' => $request->input('unit'),
        ]);
    }

    public function destroy(DaftarAtk $daftarAtk)
    {
        $daftarAtk->delete();
    }
}
