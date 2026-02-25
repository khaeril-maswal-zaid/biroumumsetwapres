<?php

namespace App\Http\Controllers;

use App\Models\StockOpname;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\DaftarAtk;
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
            'daftarAtk' => DaftarAtk::orderBy('name', 'asc')->get(),
            'stockOpnames' => StockOpname::with('daftarAtk')
                ->orderBy('created_at', 'desc')      // urut kronologis
                ->orderBy('id', 'desc')              // safety
                // ->latest()
                ->get()
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

    public function detailPemakaian(Request $request, DaftarAtk $daftarAtk)
    {
        $type = $request->route('type');

        $bulan   = $request->bulan;
        $tahun   = $request->tahun;

        $start = Carbon::create($tahun, $bulan)->startOfMonth();
        $end   = Carbon::create($tahun, $bulan)->endOfMonth();

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

        $bulan = now()->format('m');
        $tahun = now()->format('Y');

        // Dummy rows (meniru format laporan)
        $rows = [
            [
                'tanggal' => '01-01-2025',
                'keterangan' => 'Saldo Awal',
                'no_dok' => '',

                'masuk_unit' => 0,
                'masuk_harga' => 0,
                'masuk_jumlah' => 0,

                'keluar_unit' => 0,
                'keluar_harga' => 0,
                'keluar_jumlah' => 0,

                'saldo_unit' => 82,
                'saldo_harga' => 20000,
                'saldo_jumlah' => 1640000,

                'is_saldo' => true
            ],
            [
                'tanggal' => '31-01-2025',
                'keterangan' => 'Habis Pakai',
                'no_dok' => '01/GD/I/2025',

                'masuk_unit' => 0,
                'masuk_harga' => 0,
                'masuk_jumlah' => 0,

                'keluar_unit' => 81,
                'keluar_harga' => 20000,
                'keluar_jumlah' => 1620000,

                'saldo_unit' => 1,
                'saldo_harga' => 20000,
                'saldo_jumlah' => 20000,

                'is_saldo' => true
            ],
            [
                'tanggal' => '10-03-2025',
                'keterangan' => 'Pembelian',
                'no_dok' => '0033/UP/2025',

                'masuk_unit' => 60,
                'masuk_harga' => 16500,
                'masuk_jumlah' => 990000,

                'keluar_unit' => 0,
                'keluar_harga' => 0,
                'keluar_jumlah' => 0,

                'saldo_unit' => 61,
                'saldo_harga' => 16500,
                'saldo_jumlah' => 1010000,

                'is_saldo' => true
            ],
            [
                'tanggal' => '31-03-2025',
                'keterangan' => 'Habis Pakai',
                'no_dok' => '03/GD/III/2025',

                'masuk_unit' => 0,
                'masuk_harga' => 0,
                'masuk_jumlah' => 0,

                'keluar_unit' => 45,
                'keluar_harga' => 16500,
                'keluar_jumlah' => 742500,

                'saldo_unit' => 16,
                'saldo_harga' => 16500,
                'saldo_jumlah' => 264000,

                'is_saldo' => true
            ],
        ];

        $data = [
            'periode_awal' => '01-01-2025',
            'periode_akhir' => '31-12-2025',

            'nama_uapkpb' => 'Persediaan Perlengkapan',
            'kode_uapkpb' => '007.01.0199.403998.005.KP',

            'metode_pencatatan' => 'PERPETUAL',
            'metode_penilaian' => 'FIFO',

            'kode_barang' => '1.01.03.01.001',
            'nama_barang' => 'Ballpoint Bolliner Pilot',
            'satuan' => 'Buah',

            'rows' => $rows,
            'halaman' => '1 dari 1',

            'atk' => $daftarAtk
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
