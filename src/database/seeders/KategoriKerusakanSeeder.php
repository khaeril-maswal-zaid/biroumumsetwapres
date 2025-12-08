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
                'kode_kerusakan' => 'TU-051'
            ],
            [
                'kode_unit' => '02',
                'name' => 'Tata Suara',
                'kode_kerusakan' => 'TS-052'
            ],
            [
                'kode_unit' => '02',
                'name' => 'Lift',
                'kode_kerusakan' => 'KLK-053'
            ],
            [
                'kode_unit' => '02',
                'name' => 'Kelistrikan',
                'kode_kerusakan' => 'SNT-054'
            ],
            [
                'kode_unit' => '02',
                'name' => 'Sanitasi',
                'kode_kerusakan' => 'MS-055'
            ],
            [
                'kode_unit' => '02',
                'name' => 'Mesin',
                'kode_kerusakan' => 'MS-056'
            ],
            [
                'kode_unit' => '02',
                'name' => 'Interior dan eksterior',
                'kode_kerusakan' => 'IE-057'
            ],
            [
                'kode_unit' => '02',
                'name' => 'Furniture',
                'kode_kerusakan' => 'FRT-058'
            ],
            [
                'kode_unit' => '02',
                'name' => 'Lingkungan',
                'kode_kerusakan' => 'LKG-059'
            ],
            [
                'kode_unit' => '02',
                'name' => 'Lain-lain',
                'kode_kerusakan' => 'LL-060'
            ],
        ];

        foreach ($data as $item) {
            KategoriKerusakan::create($item);
        }
    }
}
