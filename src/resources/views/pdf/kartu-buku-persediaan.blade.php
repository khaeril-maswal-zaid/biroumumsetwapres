<!doctype html>
<html lang="id">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Kartu Buku Persediaan</title>
    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 12px;
            color: #222
        }

        .header {
            text-align: center;
            margin-bottom: 10px
        }

        .meta {
            margin-bottom: 16px
        }

        .meta .left {
            float: left;
            width: 60%
        }

        .meta .right {
            float: right;
            width: 38%;
            text-align: right
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        th,
        td {
            border: 1px solid #444;
            padding: 6px;
            font-size: 11px
        }

        th {
            background: #f0f0f0
        }

        .text-center {
            text-align: center
        }

        .text-right {
            text-align: right
        }

        .small {
            font-size: 10px
        }

        .clearfix:after {
            content: "";
            display: table;
            clear: both
        }
    </style>
</head>

<body>
    <div class="header">
        <h2>KARTU BUKU PERSEDIAAN</h2>
        <div class="small">Periode:
            {{ $filters['bulan'] ?? '' ? \Carbon\Carbon::createFromDate($filters['tahun'] ?? now()->year, $filters['bulan'])->translatedFormat('F Y') : $filters['tahun'] ?? now()->year }}
        </div>
    </div>

    <div class="meta clearfix">
        <div class="left">
            <div><strong>Kode Barang:</strong> {{ $atk->kode_atk ?? '-' }}</div>
            <div><strong>Nama Barang:</strong> {{ $atk->name ?? '-' }}</div>
        </div>
        <div class="right">
            <div><strong>Satuan:</strong> {{ $atk->satuan ?? '-' }}</div>
            <div><strong>Kategori:</strong> {{ $atk->kategoriAtk->nama_kategori ?? '-' }}</div>
        </div>
    </div>

    <table>
        <thead>
            <tr>
                <th style="width:30px">No</th>
                <th>Tanggal</th>
                <th>Diterima / Diserahkan</th>
                <th class="text-center">Masuk</th>
                <th class="text-center">Harga Perolehan</th>
                <th class="text-center">Keluar</th>
                <th class="text-center">Saldo Jumlah</th>
                <th class="text-center">Saldo Nilai</th>
            </tr>
        </thead>
        <tbody>
            @if (count($dataStok) > 0)
                @foreach ($dataStok as $idx => $op)
                    <tr>
                        <td class="text-center">{{ $idx + 1 }}</td>
                        <td>{{ \Carbon\Carbon::parse($op['tanggal'])->translatedFormat('d F Y') }}</td>
                        <td>{{ $op['uraian'] ?? ($op['keterangan'] ?? '-') }}</td>
                        <td class="text-center">
                            {{ ($op['type'] ?? '') === 'Perolehan' ? $op['quantity'] ?? '-' : '-' }}</td>
                        <td class="text-center">
                            {{ isset($op['harga']) && $op['harga'] > 0 ? number_format($op['harga'], 0, ',', '.') : '-' }}
                        </td>
                        <td class="text-center">
                            {{ ($op['type'] ?? '') === 'Pemakaian' ? $op['quantity'] ?? '-' : '-' }}</td>
                        <td class="text-center">{{ $op['saldo'] ?? '-' }}</td>
                        <td class="text-center">
                            {{ isset($op['saldo']) && isset($op['harga']) ? number_format($op['saldo'] * ($op['harga'] ?? 0), 0, ',', '.') : '-' }}
                        </td>
                    </tr>
                @endforeach
            @else
                <tr>
                    <td colspan="8" class="text-center small">Tidak ada data</td>
                </tr>
            @endif
        </tbody>
    </table>

    <div style="margin-top:30px">
        <table style="width:100%; border:0">
            <tr>
                <td style="border:0; width:60%"></td>
                <td style="border:0; text-align:center">
                    <div>Jakarta, {{ \Carbon\Carbon::now()->translatedFormat('d F Y') }}</div>
                    <div style="height:60px"></div>
                    <div>__________________________</div>
                    <div class="small">(Penanggung Jawab)</div>
                </td>
            </tr>
        </table>
    </div>
</body>

</html>
