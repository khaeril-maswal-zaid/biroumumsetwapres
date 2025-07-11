<?php

namespace App\Http\Controllers;

use App\Models\KategoriKerusakan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KategoriKerusakanController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/kategorikerusakan/page', [
            'kategoriKerusakan' => KategoriKerusakan::latest()->paginate(15),
        ]);
    }

    public function store(Request $request)
    {
        KategoriKerusakan::create([
            'name' => $request->input('name'),
            'kode_kerusakan' => $request->input('kode_kerusakan'),
        ]);
    }

    public function update(KategoriKerusakan $kategoriKerusakan, Request $request)
    {
        $kategoriKerusakan->update([
            'name' => $request->input('name'),
        ]);
    }

    public function destroy(KategoriKerusakan $kategoriKerusakan)
    {
        $kategoriKerusakan->delete();
    }
}
