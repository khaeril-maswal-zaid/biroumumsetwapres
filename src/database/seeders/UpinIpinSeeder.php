<?php

namespace Database\Seeders;

use App\Models\MasterPegawai;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UpinIpinSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            [
                'name' => 'Gladys Anindya Trisvitanica Putri',
                'email' => 'gladys.atp@set.wapresri.go.id',
                'nip' => 'MagangSwp001',
                'biro' => '0239',
                'jabatan' => 'Magang',
            ],
            [
                'name' => 'Kyza Aulia',
                'email' => 'kyza.aulia@set.wapresri.go.id',
                'nip' => 'MagangSwp002',
                'biro' => '0239',
                'jabatan' => 'Magang',
            ],
        ];

        foreach ($data as $key => $value) {
            User::create([
                'nip' => $value['nip'],
                'nip_sso' => $value['nip'],
                'is_ldap' => 0,
                'email' => $value['email'],
                'password' => Hash::make($value['nip']),
            ]);

            MasterPegawai::create([
                'nip' => $value['nip'],
                'name' => $value['name'],
                'kode_unit' => '02',
                'kode_biro' => $value['biro'],
                'jabatan' => $value['jabatan'],
            ]);
        }
    }
}
