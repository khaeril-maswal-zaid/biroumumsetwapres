<?php

namespace Database\Seeders;

use App\Models\KerusakanGedung;
use Illuminate\Database\Seeder;

class KerusakanGedungSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        KerusakanGedung::factory(50)->create();
    }
}
