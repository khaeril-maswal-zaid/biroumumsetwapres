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
            'daftarAtk' => DaftarAtk::orderBy('name', 'asc')->get(),
            'stockOpnames' => StockOpname::with('daftarAtk')->latest()->take(100)->get(),
        ];

        return Inertia::render('admin/daftaratk/prolehan-pemakaian', $data);
    }

    public function storeX(Request $request)
    {
        $validated = $request->validate([
            'daftar_atk_id' => 'required|exists:daftar_atks,id',
            'quantity' => 'required|integer|min:1',
            'type' => 'required|in:Perolehan',
            'unit_price' => 'required|numeric|min:0',
        ]);

        $validated['kode_unit'] = Auth::user()->pegawai?->unit?->kode_unit;
        $validated['total_price'] = $validated['quantity'] * $validated['unit_price'];

        StockOpname::create([
            'daftar_atk_id' => $validated['daftar_atk_id'],
            'kode_unit' => $validated['kode_unit'],
            'type' => 'Perolehan',
            'quantity' => $validated['quantity'],
            'remaining_quantity' => $validated['quantity'], // 🔑 PENTING
            'unit_price' => $validated['unit_price'],
            'total_price' => $validated['total_price'],
        ]);

        // Update stok total
        DaftarAtk::where('id', $validated['daftar_atk_id'])
            ->increment('quantity', $validated['quantity']);

        return redirect()->back();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'daftar_atk_id' => ['required', 'exists:daftar_atks,id'],
            'quantity' => ['required', 'integer', 'min:1'],
            'unit_price' => ['required', 'integer', 'min:0'],
            'permintaan_atk_id' => ['nullable', 'exists:permintaan_atks,id'],
            // optional: kode_unit dapat dikirim FE, kalau tidak kita ambil dari auth
            'kode_unit' => ['nullable', 'string'],
        ]);

        // normalisasi nilai
        $quantity = (int) $validated['quantity'];
        $unitPrice = (int) $validated['unit_price'];
        $totalPrice = $quantity * $unitPrice;

        $kodeUnit = $validated['kode_unit'] ?? Auth::user()->pegawai?->unit?->kode_unit ?? null;

        DB::transaction(function () use ($validated, $quantity, $unitPrice, $totalPrice, $kodeUnit) {
            $stock = StockOpname::create([
                'kode_unit' => $kodeUnit,
                'daftar_atk_id' => $validated['daftar_atk_id'],
                'quantity' => $quantity,
                'remaining_quantity' => $quantity, // untuk Perolehan kita set remaining = quantity
                'type' => 'Perolehan',
                'permintaan_atk_id' => $validated['permintaan_atk_id'] ?? null,
                'source_stockopname_id' => null,
                'unit_price' => $unitPrice,
                'total_price' => $totalPrice,
            ]);

            // update stok di DaftarAtk (naik)
            $daftar = DaftarAtk::find($validated['daftar_atk_id']);
            if ($daftar) {
                $daftar->increment('quantity', $quantity);
            }
        });
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
                $q->where('type', 'Perolehan');

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
            ->orderBy('name', 'asc')
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

    public function detailPemakaian(Request $request)
    {
        $kodeAtk = $request->kodeAtk;
        $bulan   = $request->bulan;
        $tahun   = $request->tahun;

        $start = Carbon::create($tahun, $bulan)->startOfMonth();
        $end   = Carbon::create($tahun, $bulan)->endOfMonth();

        $data = StockOpname::query()
            ->where('type', 'Pemakaian')
            ->whereBetween('created_at', [$start, $end])
            ->whereHas(
                'daftarAtk',
                fn($q) =>
                $q->where('kode_atk', $kodeAtk)
            )
            ->with([
                'daftarAtk:id,name,satuan',
                'permintaanAtk.pemesan.pegawai',
            ])
            ->get()
            ->map(fn($row) => [
                'tanggal'        => $row->created_at,
                'jumlah'         => $row->quantity,
                'itemAtk'       => $row->daftarAtk,
                'satuan'         => $row->daftarAtk->satuan,
                'digunakan_oleh' => $row->permintaanAtk?->pemesan->pegawai?->name,
                'unit_kerja'     => $row->permintaanAtk?->kode_unit,
                'keterangan'     => $row->permintaanAtk?->deskripsi,
            ]);

        return Inertia::render('admin/daftaratk/detail-pemakain', [
            'Persediaan' => $data,
            'filters' => $request->only(['kode_atk', 'bulan', 'tahun']),
        ]);
    }
}
