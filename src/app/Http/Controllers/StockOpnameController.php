<?php

namespace App\Http\Controllers;

use App\Models\DaftarAtk;
use App\Models\StockOpname;
use Illuminate\Http\Request;

class StockOpnameController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'daftar_atk_id' => 'required|exists:daftar_atks,id',
            'quantity' => 'required|integer|min:1',
            'type' => 'required|in:Masuk,Keluar',
            'unit_price' => 'required|numeric|min:0',
            'total_price' => 'required|numeric|min:0',
        ]);

        StockOpname::create($validated);

        // Update quantity di DaftarAtk
        $daftarAtk = DaftarAtk::find($validated['daftar_atk_id']);
        if ($validated['type'] === 'Masuk') {
            $daftarAtk->increment('quantity', $validated['quantity']);
        } else {
            $daftarAtk->decrement('quantity', $validated['quantity']);
        }

        return redirect()->back();
    }
}
