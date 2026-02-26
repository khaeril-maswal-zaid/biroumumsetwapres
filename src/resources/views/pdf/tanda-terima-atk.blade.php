<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>Tanda Terima ATK</title>
    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 12px;
            margin: 20px;
        }

        .text-center {
            text-align: center;
        }

        .text-right {
            text-align: right;
        }

        .header {
            margin-bottom: 10px;
        }

        .title {
            font-size: 14px;
            font-weight: bold;
            margin-top: 18px;
            margin-bottom: 10px;
            text-decoration: underline
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        th,
        td {
            border: 1px solid #000;
            padding: 6px;
            vertical-align: top;
        }

        th {
            background: #f0f0f0;
        }

        .no-border td {
            border: none;
        }

        .date {
            text-align: right;
            margin-top: 20px;
            margin-right: 35px;
        }

        .signature {
            width: 100%;
        }

        .signature td {
            border: none;
            text-align: center;
            padding-top: 20px;
        }
    </style>
</head>

<body>

    {{-- Header --}}
    <div class="header text-center">
        <div>KEMENTERIAN SEKRETARIAT NEGARA RI</div>
        <div>SEKRETARIAT WAKIL PRESIDEN</div>
        <div class="title">TANDA TERIMA ATK</div>
    </div>


    <br>

    {{-- Tabel Barang --}}
    <table>
        <thead>
            <tr>
                <th width="5%">No</th>
                <th width="45%">Jenis Barang</th>
                <th width="15%">Jumlah</th>
                <th width="15%">Satuan</th>
                <th width="20%">Keterangan</th>
            </tr>
        </thead>
        <tbody>
            @forelse($items as $i => $item)
                <tr>
                    <td class="text-center">{{ $i + 1 }}</td>
                    <td>{{ $item['name'] }}</td>
                    <td class="text-center">{{ $item['approved'] }}</td>
                    <td class="text-center">{{ $item['satuan'] }}</td>
                    <td>{{ $item['keterangan'] ?? '' }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="5" class="text-center">Tidak ada data</td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <table class="no-border" style="width:97%; margin-top:20px;">
        <tr>
            <td width="70%"></td>
            <td width="30%">
                <table class="no-border" style="width:100%;">
                    <tr>
                        <td width="50%">
                            Jakarta,
                        </td>
                        <td width="50%" class="text-right">
                            {{ now()->format('Y') }}
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

    {{-- Tanda Tangan --}}
    <table class="signature">
        <tr>
            <td width="33%">
                <br>
                Yang Menyerahkan,

                <br><br><br><br><br><br>
                (____________________)
            </td>
            <td width="33%">
                <br>
                Yang Menerima,

                <br><br><br><br><br><br>
                (____________________)
            </td>
            <td width="34%">
                Mengetahui <br>
                Kepala Subbagian <br>
                Pengelolaan Perlengkapan

                <br><br><br><br><br>
                ({{ $penerima ?? '____________________' }})
            </td>
        </tr>
    </table>

</body>

</html>
