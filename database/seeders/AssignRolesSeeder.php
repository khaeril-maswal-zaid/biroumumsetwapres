<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AssignRolesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $excluded = [
            'Developer165#',
            'Adm1n165#@',
            'Adm1n773#@',
            'Adm1n945#@',
            'User165#',
        ];

        // Pegawai
        User::whereHas('pegawai', fn($q) => $q->where('kode_unit', '02'))
            ->whereNotIn('nip', $excluded)
            ->whereNotIn('nip', [
                '198605282009122001',
                '198503022009021001',
                '197506251994121001',
            ])
            ->chunk(
                50,
                fn($users) =>
                $users->each->assignRole('pegawai')
            );

        // Super Admin
        User::whereHas('pegawai', fn($q) => $q->where('kode_unit', '02'))
            ->whereNotIn('nip', $excluded)
            ->whereIn('nip', [
                '198605282009122001',
                '198503022009021001',
            ])
            ->chunk(
                50,
                fn($users) =>
                $users->each->assignRole('super_admin')
            );

        // Pimpinan
        User::whereHas('pegawai', fn($q) => $q->where('kode_unit', '02'))
            ->whereNotIn('nip', $excluded)
            ->whereIn('nip', [
                '197506251994121001',
            ])
            ->chunk(
                50,
                fn($users) =>
                $users->each->assignRole('pimpinan')
            );
    }
}
