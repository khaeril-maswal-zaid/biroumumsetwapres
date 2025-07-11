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
        for ($i = 0; $i < 10; $i++) {
            KategoriKerusakan::create([
                'kode_kerusakan' => 'Krn-' . $i,
                'name' => 'Kerusakan ' . $i,
            ]);
        }
    }
}
