@php
    use Carbon\Carbon;

    function getBulan($bulan)
    {
        if (!$bulan) {
            return '';
        }
        $bulanList = [
            1 => 'Januari',
            2 => 'Februari',
            3 => 'Maret',
            4 => 'April',
            5 => 'Mei',
            6 => 'Juni',
            7 => 'Juli',
            8 => 'Agustus',
            9 => 'September',
            10 => 'Oktober',
            11 => 'November',
            12 => 'Desember',
        ];
        return $bulanList[(int) $bulan];
    }

    function formatTanggalIna($tanggal)
    {
        return Carbon::parse($tanggal)->translatedFormat('d F Y');
    }
@endphp

<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>Detail Pemakaian</title>
    <style>
        body {
            font-family: sans-serif;
            font-size: 11px;
        }

        /* Table umum */
        table {
            width: 100%;
            border-collapse: collapse;
        }

        th,
        td {
            border: 0.5px solid #000;
            padding: 5px;
        }

        th {
            background: #f2f2f2;
        }

        /* Alignment */
        .text-right {
            text-align: right;
        }

        .text-center {
            text-align: center;
        }

        /* Header instansi */
        .header {
            text-align: center;
            font-size: 12px;
            font-weight: bold;
            margin-bottom: 5px;
        }

        .title {
            font-size: 14px;
            margin-top: 4px;
        }

        /* Header info barang (tanpa border) */
        .header-table,
        .header-table td {
            border: none !important;
            padding: 0;
        }

        .header-table {
            margin-bottom: 10px;
        }

        .title-right {
            text-align: right;
        }

        .title-main {
            font-size: 16px;
            font-weight: bold;
        }

        .text-muted {
            color: #555;
            font-size: 11px;
        }
    </style>
</head>

<body>

    {{-- Header --}}

    <div class="header text-center">
        <div>KEMENTERIAN SEKRETARIAT NEGARA RI</div>
        <div>SEKRETARIAT WAKIL PRESIDEN</div>
    </div>


    <br>
    <table class="header-table">
        <tr>
            <td>
                <strong>{{ $atk->name }}</strong><br>
                <span class="text-muted">{{ $atk->kode_atk }}</span>
            </td>
            <td class="title-right">
                <div class="title-main">DETAIL PEMAKAIAN ATK</div>
                <div class="text-muted">
                    Periode:
                    {{ getBulan($filters['bulan'] ?? null) }}
                    {{ $filters['tahun'] ?? '' }}
                </div>
            </td>
        </tr>
    </table>

    {{-- Table --}}
    <table>
        <thead>
            <tr>
                <th width="30">No</th>
                <th width="110">Tanggal Pemakaian</th>
                <th width="70" class="text-right">Jumlah</th>
                <th width="60">Satuan</th>
                <th width="90">Harga Satuan</th>
                <th width="90">Total Harga</th>
                <th width="120">Digunakan Oleh</th>
                <th>Keterangan</th>
            </tr>
        </thead>
        <tbody>
            @forelse ($Persediaan as $i => $row)
                <tr>
                    <td class="text-center">{{ $i + 1 }}</td>
                    <td>{{ formatTanggalIna($row['tanggal']) }}</td>
                    <td class="text-right">{{ $row['jumlah'] }}</td>
                    <td>{{ $row['satuan'] }}</td>
                    <td class="text-right">{{ number_format($row['harga'], 0, ',', '.') }}</td>
                    <td class="text-right">{{ number_format($row['total'], 0, ',', '.') }}</td>
                    <td>{{ $row['digunakan_oleh'] }}</td>
                    <td>{{ $row['keterangan'] }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="8" class="text-center">
                        Tidak ada data pemakaian
                    </td>
                </tr>
            @endforelse
        </tbody>
    </table>

</body>

</html>
