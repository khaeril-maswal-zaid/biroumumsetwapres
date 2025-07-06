<?php

namespace Database\Seeders;

use App\Models\KerusakanGedung;
use App\Models\PemesananRuangRapat;
use App\Models\PermintaanAtk;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->pegawaiTusdm()->create();
        User::factory()->adminKendaraan()->create();

        $this->call([
            DaftarRuanganSeeder::class,
        ]);

        PermintaanAtk::factory(3)->create();
        PemesananRuangRapat::factory(2)->create();
        KerusakanGedung::factory(2)->create();
    }
}
