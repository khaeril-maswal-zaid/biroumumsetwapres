<?php

namespace Database\Seeders;

use App\Models\DaftarAtk;
use App\Models\KategoriAtk;
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
            UnitSeeder::class,
            BiroSeeder::class,
            RolePermissionSeeder::class,
            DaftarRuanganSeeder::class,
            KategoriKerusakanSeeder::class,
            KategoriAtkSeeder::class,
            DaftarAtkSeeder::class,
            UserSeeder::class,
            MasterPegawaiSeeder::class,

            //kalau sudah ada pegawai di master pegawai dan di user, jangan jalankan seeder ini
            AssignRolesSeeder::class,
        ]);
    }
}
