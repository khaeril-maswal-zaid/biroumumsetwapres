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
                'sub_kategori' => ['AC', 'Exhaust Fan', 'Kipas Angin'],
                'bagian_kategori' => 'Bangunan'
            ],
            [
                'kode_unit' => '02',
                'name' => 'Tata Suara',
                'kode_kerusakan' => 'TS-052',
                'sub_kategori' => ['Mic Conference', 'Public Address/Penghar', 'Sound System Portable (Iron Man)'],
                'bagian_kategori' => 'Bangunan'
            ],
            [
                'kode_unit' => '02',
                'name' => 'Lift',
                'kode_kerusakan' => 'KLK-053',
                'sub_kategori' => [''],
                'bagian_kategori' => 'Bangunan'
            ],
            [
                'kode_unit' => '02',
                'name' => 'Kelistrikan',
                'kode_kerusakan' => 'SNT-054',
                'sub_kategori' => ['Stop Kontak', 'Lampu Penerangan'],
                'bagian_kategori' => 'Bangunan'
            ],
            [
                'kode_unit' => '02',
                'name' => 'Sanitasi',
                'kode_kerusakan' => 'MS-055',
                'sub_kategori' => ['Wastafel', 'Closet, Shower', 'Jet Washer', 'Water Heater'],
                'bagian_kategori' => 'Bangunan'
            ],
            [
                'kode_unit' => '02',
                'name' => 'Interior dan eksterior',
                'kode_kerusakan' => 'IE-057',
                'sub_kategori' => ['Plafond', 'Dinding', 'Jendela', 'Pintu', 'Lantai', 'Atap'],
                'bagian_kategori' => 'Bangunan'

            ],
            [
                'kode_unit' => '02',
                'name' => 'Lingkungan',
                'kode_kerusakan' => 'LKG-059',
                'sub_kategori' => ['Hama', 'Kebersihan Ruangan', 'Taman', 'Jalan'],
                'bagian_kategori' => 'Bangunan'
            ],
            [
                'kode_unit' => '02',
                'name' => 'Lain-lain',
                'kode_kerusakan' => 'LL-060',
                'sub_kategori' => [''],
                'bagian_kategori' => 'Bangunan'
            ],


            [
                'kode_unit' => '02',
                'name' => 'Furniture',
                'kode_kerusakan' => 'FRT-058',
                'sub_kategori' => ['Meja', 'Kursi', 'Lemari Built-in', 'Credenza'],
                'bagian_kategori' => 'Perlengkapan'
            ],
            [
                'kode_unit' => '02',
                'name' => 'Perlengkapan IT',
                'kode_kerusakan' => 'FRT-058',
                'sub_kategori' => ['Komputer', 'Laptop', 'Printer', 'Keyboard', 'Mouse', 'Web cam', 'Head Set'],
                'bagian_kategori' => 'Perlengkapan'
            ],

        ];

        foreach ($data as $item) {
            KategoriKerusakan::create([
                'kode_unit' => $item['kode_unit'],
                'name' => $item['name'],
                'bagian_kategori' => $item['bagian_kategori'],
                'sub_kategori' => $item['sub_kategori']
            ]);
        }
    }
}
