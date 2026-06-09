<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class AssignRolesSeeder extends Seeder
{
    /**
     * Pemetaan NIP (users.nip atau users.nip_sso) → role sesuai lembar "Role Aplikasi Layanan Umum".
     * Pegawai unit 02 yang tidak termasuk peta ini mendapat role `pegawai`.
     */
    public function run(): void
    {
        $excludedFromSeeder = [
            'Developer165#',
            'Adm1n945#',
            'Adm1n771#',
            'Adm1n772#',
            'Adm1n882#',
            'Adm1n334#',
            'Adm1n955#',
            'Adm1n110#',
            'User972#',
        ];

        /** @var array<string, string> nip => role_name */
        $nipToRole = [
            '198509302005011002' => 'admin_atk_perlengkapan',
            '197612051996031002' => 'admin_atk_operator_perlengkapan',
            '198707042015031001' => 'admin_atk_perlengkapan',
            '200208182025062009' => 'atk_operator',
            '197203022005011010' => 'atk_operator',

            '197911142005012002' => 'admin_rumga',
            '198502122012122001' => 'admin_rumga',
            '198007052005012001' => 'operator_rumga',
            '199512262018012001' => 'operator_rumga',
            '198804292025211073' => 'operator_rumga',
            '197205032025212009' => 'operator_rumga',

            '199002112015031001' => 'admin_rumga_bangunan_perlengkapan',
            '198505092009012005' => 'admin_bangunan_operator_perlengkapan',
            '199110162015031001' => 'admin_bangunan_operator_perlengkapan',
            '198706212015032002' => 'admin_bangunan_operator_perlengkapan',

            '198910212015031001' => 'operator_bangunan',
            '197703112025211028' => 'operator_bangunan',
            '197312092007011002' => 'operator_bangunan',
            '199508132025061004' => 'operator_bangunan',
            '199608222025211040' => 'operator_bangunan',

            '197506251994121001' => 'karo_protokol',
            '196909081990031001' => 'karo_umum',
            '197404071999031001' => 'karo_tusdm',

            '196606021992031004' => 'pimpinan',
            '196912262002121001' => 'pimpinan',
            '196809261994031001' => 'pimpinan',
            '196809271995032001' => 'pimpinan',
            '196605111995031002' => 'pimpinan',
            '196806171996031001' => 'pimpinan',
            '197112211997031002' => 'pimpinan',
            '197305121998031002' => 'pimpinan',
            '198204202005012004' => 'pimpinan',

            // tidak diubah
            'NA202506199903'     => 'super_admin',
            '198605282009122001' => 'super_admin',
            '198503022009021001' => 'super_admin',
        ];

        User::query()
            ->whereHas('pegawai', fn($q) => $q->where('kode_unit', '02'))
            ->whereNotIn('nip', $excludedFromSeeder)
            ->chunk(50, function ($users) use ($nipToRole): void {
                foreach ($users as $user) {
                    $role = $nipToRole[$user->nip] ?? ($user->nip_sso ? ($nipToRole[$user->nip_sso] ?? null) : null);
                    $user->syncRoles([$role]);
                }
            });
    }
}
