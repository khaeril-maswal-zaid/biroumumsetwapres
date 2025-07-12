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
        ]);

        User::factory(1)->create();
        User::factory()->admin()->create();
        User::factory()->pegawai()->create();

        PermintaanAtk::factory(3)->create();
        PemesananRuangRapat::factory(30)->create();
        KerusakanGedung::factory(2)->create();
    }
}
