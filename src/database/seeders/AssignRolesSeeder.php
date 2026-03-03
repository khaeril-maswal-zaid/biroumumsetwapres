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
            'Adm1n945#@',
            'Operat0r945#@',
            'Adm1n773#@',
            'Operat0r773#@',
            'Adm1n165#@',
            'Operat0r165#@',
            'User972#',
            'NA202506199903', // Khaeril Maswal Zaid
        ];

        // Pegawai
        User::whereHas('pegawai', fn($q) => $q->where('kode_unit', '02'))
            ->whereNotIn('nip', $excluded)
            ->whereNotIn(
                'nip_sso',
                [
                    '180005456', // Ayu Setiarini S.T., M.T.I.
                    '180007005', // Joko Prihantoro
                    '250000552', // Yan Adikusuma, S.Kom., M.Eng.
                    '740003469', // Purwono Prihantoro Budi Trisnanto, S.E., M.Si.
                    '180004571', // Yayat Hidayat, S.IP.
                    '030215619',  // Drs. Rusmin Nuryadin, M.H.
                    '180004602', // Dr. Eka Denny Mansjur S.Si., M.Si.
                    '180003956', // Ahmad Lutfie, S.E., M.M.
                    '180004042', // Celvya Betty Manurung, S.IP., M.P.M.
                    '180004051', // Drs. Abdul Muis
                    '180004296', // Slamet Widodo, S.S., M.Si.
                    '180004389', // Pranggono Dwianto, S.IP., M.Si.
                    '180004427', // Dr. Adyawarman, S.IP., M.D.M.
                    '180004810', // Mita Apriyanti, S.Sos., M.Si.
                    '180004802', // Afif Juniar, S.H., M.H.
                    '180005734', // Fajar Triwardono, S.T., M.T.
                    '180005735', // Halim Fadillah Suwito Jati, S.E.
                    '180005431', // Ika Mailani, S.T., M.T.I.
                    '180005739', // Angga Dwijayanti, S.Kom.
                    '180005782', // Isnandy Arief Widodo, S.T.
                    '180005593', // Mukti Cahyani, S.H., M.H.
                    '180004929', // Wenny Setia Ningsih
                    '180004237', // Hari Sugiharto, S.T., M.M.
                    '180005738', // Danang Ari Suwito, S.Sos.
                    '180004013', // Pamuji
                ]
            )
            ->chunk(
                50,
                fn($users) =>
                $users->each->assignRole('pegawai')
            );


        // Super Admin
        User::whereHas('pegawai', fn($q) => $q->where('kode_unit', '02'))
            ->whereIn('nip_sso', [
                '180005456', // Ayu Setiarini S.T., M.T.I.
                '180007005', // Joko Prihantoro
            ])
            ->orWhereIn('nip', [
                'NA202506199903', // Khaeril Maswal Zaid
            ])
            ->chunk(
                50,
                fn($users) =>
                $users->each->assignRole('super_admin')
            );


        // Pimpinan
        User::whereHas('pegawai', fn($q) => $q->where('kode_unit', '02'))
            ->whereIn('nip_sso', [
                '250000552', // Yan Adikusuma, S.Kom., M.Eng.
                '740003469', // Purwono Prihantoro Budi Trisnanto, S.E., M.Si.
                '180004571', // Yayat Hidayat, S.IP.
                '030215619',  // Drs. Rusmin Nuryadin, M.H.
                '180004602', // Dr. Eka Denny Mansjur S.Si., M.Si.
                '180003956', // Ahmad Lutfie, S.E., M.M.
                '180004042', // Celvya Betty Manurung, S.IP., M.P.M.
                '180004051', // Drs. Abdul Muis
                '180004296', // Slamet Widodo, S.S., M.Si.
                '180004389', // Pranggono Dwianto, S.IP., M.Si.
                '180004427', // Dr. Adyawarman, S.IP., M.D.M.
                '180004810', // Mita Apriyanti, S.Sos., M.Si.
                '180004802', // Afif Juniar, S.H., M.H.
            ])
            ->chunk(
                50,
                fn($users) =>
                $users->each->assignRole('pimpinan')
            );


        //----------------------------------------------------------------
        // Admin Kerusakan Gedung
        User::whereHas('pegawai', fn($q) => $q->where('kode_unit', '02'))
            ->whereIn('nip_sso', [
                '180005734', // Fajar Triwardono, S.T., M.T.
                '180005735', // Halim Fadillah Suwito Jati, S.E.
                '180005431', // Ika Mailani, S.T., M.T.I.
                '180005739', // Angga Dwijayanti, S.Kom.
            ])
            ->chunk(
                50,
                fn($users) =>
                $users->each->assignRole('admin_kerusakan_gedung')
            );


        // Operator Kerusakan Gedung
        User::whereHas('pegawai', fn($q) => $q->where('kode_unit', '02'))
            ->whereIn('nip_sso', [
                '180005782', // Isnandy Arief Widodo, S.T.
            ])
            ->chunk(
                50,
                fn($users) =>
                $users->each->assignRole('operator_kerusakan_gedung')
            );

        //----------------------------------------------------------------

        // Admin Ruangan
        User::whereHas('pegawai', fn($q) => $q->where('kode_unit', '02'))
            ->whereIn('nip_sso', [
                '180005593', // Mukti Cahyani, S.H., M.H.
            ])
            ->chunk(
                50,
                fn($users) =>
                $users->each->assignRole('admin_ruangan')
            );


        // Operator Ruangan
        User::whereHas('pegawai', fn($q) => $q->where('kode_unit', '02'))
            ->whereIn('nip_sso', [
                '180004929', // Wenny Setia Ningsih
            ])
            ->chunk(
                50,
                fn($users) =>
                $users->each->assignRole('operator_ruangan')
            );


        //----------------------------------------------------------------
        // Admin ATK
        User::whereHas('pegawai', fn($q) => $q->where('kode_unit', '02'))
            ->whereIn('nip_sso', [
                '180004237', // Hari Sugiharto, S.T., M.M.
                '180005738', // Danang Ari Suwito, S.Sos.
            ])
            ->chunk(
                50,
                fn($users) =>
                $users->each->assignRole('admin_atk')
            );


        // Operator ATK
        User::whereHas('pegawai', fn($q) => $q->where('kode_unit', '02'))
            ->whereIn('nip_sso', [
                '180004013', // Pamuji
            ])
            ->chunk(
                50,
                fn($users) =>
                $users->each->assignRole('operator_atk')
            );

        //----------------------------------------------------------------

    }
}
