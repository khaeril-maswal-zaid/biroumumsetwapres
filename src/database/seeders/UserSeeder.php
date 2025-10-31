<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            [
                'name' => 'Developer Setwapres',
                'email' => 'developer.umum@set.wapresri.go.id',
                'nip' => 'Developer165#',
                'role' => 'super_admin',
            ],

            // [
            //     'name' => 'Yan Adikusuma S.Kom., M.Eng.',
            //     'email' => 'yan.adikusuma@ksp.go.id',
            //     'nip' => '197506251994121001',
            //     'role' => 'pimpinan',
            // ],

            [
                'name' => 'Admin Ruangan',
                'email' => 'adminruangan.umum@set.wapresri.go.id',
                'nip' => 'Adm1n165#@',
                'role' => 'admin_atk'
            ],
            [
                'name' => 'Admin Gedung',
                'email' => 'admingedung.umum@set.wapresri.go.id',
                'nip' => 'Adm1n773#@',
                'role' => 'admin_kerusakan_gedung',
            ],
            [
                'name' => 'Admin Ruangan',
                'email' => 'adminruangan.umum@set.wapresri.go.id',
                'nip' => 'Adm1n945#@',
                'role' => 'admin_ruangan',
            ],
            [
                'name' => 'User Layanan Biro Umum',
                'email' => 'layananbiroumum@set.wapresri.go.id',
                'nip' => 'User165#',
                'nipsso' => '0',
                'role' => 'pegawai',
            ],
        ];

        foreach ($data as $key => $value) {
            $user =  User::create([
                'name' => $value['name'],
                'is_ldap' => 0,
                'email' => $value['email'],
                'nip' => $value['nip'],
                'nip_sso' => $value['nip'],
                'unit_kerja' => $value['unit_kerja'],
                'password' => Hash::make($value['nip']),
            ]);

            $user->assignRole($value['role'] ?? 'pegawai');
        }
    }
}
