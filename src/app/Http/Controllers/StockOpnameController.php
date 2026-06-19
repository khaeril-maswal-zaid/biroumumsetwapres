<?php

namespace App\Http\Controllers;

use App\Models\StockOpname;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use Maatwebsite\Excel\Facades\Excel;
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
        ]);

        DB::transaction(function () use ($validated) {
            foreach ($validated as $item) {
                $quantity = (int) $item['quantity'];
                $unitPrice = (int) $item['unit_price'];
                $totalPrice = $quantity * $unitPrice;

                StockOpname::create([
                    'kode_unit' => Auth::user()->pegawai?->unit?->kode_unit,
                    'daftar_atk_id' => $item['daftar_atk_id'],
                    'quantity' => $quantity,
                    'remaining_quantity' => $quantity,
                    'type' => 'Perolehan',
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
                'min_stok'  => $i->available_stock,
                'jumlah'    => (int) ($i->total_perolehan ?? 0),
                'pemakaian' => (int) ($i->total_pemakaian ?? 0),
                'saldo'     => (int) ($i->sisa ?? 0),
            ]),
            'filters' => $request->only(['bulan', 'tahun', 'daftar_atk_id']),
        ]);
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
            ->get();

        $perolehan = $transactions->where('type', 'Perolehan')->keyBy('id');
        $pemakaian = $transactions->where('type', 'Pemakaian')->groupBy('source_stockopname_id');

        $ordered = collect();

        // urutkan perolehan berdasarkan tanggal (FIFO layer)
        foreach ($perolehan->sortBy('created_at') as $p) {

            // tampilkan perolehan dulu
            $ordered->push($p);

            // lalu semua pemakaian yg ambil dari layer ini
            if (isset($pemakaian[$p->id])) {
                foreach ($pemakaian[$p->id]->sortBy('created_at') as $use) {
                    $ordered->push($use);
                }
            }
        }

        foreach ($ordered as $t) {
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
            'rows' => $rows,
            'filters' => $request->only(['bulan', 'tahun']),
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

    public function kartuBukuPersediaan(Request $request, DaftarAtk $daftarAtk)
    {
        $type = $request->route('type');

        $bulan = $request->bulan;
        $tahun = $request->tahun;

        $start = Carbon::create($tahun, $bulan)->startOfMonth();
        $end = Carbon::create($tahun, $bulan)->endOfMonth();

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
        $openingUnitPrice = $openingUnits ? (int) round($openingValue / $openingUnits) : 0;

        $runningUnits = $openingUnits;

        $rows = [];

        \Carbon\Carbon::setLocale('id');

        // Saldo awal (tampilkan di tanggal periode pertama)
        $rows[] = [
            'tanggal' => $start->toDateString(),
            'uraian' => 'Saldo per ' . $start->copy()->subDay()->translatedFormat('d F Y'),
            'quantity' => $openingUnits,
            'harga' => $openingUnitPrice,
            'type' => 'Perolehan',
            'saldo' => $runningUnits,
        ];

        $opnames = StockOpname::query()
            ->where('daftar_atk_id', $daftarAtk->id)
            ->whereBetween('created_at', [$start, $end])
            ->with('permintaanAtk.pemesan.pegawai')
            ->orderBy('created_at', 'asc')
            ->get();

        foreach ($opnames as $op) {
            $qty = (int) $op->quantity;
            $harga = (int) $op->unit_price;

            // uraian: for pemakaian prefer pemesan name or deskripsi, for perolehan prefer deskripsi
            if ($op->type === 'Pemakaian') {
                $uraian = $op->permintaanAtk?->pemesan->pegawai?->name ?? $op->permintaanAtk?->deskripsi ?? $op->type;
                $runningUnits -= $qty;
            } else {
                $uraian = $op->permintaanAtk?->deskripsi ?? $op->type;
                $runningUnits += $qty;
            }

            $rows[] = [
                'tanggal' => $op->created_at->toDateString(),
                'uraian' => $uraian,
                'quantity' => $qty,
                'harga' => $harga,
                'type' => $op->type,
                'saldo' => $runningUnits,
            ];
        }

        $data = [
            'atk' => $daftarAtk,
            'filters' => $request->only(['bulan', 'tahun']),
            'dataStok' => $rows,
        ];

        if ($type === 'pdf') {
            $pdf = Pdf::loadView('pdf.kartu-buku-persediaan', $data)
                ->setPaper('A4', 'landscape');

            return $pdf->stream("kartu-buku-persediaan-{$bulan}-{$tahun}.pdf");
        }

        return Inertia::render('admin/daftaratk/kartu-buku-persediaan', $data);
    }

    public function importPerolehan(Request $request)
    {
        $request->validate([
            'file' => ['required', 'file', 'mimes:xlsx,xls'],
        ]);

        // Ambil data excel jadi array
        $rows = Excel::toCollection(null, $request->file('file'))->first();

        if ($rows->isEmpty()) {
            return back()->withErrors(['file' => 'File kosong.']);
        }

        // Ambil header
        $header = $rows->first()->map(fn($h) => trim($h))->toArray();

        $expectedHeader = [
            'No',
            'Kode ATK',
            'Nama ATK',
            'Kategori',
            'Satuan',
            'Perolehan',
            'Harga Satuan',
        ];

        if ($header !== $expectedHeader) {
            return back()->withErrors(['file' => 'Format header tidak sesuai template.']);
        }

        // Buang header
        $dataRows = $rows->skip(1);

        $payload = [];
        $errors = [];

        foreach ($dataRows as $index => $row) {
            if ($row->filter()->isEmpty()) {
                continue;
            }

            $kodeAtk = $row[1];
            $quantity = $row[5];
            $unitPrice = $row[6];

            // Cari daftar_atk_id dari kode
            $atk = DaftarAtk::where('kode_atk', $kodeAtk)->first();

            if (!$atk) {
                $errors[] = "Baris " . ($index) . ": Kode ATK tidak ditemukan";
                continue;
            }

            $item = [
                'daftar_atk_id' => $atk->id,
                'quantity' => (int) $quantity,
                'unit_price' => (int) $unitPrice,
            ];

            // Validasi per row
            $validator = Validator::make(
                $item,
                [
                    'daftar_atk_id' => ['required', 'exists:daftar_atks,id'],
                    'quantity' => ['required', 'integer', 'min:1'],
                    'unit_price' => ['required', 'integer', 'min:0'],
                ],
                [
                    // custom messages
                    'daftar_atk_id.required' => 'Barang wajib dipilih.',
                    'daftar_atk_id.exists'   => 'Barang tidak valid atau tidak ditemukan.',

                    'quantity.required' => 'Jumlah wajib diisi.',
                    'quantity.integer'  => 'Jumlah harus berupa angka.',
                    'quantity.min'      => 'Jumlah minimal 1.',

                    'unit_price.required' => 'Harga satuan wajib diisi.',
                    'unit_price.integer'  => 'Harga satuan harus berupa angka.',
                    'unit_price.min'      => 'Harga satuan tidak boleh kurang dari 0.',
                ],
                [
                    // custom attribute (opsional, kalau pakai :attribute di message)
                    'daftar_atk_id' => 'Barang',
                    'quantity' => 'Jumlah',
                    'unit_price' => 'Harga satuan',
                ]
            );

            if ($validator->fails()) {
                $errors[] = "Baris " . ($index) . ": " . implode(', ', $validator->errors()->all());
                continue;
            }

            $payload[] = $item;
        }

        // Kalau ada error → return
        if (!empty($errors)) {
            return back()->withErrors([
                'import' => $errors,
            ]);
        }

        foreach ($payload as $item) {
            StockOpname::create([
                'kode_unit' => Auth::user()->pegawai?->unit?->kode_unit,
                'daftar_atk_id' => $item['daftar_atk_id'],
                'quantity' => $item['quantity'],
                'remaining_quantity' => $item['quantity'],
                'type' => 'Perolehan',
                'unit_price' => $item['unit_price'],
                'total_price' => $item['quantity'] * $item['unit_price'],
            ]);

            // Lock row biar aman dari race condition
            $daftar = DaftarAtk::lockForUpdate()
                ->find($item['daftar_atk_id']);

            if ($daftar) {
                $daftar->increment('quantity', $item['quantity']);
            }
        }

        return back()->with('success', 'Import berhasil');
    }
}
