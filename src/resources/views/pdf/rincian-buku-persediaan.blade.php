<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>Rincian Buku Persediaan</title>
    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 10px;
            margin: 20px;
        }

        .text-center {
            text-align: center;
        }

        .text-right {
            text-align: right;
        }

        .bold {
            font-weight: bold;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        th,
        td {
            border: 1px solid #000;
            padding: 4px;
            vertical-align: middle;
        }

        th {
            background: #eaeaea;
        }

        .no-border td {
            border: none;
            padding: 2px;
        }

        .header-title {
            font-size: 14px;
            font-weight: bold;
            margin-top: 5px;
        }

        .sub-title {
            font-size: 11px;
            margin-bottom: 10px;
        }

        .saldo-row {
            background: #7fd0cf;
            font-weight: bold;
        }

        .section-space {
            margin-top: 10px;
            margin-bottom: 5px;
        }
    </style>
</head>

<body>

    {{-- HEADER ATAS --}}
    <table class="no-border">
        <tr>
            <td width="60%">
                <div>KEMENTERIAN SEKRETARIAT NEGARA</div>
                <div>SEKRETARIAT NEGARA</div>
                <div>SATKER KONSOLIDASI KEMENTERIAN SEKRETARIAT NEGARA</div>
            </td>
            <td width="40%" class="text-center">
                <div class="header-title">RINCIAN BUKU PERSEDIAAN</div>
                <div class="sub-title">
                    PERIODE {{ $periode_awal }} S/D {{ $periode_akhir }}
                </div>
            </td>
        </tr>
    </table>

    {{-- INFO KIRI & KANAN --}}
    <table class="no-border section-space">
        <tr>
            <td width="60%">
                <div>NAMA UAPKPB : {{ $nama_uapkpb ?? '-' }} </div>
                <div>KODE UAPKPB : {{ $kode_uapkpb ?? '-' }} </div>
                <br>
                <div>METODE PENCATATAN : {{ $metode_pencatatan ?? '-' }} </div>
                <div>METODE PENILAIAN : {{ $metode_penilaian ?? '-' }} </div>
            </td>
            <td width="40%">
                <div>KODE BARANG : {{ $kode_barang }}</div>
                <div>NAMA BARANG : {{ $nama_barang }}</div>
                <div>SATUAN : {{ $satuan }}</div>
            </td>
        </tr>
    </table>

    {{-- TABEL --}}
    <table>
        <thead>
            <tr>
                <th rowspan="2" width="3%">No</th>
                <th rowspan="2" width="7%">Tanggal</th>
                <th rowspan="2" width="15%">Keterangan</th>


                <th colspan="3">Masuk</th>
                <th colspan="3">Keluar</th>
                <th colspan="3">Saldo Persediaan</th>
            </tr>
            <tr>
                <th width="5%">Unit</th>
                <th width="8%">Harga</th>
                <th width="10%">Jumlah</th>

                <th width="5%">Unit</th>
                <th width="8%">Harga</th>
                <th width="10%">Jumlah</th>

                <th width="5%">Unit</th>
                <th width="8%">Harga</th>
                <th width="10%">Jumlah</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($rows as $i => $row)
                {{-- Baris transaksi --}}
                <tr>
                    <td class="text-center">{{ $i + 1 }}</td>
                    <td class="text-center">{{ $row['tanggal'] }}</td>
                    <td>{{ $row['keterangan'] }}</td>

                    <td class="text-right">{{ $row['masuk']['unit'] ?? 0 }}</td>
                    <td class="text-right">{{ number_format($row['masuk']['harga'] ?? 0) }}</td>
                    <td class="text-right">{{ number_format($row['masuk']['jumlah'] ?? 0) }}</td>

                    <td class="text-right">{{ $row['keluar']['unit'] ?? 0 }}</td>
                    <td class="text-right">{{ number_format($row['keluar']['harga'] ?? 0) }}</td>
                    <td class="text-right">{{ number_format($row['keluar']['jumlah'] ?? 0) }}</td>

                    <td class="text-right">{{ $row['saldo']['unit'] ?? 0 }}</td>
                    <td class="text-right">{{ number_format($row['saldo']['harga'] ?? 0) }}</td>
                    <td class="text-right">{{ number_format($row['saldo']['jumlah'] ?? 0) }}</td>
                </tr>

                {{-- Baris saldo highlight --}}
                @if (!empty($row['is_saldo']))
                    <tr class="saldo-row">
                        <td colspan="9" class="text-right">Saldo</td>
                        <td class="text-right">{{ $row['saldo']['unit'] ?? 0 }}</td>
                        <td class="text-right">{{ number_format($row['saldo']['harga'] ?? 0) }}</td>
                        <td class="text-right">{{ number_format($row['saldo']['jumlah'] ?? 0) }}</td>
                    </tr>
                @endif
            @endforeach
        </tbody>
    </table>

    {{-- FOOTER --}}
    <table class="no-border section-space">
        <tr>
            <td width="50%">
                {{ now()->format('d-m-Y') }}
            </td>
            <td width="50%" class="text-right">
                {{ $halaman ?? '1 dari 1' }}
            </td>
        </tr>
    </table>

</body>

</html>
