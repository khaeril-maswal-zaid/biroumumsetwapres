<?php

namespace Database\Seeders;

use App\Models\KategoriKerusakan;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class KategoriKerusakanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            [
                'kode_unit' => '02',
                'name' => 'Tata Udara',
                'kode_kerusakan' => 'TU-051',
                'sub_kategori' => ['AC', 'Exhaust Fan', 'Kipas Angin']
            ],
            [
                'kode_unit' => '02',
                'name' => 'Tata Suara',
                'kode_kerusakan' => 'TS-052',
                'sub_kategori' => ['Mic Conference', 'Public Address/Penghar', 'Sound System Portable(Iron Man)']
            ],
            [
                'kode_unit' => '02',
                'name' => 'Lift',
                'kode_kerusakan' => 'KLK-053',
                'sub_kategori' => ['']
            ],
            [
                'kode_unit' => '02',
                'name' => 'Kelistrikan',
                'kode_kerusakan' => 'SNT-054',
                'sub_kategori' => ['stop kontak', 'lampu penerangan']
            ],
            [
                'kode_unit' => '02',
                'name' => 'Sanitasi',
                'kode_kerusakan' => 'MS-055',
                'sub_kategori' => ['wastafel', 'closet, shower', 'jet washer']
            ],
            [
                'kode_unit' => '02',
                'name' => 'Mesin',
                'kode_kerusakan' => 'MS-056',
                'sub_kategori' => ['water heater']
            ],
            [
                'kode_unit' => '02',
                'name' => 'Interior dan eksterior',
                'kode_kerusakan' => 'IE-057',
                'sub_kategori' => ['Plafond', 'dinding', 'jendela', 'pintu', 'lantai', 'atap']
            ],
            [
                'kode_unit' => '02',
                'name' => 'Furniture',
                'kode_kerusakan' => 'FRT-058',
                'sub_kategori' => ['Meja', 'Kursi', 'lemari built-in', 'credenza']
            ],
            [
                'kode_unit' => '02',
                'name' => 'Lingkungan',
                'kode_kerusakan' => 'LKG-059',
                'sub_kategori' => ['Hama', 'kebersihan ruangan', 'taman', 'jalan']
            ],
            [
                'kode_unit' => '02',
                'name' => 'Lain-lain',
                'kode_kerusakan' => 'LL-060',
                'sub_kategori' => ['']
            ],
        ];

        foreach ($data as $item) {
            KategoriKerusakan::create($item);
        }
    }
}
