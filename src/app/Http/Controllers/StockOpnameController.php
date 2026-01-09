<?php

namespace App\Http\Controllers;

use App\Models\StockOpname;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\DaftarAtk;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class StockOpnameController extends Controller
{
    public function index()
    {
        $data = [
            'daftarAtk' => DaftarAtk::latest()->get(),
            'stockOpnames' => StockOpname::with('daftarAtk')->latest()->take(100)->get(),
        ];

        return Inertia::render('admin/daftaratk/prolehan-pemakaian', $data);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'daftar_atk_id' => 'required|exists:daftar_atks,id',
            'quantity' => 'required|integer|min:1',
            'type' => 'required|in:Prolehan,Pemakaian',
            'unit_price' => 'required|numeric|min:0',
            'total_price' => 'required|numeric|min:0',
        ]);

        $validated['kode_unit'] = Auth::user()->pegawai?->unit?->kode_unit;

        StockOpname::create($validated);

        // Update quantity di DaftarAtk
        $daftarAtk = DaftarAtk::find($validated['daftar_atk_id']);
        if ($validated['type'] === 'Prolehan') {
            $daftarAtk->increment('quantity', $validated['quantity']);
        } else {
            $daftarAtk->decrement('quantity', $validated['quantity']);
        }

        return redirect()->back();
    }

    public function bukuPersediaan(Request $request)
    {
        $bulan  = $request->bulan;
        $tahun  = $request->tahun;
        $itemKode = $request->daftar_atk_kode;

        // Tentukan range tanggal jika bulan & tahun ada
        $start = null;
        $end   = null;

        if ($bulan && $tahun) {
            $start = Carbon::create($tahun, $bulan)->startOfMonth();
            $end   = Carbon::create($tahun, $bulan)->endOfMonth();
        }

        $items = DaftarAtk::query()
            ->withSum(['stockOpnames as total_perolehan' => function ($q) use ($start, $end) {
                $q->where('type', 'Prolehan');

                if ($start && $end) {
                    $q->whereBetween('created_at', [$start, $end]);
                }
            }], 'quantity')

            ->withSum(['stockOpnames as total_pemakaian' => function ($q) use ($start, $end) {
                $q->where('type', 'Pemakaian');

                if ($start && $end) {
                    $q->whereBetween('created_at', [$start, $end]);
                }
            }], 'quantity')

            ->when($itemKode, fn($q) => $q->where('kode_atk', $itemKode))
            ->get()
            ->map(function ($item) {
                $item->sisa = ($item->total_perolehan ?? 0) - ($item->total_pemakaian ?? 0);
                return $item;
            });

        return Inertia::render('admin/daftaratk/buku-persediaan', [
            'Persediaan' => $items->map(fn($i) => [
                'id'        => $i->id,
                'name'      => $i->name,
                'kode_atk'  => $i->kode_atk,
                'kategori'  => $i->category,
                'satuan'    => $i->satuan,
                'jumlah'    => (int) ($i->total_perolehan ?? 0),
                'pemakaian' => (int) ($i->total_pemakaian ?? 0),
                'saldo'     => (int) ($i->sisa ?? 0),
            ]),
            'filters' => $request->only(['bulan', 'tahun', 'daftar_atk_id']),
        ]);
    }
}
