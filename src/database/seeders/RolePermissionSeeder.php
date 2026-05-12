<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        $permissions = [
            // Daftar Ruangan (master)
            ['name' => 'create_rooms', 'label' => 'Tambah ruangan', 'category' => 'Daftar Ruangan', 'klasifikasi' => 'master'],
            ['name' => 'view_rooms', 'label' => 'Lihat data ruangan', 'category' => 'Daftar Ruangan', 'klasifikasi' => 'master'],
            ['name' => 'manage_rooms', 'label' => 'Kelola ruangan', 'category' => 'Daftar Ruangan', 'klasifikasi' => 'master'],

            // Daftar ATK (master)
            ['name' => 'create_atk', 'label' => 'Tambah daftar ATK', 'category' => 'Daftar ATK', 'klasifikasi' => 'master'],
            ['name' => 'view_atk', 'label' => 'Lihat daftar ATK', 'category' => 'Daftar ATK', 'klasifikasi' => 'master'],
            ['name' => 'manage_atk', 'label' => 'Kelola daftar ATK', 'category' => 'Daftar ATK', 'klasifikasi' => 'master'],

            // Kategori kerusakan (master)
            ['name' => 'create_category_damages', 'label' => 'Tambah kategori kerusakan', 'category' => 'Kategory Kerusakan', 'klasifikasi' => 'master'],
            ['name' => 'view_category_damages', 'label' => 'Lihat kategori kerusakan', 'category' => 'Kategory Kerusakan', 'klasifikasi' => 'master'],
            ['name' => 'manage_category_damages', 'label' => 'Kelola kategori kerusakan', 'category' => 'Kategory Kerusakan', 'klasifikasi' => 'master'],

            // Pengemudi (master)
            ['name' => 'create_drivers', 'label' => 'Tambah data pengemudi', 'category' => 'Kendaraan', 'klasifikasi' => 'master'],
            ['name' => 'view_drivers', 'label' => 'Lihat data pengemudi', 'category' => 'Kendaraan', 'klasifikasi' => 'master'],
            ['name' => 'manage_drivers', 'label' => 'Kelola data pengemudi', 'category' => 'Kendaraan', 'klasifikasi' => 'master'],

            // Kendaraan (master)
            ['name' => 'create_vehicles_master', 'label' => 'Tambah daftar kendaraan', 'category' => 'Kendaraan', 'klasifikasi' => 'master'],
            ['name' => 'view_vehicles_master', 'label' => 'Lihat daftar kendaraan', 'category' => 'Kendaraan', 'klasifikasi' => 'master'],
            ['name' => 'manage_vehicles_master', 'label' => 'Kelola daftar kendaraan', 'category' => 'Kendaraan', 'klasifikasi' => 'master'],

            // Perbaikan sarpras (layanan: lihat, ajukan, tindak lanjuti; filter bangunan / perlengkapan)
            ['name' => 'create_damage', 'label' => 'Ajukan permintaan perbaikan sarpras', 'category' => 'Perbaikan Sarpras', 'klasifikasi' => 'layanan'],
            ['name' => 'view_damages', 'label' => 'Lihat seluruh permintaan perbaikan sarpras', 'category' => 'Perbaikan Sarpras', 'klasifikasi' => 'layanan'],
            ['name' => 'view_bangunan_damages', 'label' => 'Lihat permintaan perbaikan (Bangunan)', 'category' => 'Perbaikan Sarpras', 'klasifikasi' => 'layanan'],
            ['name' => 'view_perlengkapan_damages', 'label' => 'Lihat permintaan perbaikan (Perlengkapan)', 'category' => 'Perbaikan Sarpras', 'klasifikasi' => 'layanan'],
            ['name' => 'tindak_lanjuti_bangunan_damages', 'label' => 'Tindak lanjuti permintaan perbaikan (Bangunan)', 'category' => 'Perbaikan Sarpras', 'klasifikasi' => 'layanan'],
            ['name' => 'tindak_lanjuti_perlengkapan_damages', 'label' => 'Tindak lanjuti permintaan perbaikan (Perlengkapan)', 'category' => 'Perbaikan Sarpras', 'klasifikasi' => 'layanan'],

            // Pemesanan ruang rapat (layanan)
            ['name' => 'create_booking', 'label' => 'Ajukan pemesanan ruang rapat', 'category' => 'Pemesanan Ruang Rapat', 'klasifikasi' => 'layanan'],
            ['name' => 'view_bookings', 'label' => 'Lihat pemesanan & laporan ruang rapat', 'category' => 'Pemesanan Ruang Rapat', 'klasifikasi' => 'layanan'],
            ['name' => 'tindak_lanjuti_bookings', 'label' => 'Tindak lanjuti pemesanan ruang rapat', 'category' => 'Pemesanan Ruang Rapat', 'klasifikasi' => 'layanan'],

            // Permintaan ATK (layanan)
            ['name' => 'view_supplies', 'label' => 'Lihat permintaan & laporan ATK', 'category' => 'Permintaan ATK', 'klasifikasi' => 'layanan'],
            ['name' => 'create_supplies', 'label' => 'Ajukan permintaan ATK', 'category' => 'Permintaan ATK', 'klasifikasi' => 'layanan'],
            ['name' => 'tindak_lanjuti_supplies', 'label' => 'Tindak lanjuti permintaan ATK', 'category' => 'Permintaan ATK', 'klasifikasi' => 'layanan'],

            // Kendaraan (layanan + master pengemudi / kendaraan)
            ['name' => 'create_vehicle', 'label' => 'Ajukan permintaan kendaraan', 'category' => 'Kendaraan', 'klasifikasi' => 'layanan'],
            ['name' => 'view_vehicles', 'label' => 'Lihat permintaan kendaraan', 'category' => 'Kendaraan', 'klasifikasi' => 'layanan'],
            ['name' => 'tindak_lanjuti_vehicles', 'label' => 'Tindak lanjuti permintaan kendaraan', 'category' => 'Kendaraan', 'klasifikasi' => 'layanan'],

            // Umum
            ['name' => 'view_admin_dashboard', 'label' => 'Lihat dashboard', 'category' => 'Umum'],
            ['name' => 'view_history', 'label' => 'Lihat riwayat', 'category' => 'Umum'],
            ['name' => 'view_homepage', 'label' => 'Lihat beranda', 'category' => 'Umum'],

            // Khusus
            ['name' => 'management_access', 'label' => 'Akses manajemen role & izin', 'category' => 'Khusus'],
            ['name' => 'delete_all_requests', 'label' => 'Hapus permintaan pengguna', 'category' => 'Khusus'],
        ];

        foreach ($permissions as $perm) {
            $attrs = [
                'label' => $perm['label'],
                'category' => $perm['category'],
                'guard_name' => 'web',
            ];
            if (array_key_exists('klasifikasi', $perm)) {
                $attrs['klasifikasi'] = $perm['klasifikasi'];
            }

            Permission::updateOrCreate(
                ['name' => $perm['name']],
                $attrs
            );
        }


        $dashboard = ['view_admin_dashboard'];
        $createServicies = [
            'view_homepage',
            'view_history',

            'create_booking',
            'create_supplies',
            'create_damage',
            'create_vehicle',
        ];

        //----------------------------------  ATK ----------------------------------
        $operatorAtk = array_merge($dashboard, $createServicies, [
            'view_supplies',
            'tindak_lanjuti_supplies',
        ]);

        $adminAtk = array_merge($operatorAtk, [
            'create_atk',
            'view_atk',
            'manage_atk',
        ]);

        //----------------------------------  Ruang Rapat ----------------------------------
        $operatorRuangRapat = array_merge($dashboard, $createServicies, [
            'view_bookings',
            'tindak_lanjuti_bookings',
        ]);

        $adminRuangRapat = array_merge($operatorRuangRapat, [
            'create_booking',
            'view_bookings',
            'manage_rooms',
        ]);

        //----------------------------------  Perbaikan Sarpras _ Bangunan ----------------------------------
        $operatorBangunan = array_merge($dashboard, $createServicies, [
            'view_damages',
            'view_bangunan_damages',
            'tindak_lanjuti_bangunan_damages',
        ]);

        $adminBangunan = array_merge($operatorBangunan, [
            'manage_category_damages',
        ]);

        //----------------------------------  Perbaikan Sarpras _ Perlengkapan ----------------------------------
        $operatorPerlengkapan = array_merge($dashboard, $createServicies, [
            'view_damages',
            'view_perlengkapan_damages',
            'tindak_lanjuti_perlengkapan_damages',
        ]);

        $adminPerlengkapan = array_merge($operatorPerlengkapan, [
            'manage_category_damages',
        ]);

        $syncRole = function (string $name, string $label, ?string $description, array $perms): void {
            $role = Role::updateOrCreate(
                ['name' => $name, 'guard_name' => 'web'],
                [
                    'label' => $label,
                    'description' => $description ?? '',
                ]
            );
            $role->syncPermissions($perms);
        };


        $syncRole('pimpinan', 'Pimpinan', 'Monitoring permintaan lintas modul.', $createServicies);
        $syncRole('pic', 'PIC', 'Monitoring (data pegawai menyusul).', $createServicies);

        // --- Karo (tingkat akses berbeda sesuai lembar role) ---
        $syncRole(
            'karo_protokol',
            'Karo Protokol',
            'Monitoring terbatas protokol.',
            $adminBangunan
        );

        $syncRole(
            'karo_umum',
            'Karo Umum',
            'Monitoring luas birumum.',
            array_merge($adminRuangRapat, $adminAtk, $adminPerlengkapan, $adminBangunan)
        );

        $syncRole(
            'karo_tusdm',
            'Karo TUSDM',
            'Monitoring terbatas.',
            $adminRuangRapat
        );


        $syncRole(
            'perlengkapan_admin_1',
            'Admin perlengkapan (utama)',
            'Penuh ATK, ruangan, perbaikan, dan kategori.',
            array_merge($adminAtk,  $adminPerlengkapan)
        );


        $syncRole(
            'perlengkapan_admin_2',
            'Admin perlengkapan',
            'Setara admin utama; penyesuaian organisasi.',
            array_merge($adminAtk,  $operatorPerlengkapan)
        );


        $syncRole(
            'perlengkapan_operator',
            'Operator perlengkapan',
            'Tindak lanjuti permintaan ATK & perbaikan perlengkapan.',
            $operatorPerlengkapan
        );


        $syncRole(
            'rumga_admin_1',
            'Admin ruang rapat',
            'Kelola master ruangan & pemesanan.',
            $adminRuangRapat
        );


        $syncRole(
            'rumga_operator',
            'Operator ruang rapat',
            'Tindak lanjuti pemesanan ruang rapat.',
            $operatorRuangRapat
        );

        $syncRole(
            'bangunan_admin_1',
            'Admin perbaikan bangunan (utama)',
            'Koordinasi penuh perbaikan & layanan terkait.',
            array_merge($adminRuangRapat, $adminBangunan, $adminPerlengkapan)
        );


        $syncRole(
            'bangunan_admin_2',
            'Admin perbaikan bangunan',
            'Setara admin utama; penyesuaian organisasi.',
            array_merge($adminBangunan, $operatorPerlengkapan)
        );

        $syncRole(
            'bangunan_operator',
            'Operator perbaikan bangunan',
            'Tindak lanjuti laporan kerusakan bangunan.',
            $operatorBangunan
        );

        // --- Super admin & developer ---
        $all = collect($permissions)->pluck('name')->all();
        $syncRole(
            'super_admin',
            'Super Admin',
            'Akses penuh aplikasi.',
            $all
        );

        $developerPerms = $all;
        $syncRole(
            'developer_swp',
            'Developer Setwapres',
            'Akses penuh termasuk master kendaraan & pengemudi.',
            $developerPerms
        );
    }
}
