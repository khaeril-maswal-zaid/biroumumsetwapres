@php
    function getBulan($bulan)
    {
        $bulan = $bulan ?? date('m');

        if (is_string($bulan)) {
            $bulan = (int) $bulan;
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

        return $bulanList[$bulan];
    }
@endphp

<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>OPNAME FISIK BARANG PERSEDIAAN</title>
    <style>
        body {
            font-family: sans-serif;
            font-size: 12px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        th,
        td {
            border: 1px solid #000;
            padding: 6px;
        }

        th {
            background: #f2f2f2;
        }

        h3 {
            text-align: center;
            margin: 0px;
        }
    </style>
</head>

<body>

    <h3>OPNAME FISIK BARANG PERSEDIAAN</h3>
    <h3 style="margin-bottom: 20px">{{ getBulan($bulan) }} {{ $tahun }}</h3>

    <table>
        <thead>
            <tr>
                <th>No</th>
                <th>Jenis Barang</th>
                <th>Kategori</th>
                <th>Satuan</th>
                <th>Jumlah</th>
                <th>Pemakaian</th>
                <th>Saldo</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($data as $i => $row)
                <tr>
                    <td>{{ $i + 1 }}</td>
                    <td>{{ $row['name'] }}</td>
                    <td>{{ $row['kategori'] }}</td>
                    <td>{{ $row['satuan'] }}</td>
                    <td>{{ $row['jumlah'] }}</td>
                    <td>{{ $row['pemakaian'] }}</td>
                    <td>{{ $row['saldo'] }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

</body>

</html>
