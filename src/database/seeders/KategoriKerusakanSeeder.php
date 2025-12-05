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
            ['name' => 'Tata Udara', 'kode_kerusakan' => 'TU-051'],
            ['name' => 'Tata Suara', 'kode_kerusakan' => 'TS-052'],
            ['name' => 'Lift', 'kode_kerusakan' => 'KLK-053'],
            ['name' => 'Kelistrikan', 'kode_kerusakan' => 'SNT-054'],
            ['name' => 'Sanitasi', 'kode_kerusakan' => 'MS-055'],
            ['name' => 'Mesin', 'kode_kerusakan' => 'MS-056'],
            ['name' => 'Interior dan eksterior', 'kode_kerusakan' => 'IE-057'],
            ['name' => 'Furniture', 'kode_kerusakan' => 'FRT-058'],
            ['name' => 'Lingkungan', 'kode_kerusakan' => 'LKG-059'],
            ['name' => 'Lain-lain', 'kode_kerusakan' => 'LL-060'],
        ];

        foreach ($data as $item) {
            KategoriKerusakan::create($item);
        }
    }
}
