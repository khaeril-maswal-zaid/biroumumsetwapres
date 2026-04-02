<?php

namespace Database\Seeders;

use App\Models\KategoriAtk;
use Illuminate\Database\Seeder;

class KategoriAtkSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            1 => 'Alat Tulis',
            2 => 'Tinta Tulis, Tinta Stempel',
            3 => 'Penjepit Kertas',
            4 => 'Penghapus/Korektor',
            5 => 'Buku Tulis',
            6 => 'Ordner dan Map',
            7 => 'Penggaris',
            8 => 'Cutter (Alat Tulis Kantor)',
            9 => 'Pita Mesin Ketik',
            10 => 'Alat Perekat',
            11 => 'Alat Tulis Kantor Lainnya',
            12 => 'Kertas HVS',
            13 => 'Kertas Cover',
            14 => 'Amplop',
            15 => 'Kop Surat',
            16 => 'Kertas dan Cover Lainnya',
            17 => 'Bahan Cetak Lainnya',
            18 => 'Continuous Form',
            19 => 'Tinta / Toner Printer',
            20 => 'Bahan Komputer Lainnya',
            21 => 'Alat Pengikat',
            22 => 'Batu Baterai',
        ];

        foreach ($data as $id => $nama) {
            KategoriAtk::updateOrCreate(
                ['id' => $id],
                ['nama_kategori' => $nama]
            );
        }
    }
}
