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
            // Daftar Ruangan (Master)
            ['name' => 'create_rooms', 'label' => 'Tambah ruangan', 'category' => 'Daftar Ruangan', 'klasifikasi' => 'Master'],
            ['name' => 'view_rooms', 'label' => 'Lihat data ruangan', 'category' => 'Daftar Ruangan', 'klasifikasi' => 'Master'],
            ['name' => 'manage_rooms', 'label' => 'Kelola ruangan', 'category' => 'Daftar Ruangan', 'klasifikasi' => 'Master'],

            // Daftar ATK (Master)
            ['name' => 'create_atk', 'label' => 'Tambah daftar ATK', 'category' => 'Daftar ATK', 'klasifikasi' => 'Master'],
            ['name' => 'view_atk', 'label' => 'Lihat daftar ATK', 'category' => 'Daftar ATK', 'klasifikasi' => 'Master'],
            ['name' => 'manage_atk', 'label' => 'Kelola daftar ATK', 'category' => 'Daftar ATK', 'klasifikasi' => 'Master'],

            // Kategori kerusakan (Master)
            ['name' => 'create_category_damages', 'label' => 'Tambah kategori kerusakan', 'category' => 'Kategory Kerusakan', 'klasifikasi' => 'Master'],
            ['name' => 'view_category_damages', 'label' => 'Lihat kategori kerusakan', 'category' => 'Kategory Kerusakan', 'klasifikasi' => 'Master'],
            ['name' => 'manage_category_damages', 'label' => 'Kelola kategori kerusakan', 'category' => 'Kategory Kerusakan', 'klasifikasi' => 'Master'],

            // Pengemudi (Master)
            ['name' => 'create_drivers', 'label' => 'Tambah data pengemudi', 'category' => 'Kendaraan', 'klasifikasi' => 'Master'],
            ['name' => 'view_drivers', 'label' => 'Lihat data pengemudi', 'category' => 'Kendaraan', 'klasifikasi' => 'Master'],
            ['name' => 'manage_drivers', 'label' => 'Kelola data pengemudi', 'category' => 'Kendaraan', 'klasifikasi' => 'Master'],

            // Kendaraan (Master)
            ['name' => 'create_vehicles_Master', 'label' => 'Tambah daftar kendaraan', 'category' => 'Kendaraan', 'klasifikasi' => 'Master'],
            ['name' => 'view_vehicles_Master', 'label' => 'Lihat daftar kendaraan', 'category' => 'Kendaraan', 'klasifikasi' => 'Master'],
            ['name' => 'manage_vehicles_Master', 'label' => 'Kelola daftar kendaraan', 'category' => 'Kendaraan', 'klasifikasi' => 'Master'],

            // Perbaikan sarpras (Layanan: lihat, ajukan, tindak lanjuti; filter bangunan / perlengkapan)
            ['name' => 'create_damage', 'label' => 'Ajukan permintaan perbaikan sarpras', 'category' => 'Perbaikan Sarpras', 'klasifikasi' => 'Layanan'],
            ['name' => 'view_damages', 'label' => 'Lihat seluruh permintaan perbaikan sarpras', 'category' => 'Perbaikan Sarpras', 'klasifikasi' => 'Layanan'],
            ['name' => 'view_bangunan_damages', 'label' => 'Lihat permintaan perbaikan (Bangunan)', 'category' => 'Perbaikan Sarpras', 'klasifikasi' => 'Layanan'],
            ['name' => 'view_perlengkapan_damages', 'label' => 'Lihat permintaan perbaikan (Perlengkapan)', 'category' => 'Perbaikan Sarpras', 'klasifikasi' => 'Layanan'],
            ['name' => 'tindak_lanjuti_bangunan_damages', 'label' => 'Tindak lanjuti permintaan perbaikan (Bangunan)', 'category' => 'Perbaikan Sarpras', 'klasifikasi' => 'Layanan'],
            ['name' => 'tindak_lanjuti_perlengkapan_damages', 'label' => 'Tindak lanjuti permintaan perbaikan (Perlengkapan)', 'category' => 'Perbaikan Sarpras', 'klasifikasi' => 'Layanan'],

            // Pemesanan ruang rapat (Layanan)
            ['name' => 'create_booking', 'label' => 'Ajukan pemesanan ruang rapat', 'category' => 'Pemesanan Ruang Rapat', 'klasifikasi' => 'Layanan'],
            ['name' => 'view_bookings', 'label' => 'Lihat pemesanan & laporan ruang rapat', 'category' => 'Pemesanan Ruang Rapat', 'klasifikasi' => 'Layanan'],
            ['name' => 'tindak_lanjuti_bookings', 'label' => 'Tindak lanjuti pemesanan ruang rapat', 'category' => 'Pemesanan Ruang Rapat', 'klasifikasi' => 'Layanan'],

            // Permintaan ATK (Layanan)
            ['name' => 'view_supplies', 'label' => 'Lihat permintaan & laporan ATK', 'category' => 'Permintaan ATK', 'klasifikasi' => 'Layanan'],
            ['name' => 'create_supplies', 'label' => 'Ajukan permintaan ATK', 'category' => 'Permintaan ATK', 'klasifikasi' => 'Layanan'],
            ['name' => 'tindak_lanjuti_supplies', 'label' => 'Tindak lanjuti permintaan ATK', 'category' => 'Permintaan ATK', 'klasifikasi' => 'Layanan'],

            // Kendaraan (Layanan + Master pengemudi / kendaraan)
            ['name' => 'create_vehicle', 'label' => 'Ajukan permintaan kendaraan', 'category' => 'Kendaraan', 'klasifikasi' => 'Layanan'],
            ['name' => 'view_vehicles', 'label' => 'Lihat permintaan kendaraan', 'category' => 'Kendaraan', 'klasifikasi' => 'Layanan'],
            ['name' => 'tindak_lanjuti_vehicles', 'label' => 'Tindak lanjuti permintaan kendaraan', 'category' => 'Kendaraan', 'klasifikasi' => 'Layanan'],

            // Umum
            ['name' => 'view_admin_dashboard', 'label' => 'Lihat dashboard', 'category' => 'Umum', 'klasifikasi' => 'Lainnya'],
            ['name' => 'view_history', 'label' => 'Lihat riwayat', 'category' => 'Umum', 'klasifikasi' => 'Lainnya'],
            ['name' => 'view_homepage', 'label' => 'Lihat beranda', 'category' => 'Umum', 'klasifikasi' => 'Lainnya'],

            // Khusus
            ['name' => 'management_access', 'label' => 'Akses manajemen role & izin', 'category' => 'Khusus', 'klasifikasi' => 'Lainnya'],
            ['name' => 'delete_all_requests', 'label' => 'Hapus Data Layanan & Master', 'category' => 'Khusus', 'klasifikasi' => 'Lainnya'],
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
            'view_bangunan_damages',
            'tindak_lanjuti_bangunan_damages',
        ]);

        $adminBangunan = array_merge($operatorBangunan, [
            'manage_category_damages',
            'view_category_damages',
            'create_category_damages',
        ]);

        //----------------------------------  Perbaikan Sarpras _ Perlengkapan ----------------------------------
        $operatorPerlengkapan = array_merge($dashboard, $createServicies, [
            'view_perlengkapan_damages',
            'tindak_lanjuti_perlengkapan_damages',
        ]);

        $adminPerlengkapan = array_merge($operatorPerlengkapan, [
            'manage_category_damages',
            'view_category_damages',
            'create_category_damages',
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
            'admin_atk_perlengkapan',
            'Admin ATK & Perlengkapan',
            'Kelola Master ATK & Kategori Kerusakan Perlengkapan; Tindak lanjuti permintaan ATK & perbaikan perlengkapan.',
            array_merge($adminAtk,  $adminPerlengkapan)
        );


        $syncRole(
            'admin_atk_operator_perlengkapan',
            'Admin ATK & Operator Perlengkapan',
            'Kelola Master ATK; Tindak lanjuti permintaan ATK & perbaikan perlengkapan.',
            array_merge($adminAtk,  $operatorPerlengkapan)
        );


        $syncRole(
            'atk_operator',
            'Operator ATK',
            'Tindak lanjuti permintaan ATK',
            $operatorAtk
        );


        $syncRole(
            'admin_rumga',
            'Admin ruang rapat',
            'Kelola Master ruangan & Tindak lanjuti pemesanan ruang rapat.',
            $adminRuangRapat
        );


        $syncRole(
            'operator_rumga',
            'Operator ruang rapat',
            'Tindak lanjuti pemesanan ruang rapat.',
            $operatorRuangRapat
        );

        $syncRole(
            'admin_rumga_bangunan_perlengkapan',
            'Admin Ruang Rapat, Bangunan & Perlengkapan',
            'Kelola Master ruangan, kategori kerusakan bangunan & perlengkapan; Tindak lanjuti pemesanan ruang rapat, perbaikan bangunan & perlengkapan.',
            array_merge($adminRuangRapat, $adminBangunan, $adminPerlengkapan)
        );


        $syncRole(
            'admin_bangunan_operator_perlengkapan',
            'Admin Bangunan & Operator Perlengkapan',
            'Kelola kategori kerusakan bangunan & perlengkapan; Tindak lanjuti perbaikan bangunan & perlengkapan.',
            array_merge($adminBangunan, $operatorPerlengkapan)
        );

        $syncRole(
            'operator_bangunan',
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
            'Akses penuh termasuk Master kendaraan & pengemudi.',
            $developerPerms
        );
    }
}
