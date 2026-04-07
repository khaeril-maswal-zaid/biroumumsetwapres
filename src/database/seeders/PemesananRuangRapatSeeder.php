<?php

namespace Database\Seeders;

use App\Models\PemesananRuangRapat;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PemesananRuangRapatSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        PemesananRuangRapat::factory(50)->create();
    }
}
