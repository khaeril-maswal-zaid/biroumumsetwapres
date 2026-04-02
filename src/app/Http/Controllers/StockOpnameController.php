<?php

namespace App\Http\Controllers;

use App\Models\StockOpname;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\DaftarAtk;
use App\Models\KategoriAtk;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class StockOpnameController extends Controller
{
    public function index()
    {
        $data = [
            'daftarAtk' => DaftarAtk::orderBy('name', 'asc')
                ->with('kategoriAtk:id,nama_kategori')
                ->get(),
            'stockOpnames' => StockOpname::with('daftarAtk')
                ->orderBy('created_at', 'desc')
                ->orderBy('id', 'desc')
                ->get(),
            'categories' => KategoriAtk::select('id', 'nama_kategori')
                ->orderBy('nama_kategori', 'asc')
                ->get(),
        ];

        return Inertia::render('admin/daftaratk/prolehan-pemakaian', $data);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            '*.daftar_atk_id' => ['required', 'exists:daftar_atks,id'],
            '*.quantity' => ['required', 'integer', 'min:1'],
            '*.unit_price' => ['required', 'integer', 'min:0'],
            '*.permintaan_atk_id' => ['nullable', 'exists:permintaan_atks,id'],
            '*.kode_unit' => ['nullable', 'string'],
        ]);

        DB::transaction(function () use ($validated) {

            foreach ($validated as $item) {

                $quantity = (int) $item['quantity'];
                $unitPrice = (int) $item['unit_price'];
                $totalPrice = $quantity * $unitPrice;

                $kodeUnit = $item['kode_unit']
                    ?? Auth::user()->pegawai?->unit?->kode_unit
                    ?? null;

                $stock = StockOpname::create([
                    'kode_unit' => $kodeUnit,
                    'daftar_atk_id' => $item['daftar_atk_id'],
                    'quantity' => $quantity,
                    'remaining_quantity' => $quantity,
                    'type' => 'Perolehan',
                    'permintaan_atk_id' => $item['permintaan_atk_id'] ?? null,
                    'source_stockopname_id' => null,
                    'unit_price' => $unitPrice,
                    'total_price' => $totalPrice,
                ]);

                // Lock row biar aman dari race condition
                $daftar = DaftarAtk::lockForUpdate()
                    ->find($item['daftar_atk_id']);

                if ($daftar) {
                    $daftar->increment('quantity', $quantity);
                }
            }
        });

        return back()->with('success', 'Data berhasil disimpan.');
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
            ->with('kategoriAtk:id,nama_kategori')
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
                'kategori'  => $i->kategoriAtk->nama_kategori ?? 'Lainnya',
                'satuan'    => $i->satuan,
                'jumlah'    => (int) ($i->total_perolehan ?? 0),
                'pemakaian' => (int) ($i->total_pemakaian ?? 0),
                'saldo'     => (int) ($i->sisa ?? 0),
            ]),
            'filters' => $request->only(['bulan', 'tahun', 'daftar_atk_id']),
        ]);
    }

    public function detailPemakaian(Request $request, DaftarAtk $daftarAtk)
    {
        $type = $request->route('type');

        $bulan   = $request->bulan;
        $tahun   = $request->tahun ?? now()->format('Y');

        // Jika bulan tidak dikirim, ambil seluruh tahun dari param `tahun`
        if ($bulan) {
            $start = Carbon::create($tahun, $bulan)->startOfMonth();
            $end   = Carbon::create($tahun, $bulan)->endOfMonth();
        } else {
            $start = Carbon::create($tahun)->startOfYear();
            $end   = Carbon::create($tahun)->endOfYear();
        }

        $stockOpname = StockOpname::query()
            ->where('type', 'Pemakaian')
            ->whereBetween('created_at', [$start, $end])
            ->whereHas(
                'daftarAtk',
                fn($q) =>
                $q->where('kode_atk', $daftarAtk->kode_atk)
            )
            ->with([
                'daftarAtk:id,name,satuan,kode_atk',
                'permintaanAtk.pemesan.pegawai',
            ])
            ->get()
            ->map(fn($row) => [
                'tanggal'        => $row->created_at,
                'jumlah'         => $row->quantity,
                'harga'         => $row->unit_price,
                'total'         => $row->total_price,
                'itemAtk'       => $row->daftarAtk,
                'satuan'         => $row->daftarAtk->satuan,
                'digunakan_oleh' => $row->permintaanAtk?->pemesan->pegawai?->name,
                'unit_kerja'     => $row->permintaanAtk?->kode_unit,
                'keterangan'     => $row->permintaanAtk?->deskripsi,
            ]);

        $data =    [
            'Persediaan' => $stockOpname,
            'filters' => $request->only(['kode_atk', 'bulan', 'tahun']),
            'atk' => $daftarAtk
        ];

        if ($type === 'pdf') {
            $pdf = PDF::loadView('pdf.detail-pemakaian', $data)
                ->setPaper('A4', 'landscape');

            return $pdf->stream("buku-persediaan.pdf");
            return $pdf->download('detail-pemakaian.pdf');
        }

        return Inertia::render('admin/daftaratk/detail-pemakaian', $data);
    }

    public function ExportBukuPersediaan(Request $request)
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

        // Ambil data persediaan
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
                return [
                    'id' => (int)$item->id,
                    'name' => (string)$item->name,
                    'kode_atk' => (string)$item->kode_atk,
                    'kategori' => (string)$item->category,
                    'satuan' => (string)$item->satuan,
                    'jumlah' => (int)($item->total_perolehan ?? 0),
                    'pemakaian' => (int)($item->total_pemakaian ?? 0),
                    'saldo' => (int)(($item->total_perolehan ?? 0) - ($item->total_pemakaian ?? 0)),
                ];
            });

        $pdf = Pdf::loadView('pdf.buku-persediaan', [
            'data' => $items,
            'bulan' => $bulan,
            'tahun' => $tahun,
        ])->setPaper('a4', 'landscape');

        return $pdf->stream();
        return $pdf->download("buku-persediaan-{$bulan}-{$tahun}.pdf");
    }

    public function rincianBukuPersediaan(Request $request, DaftarAtk $daftarAtk)
    {
        $type = $request->route('type');
        $bulan = $request->bulan;
        $tahun = $request->tahun ?? now()->format('Y');

        // Jika bulan tidak dikirim, ambil seluruh tahun dari param `tahun`
        if ($bulan) {
            $start = Carbon::create($tahun, $bulan)->startOfMonth();
            $end = Carbon::create($tahun, $bulan)->endOfMonth();
        } else {
            $start = Carbon::create($tahun)->startOfYear();
            $end = Carbon::create($tahun)->endOfYear();
        }

        // Hitung saldo awal (sebelum periode)
        $perolehanBeforeQty = StockOpname::query()
            ->where('daftar_atk_id', $daftarAtk->id)
            ->where('type', 'Perolehan')
            ->where('created_at', '<', $start)
            ->sum('quantity');

        $pemakaianBeforeQty = StockOpname::query()
            ->where('daftar_atk_id', $daftarAtk->id)
            ->where('type', 'Pemakaian')
            ->where('created_at', '<', $start)
            ->sum('quantity');

        $perolehanBeforeValue = StockOpname::query()
            ->where('daftar_atk_id', $daftarAtk->id)
            ->where('type', 'Perolehan')
            ->where('created_at', '<', $start)
            ->sum('total_price');

        $pemakaianBeforeValue = StockOpname::query()
            ->where('daftar_atk_id', $daftarAtk->id)
            ->where('type', 'Pemakaian')
            ->where('created_at', '<', $start)
            ->sum('total_price');

        $openingUnits = (int) ($perolehanBeforeQty - $pemakaianBeforeQty);
        $openingValue = (int) ($perolehanBeforeValue - $pemakaianBeforeValue);

        $runningUnits = $openingUnits;
        $runningValue = $openingValue;

        $rows = [];

        // Saldo awal
        $rows[] = [
            'tanggal' => $start->toDateString(),
            'keterangan' => 'Saldo Awal',
            'masuk' => ['unit' => 0, 'harga' => 0, 'jumlah' => 0],
            'keluar' => ['unit' => 0, 'harga' => 0, 'jumlah' => 0],
            'saldo' => [
                'unit' => $runningUnits,
                'harga' => $runningUnits ? (int) round($runningValue / $runningUnits) : 0,
                'jumlah' => $runningValue,
            ],
            'is_saldo' => true,
        ];

        // Ambil transaksi dalam periode
        $transactions = StockOpname::query()
            ->where('daftar_atk_id', $daftarAtk->id)
            ->whereBetween('created_at', [$start, $end])
            ->orderBy('created_at', 'asc')
            ->with('permintaanAtk')
            ->get();

        foreach ($transactions as $t) {
            $in = ['unit' => 0, 'harga' => 0, 'jumlah' => 0];
            $out = ['unit' => 0, 'harga' => 0, 'jumlah' => 0];

            if ($t->type === 'Perolehan') {
                $in['unit'] = (int) $t->quantity;
                $in['harga'] = (int) $t->unit_price;
                $in['jumlah'] = (int) $t->total_price;

                $runningUnits += $in['unit'];
                $runningValue += $in['jumlah'];
            } else {
                $out['unit'] = (int) $t->quantity;
                $out['harga'] = (int) $t->unit_price;
                $out['jumlah'] = (int) $t->total_price;

                $runningUnits -= $out['unit'];
                $runningValue -= $out['jumlah'];
            }

            $saldoHarga = $runningUnits ? (int) round($runningValue / $runningUnits) : 0;
            $saldoJumlah = (int) $runningValue;

            $rows[] = [
                'tanggal' => $t->created_at->toDateString(),
                'keterangan' => $t->type,
                'masuk' => $in,
                'keluar' => $out,
                'saldo' => ['unit' => $runningUnits, 'harga' => $saldoHarga, 'jumlah' => $saldoJumlah],
                'is_saldo' => true,
            ];
        }

        $data = [
            'periode_awal' => $start->toDateString(),
            'periode_akhir' => $end->toDateString(),
            'metode_pencatatan' => 'PERPETUAL',
            'metode_penilaian' => 'BERATAN',
            'kode_barang' => $daftarAtk->kode_atk,
            'nama_barang' => $daftarAtk->name,
            'satuan' => $daftarAtk->satuan,
            'rows' => $rows,
            'filters' => $request->only(['bulan', 'tahun', 'kode_atk', 'daftar_atk_kode']),
            'halaman' => '1 dari 1',
            'atk' => $daftarAtk,
        ];

        if ($type === 'pdf') {
            $pdf = Pdf::loadView('pdf.rincian-buku-persediaan', $data)
                ->setPaper('A4', 'landscape');

            return $pdf->stream("rincian-buku-persediaan.pdf");
            return $pdf->download("rincian-buku-persediaan-{$bulan}-{$tahun}.pdf");
        }

        return Inertia::render('admin/daftaratk/rincian-buku-persediaan', $data);
    }
}
