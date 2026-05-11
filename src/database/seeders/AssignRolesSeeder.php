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
            '198509302005011002' => 'perlengkapan_admin_1',
            '197612051996031002' => 'perlengkapan_admin_2',
            '198707042015031001' => 'perlengkapan_admin_1',
            '200208182025062009' => 'perlengkapan_operator',
            '197203022005011010' => 'perlengkapan_operator',
            '197911142005012002' => 'rumga_admin_1',
            '198502122012122001' => 'rumga_admin_1',
            '198007052005012001' => 'rumga_operator',
            '199512262018012001' => 'rumga_operator',
            '198804292025211073' => 'rumga_operator',
            '197205032025212009' => 'rumga_operator',
            '199002112015031001' => 'bangunan_admin_1',
            '198505092009012005' => 'bangunan_admin_2',
            '199110162015031001' => 'bangunan_admin_2',
            '198706212015032002' => 'bangunan_admin_2',
            '198910212015031001' => 'bangunan_operator',
            '197703112025211028' => 'bangunan_operator',
            '197312092007011002' => 'bangunan_operator',
            '199508132025061004' => 'bangunan_operator',
            '199608222025211040' => 'bangunan_operator',
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
            'NA202506199903' => 'super_admin',
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
