<?php

namespace Database\Seeders;

use App\Models\DaftarAtk;
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
        $this->call([
            RolePermissionSeeder::class,
            DaftarRuanganSeeder::class,
            KategoriKerusakanSeeder::class,
            DaftarAtkSeeder::class,
            UserSeeder::class,
        ]);

        // User::factory(10)->create();
        // User::factory()->admin()->create();
        // User::factory()->pegawai()->create();
        // User::factory()->atasan()->create();

        PermintaanAtk::factory(50)->create();
        PemesananRuangRapat::factory(2)->create();
        KerusakanGedung::factory(2)->create();
    }
}
