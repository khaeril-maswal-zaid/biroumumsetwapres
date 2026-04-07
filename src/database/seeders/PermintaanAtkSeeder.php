<?php

namespace Database\Seeders;

use App\Models\PermintaanAtk;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PermintaanAtkSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        PermintaanAtk::factory(50)->create();
    }
}
