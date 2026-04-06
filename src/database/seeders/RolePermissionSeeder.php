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
        // di paling atas run()
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        $permissions = [
            // 🔐 Ruangan
            ['name' => 'view_rooms', 'label' => 'Lihat Data Ruangan', 'category' => 'Ruangan'],
            ['name' => 'create_rooms', 'label' => 'Tambah Ruangan', 'category' => 'Ruangan'],
            ['name' => 'edit_rooms', 'label' => 'Ubah Ruangan', 'category' => 'Ruangan'],
            ['name' => 'delete_rooms', 'label' => 'Hapus Ruangan', 'category' => 'Ruangan'],

            // 🔐 Daftar Atk
            ['name' => 'view_atk', 'label' => 'Lihat Data Daftar ATK', 'category' => 'Daftar ATK'],
            ['name' => 'create_atk', 'label' => 'Tambah Daftar ATK', 'category' => 'Daftar ATK'],
            ['name' => 'edit_atk', 'label' => 'Ubah Daftar ATK', 'category' => 'Daftar ATK'],
            ['name' => 'delete_atk', 'label' => 'Hapus Daftar ATK', 'category' => 'Daftar ATK'],

            // 🔐 Kategori Kerusakan
            ['name' => 'view_category_damages', 'label' => 'Lihat Data Kategory Kerusakan', 'category' => 'Kategory Kerusakan'],
            ['name' => 'create_category_damages', 'label' => 'Tambah Kategory Kerusakan', 'category' => 'Kategory Kerusakan'],
            ['name' => 'edit_category_damages', 'label' => 'Ubah Kategory Kerusakan', 'category' => 'Kategory Kerusakan'],
            ['name' => 'delete_category_damages', 'label' => 'Hapus Kategory Kerusakan', 'category' => 'Kategory Kerusakan'],

            //Log Proses
            // ['name' => 'view_log_proses', 'label' => 'Lihat Data Kategory Kerusakan', 'category' => 'Kategory Kerusakan'], //Karena 1 page dengan 'view_category_damages'
            ['name' => 'create_log_proses', 'label' => 'Tambah Log Proses Kerusakan', 'category' => 'Log Proses Kerusakan'],
            ['name' => 'edit_log_proses', 'label' => 'Ubah Log Proses Kerusakan', 'category' => 'Log Proses Kerusakan'],
            ['name' => 'delete_log_proses', 'label' => 'Hapus Log Proses Kerusakan', 'category' => 'Log Proses Kerusakan'],

            // 🛠️ Kerusakan
            ['name' => 'view_damages', 'label' => 'Lihat Permintaan Perbaikan Sarpras & Perlengkapan', 'category' => 'Perbaikan Sarpras'],
            ['name' => 'view_admin_damages', 'label' => 'Admin Permintaan Perbaikan Sarpras', 'category' => 'Perbaikan Sarpras'],
            ['name' => 'view_bangunan_damages', 'label' => 'Lihat Permintaan Perbaikan Sarpras', 'category' => 'Perbaikan Sarpras'],
            ['name' => 'view_perlengkapan_damages', 'label' => 'Lihat Permintaan Perbaikan Perlengkapan', 'category' => 'Perbaikan Sarpras'],
            ['name' => 'report_damages', 'label' => 'Laporan Perbaikan Sarpras', 'category' => 'Perbaikan Sarpras'],
            ['name' => 'create_damage', 'label' => 'Laporkan Kerusakan Gedung', 'category' => 'Perbaikan Sarpras'],
            ['name' => 'change_damage_status', 'label' => 'Konfirmasi Kerusakan Gedung', 'category' => 'Perbaikan Sarpras'],

            // 📅 Pemesanan Ruang
            ['name' => 'view_bookings', 'label' => 'Lihat Pemesanan Ruang', 'category' => 'Pemesanan Ruang Rapat'],
            ['name' => 'report_bookings', 'label' => 'Laporan Pemesanan Ruang', 'category' => 'Pemesanan Ruang Rapat'],
            ['name' => 'create_booking', 'label' => 'Ajukan Pemesanan Ruang', 'category' => 'Pemesanan Ruang Rapat'],
            ['name' => 'change_booking_status', 'label' => 'Konfirmasi Pemesanan Ruang', 'category' => 'Pemesanan Ruang Rapat'],

            // 🖊️ ATK
            ['name' => 'view_supplies', 'label' => 'Lihat Permintaan ATK', 'category' => 'Permintaan ATK'],
            ['name' => 'report_supplies', 'label' => 'Laporan Permintaan ATK', 'category' => 'Permintaan ATK'],
            ['name' => 'create_supplies', 'label' => 'Ajukan Permintaan ATK', 'category' => 'Permintaan ATK'],
            ['name' => 'change_supplies_status', 'label' => 'Konfirmasi Permintaan ATK', 'category' => 'Permintaan ATK'],

            // 🚗 Kendaraan
            ['name' => 'view_vehicles', 'label' => 'Lihat Permintaan Kendaraan', 'category' => 'Kendaraan'],
            ['name' => 'create_vehicle', 'label' => 'Ajukan Permintaan Kendaraan', 'category' => 'Kendaraan'],
            ['name' => 'change_vehicle_status', 'label' => 'Konfirmasi Permintaan Kendaraan', 'category' => 'Kendaraan'],
            // Tambahan Permissions 🚗 Kendaraan
            ['name' => 'view_drivers', 'label' => 'Lihat Data Pengemudi', 'category' => 'Kendaraan'],
            ['name' => 'manage_drivers', 'label' => 'Kelola Data Pengemudi', 'category' => 'Kendaraan'],
            ['name' => 'view_vehicles_master', 'label' => 'Lihat Daftar Kendaraan', 'category' => 'Kendaraan'],
            ['name' => 'manage_vehicles_master', 'label' => 'Kelola Daftar Kendaraan', 'category' => 'Kendaraan'],


            // 📊 Umum
            ['name' => 'view_admin_dashboard', 'label' => 'Lihat Dashboard', 'category' => 'Umum'],
            ['name' => 'view_history', 'label' => 'Lihat Riwayat', 'category' => 'Umum'],
            ['name' => 'view_homepage', 'label' => 'Lihat Beranda', 'category' => 'Umum'],

            ['name' => 'management_access', 'label' => 'Akses Manajement', 'category' => 'Khusus'],
            ['name' => 'delete_all_requests', 'label' => 'Hapus Permintaan User', 'category' => 'Khusus'],
        ];

        // 🔁 Buat atau update semua permission dengan label & kategori
        foreach ($permissions as $perm) {
            Permission::updateOrCreate(
                ['name' => $perm['name']],
                [
                    'label' => $perm['label'],
                    'category' => $perm['category'],
                    'guard_name' => 'web',
                ]
            );
        }


        // 🛡️ Role: Admin ATK---------------------------------------------
        $adminAtkPermissions = [
            'view_admin_dashboard',

            'change_supplies_status',
            'create_supplies',
            'view_supplies',
            'report_supplies',

            'delete_atk',
            'edit_atk',
            'create_atk',
            'view_atk',

            'view_homepage',
            'view_history',
        ];
        $adminAtkRole = Role::create(
            [
                'name' => 'admin_atk',
                'label' => 'Admin ATK',
                'guard_name' => 'web',
                'description' => 'Bertanggung jawab mengelola data permintaan dan ketersediaan ATK serta statusnya.'
            ]
        );
        $adminAtkRole->syncPermissions($adminAtkPermissions);

        // 🛡️ Role: Operator ATK---------------------------------------------
        $operatorAtkPermissions = [
            'view_admin_dashboard',

            'change_supplies_status',
            'create_supplies',
            'view_supplies',
            'report_supplies',

            'view_homepage',
            'view_history',
        ];
        $operatorAtkRole = Role::create(
            [
                'name' => 'operator_atk',
                'label' => 'Operator ATK',
                'guard_name' => 'web',
                'description' => 'Bertanggung jawab mengelola data permintaan ATK serta statusnya.'
            ]
        );
        $operatorAtkRole->syncPermissions($operatorAtkPermissions);


        // 🛡️ Role: Admin Ruangan--------------------------------------
        $adminRuanganPermissions = [
            'view_admin_dashboard',

            'change_booking_status',
            'create_booking',
            'view_bookings',
            'report_bookings',

            'delete_rooms',
            'edit_rooms',
            'create_rooms',
            'view_rooms',

            'view_homepage',
            'view_history',
        ];
        $adminRuanganRole = Role::create(
            [
                'name' => 'admin_ruangan',
                'label' => 'Admin Ruangan Rapat',
                'guard_name' => 'web',
                'description' => 'Mengelola ruangan rapat dan seluruh permintaan booking yang masuk serta mengelola daftar dan status ruangan.'
            ]
        );
        $adminRuanganRole->syncPermissions($adminRuanganPermissions);

        // 🛡️ Role: Operator Ruangan--------------------------------------
        $operatorRuanganPermissions = [
            'view_admin_dashboard',

            'change_booking_status',
            'create_booking',
            'view_bookings',
            'report_bookings',

            'view_homepage',
            'view_history',
        ];
        $operatorRuanganRole = Role::create(
            [
                'name' => 'operator_ruangan',
                'label' => 'Operator Ruangan Rapat',
                'guard_name' => 'web',
                'description' => 'Mengelola ruangan rapat dan seluruh permintaan booking yang masuk.'
            ]
        );
        $operatorRuanganRole->syncPermissions($operatorRuanganPermissions);


        // 🛡️ Role: Admin Kerusakan Gedung--------------------------------------
        $adminKerusakanGedungPermissions = [
            'view_admin_dashboard',

            'change_damage_status',
            'create_damage',
            'view_damages',
            'view_admin_damages',
            'report_damages',

            'delete_category_damages',
            'edit_category_damages',
            'create_category_damages',
            'view_category_damages',

            'view_homepage',
            'view_history',
        ];
        $adminKerusakanGedungRole = Role::create(
            [
                'name' => 'admin_perbaikan_sarpras',
                'label' => 'Admin Perbaikan Sarpras',
                'guard_name' => 'web',
                'description' => 'Mengelola permintaan perbaikan sarpras serta kategori kerusakan.'
            ]
        );
        $adminKerusakanGedungRole->syncPermissions($adminKerusakanGedungPermissions);

        // 🛡️ Role: Operator Kerusakan Gedung_Bangunan--------------------------------------
        $operatorKerusakanGedungBangunanPermissions = [
            'view_admin_dashboard',

            'change_damage_status',
            'create_damage',
            'view_damages',
            'view_bangunan_damages',
            'report_damages',

            'view_homepage',
            'view_history',
        ];
        $operatorKerusakanBangunanGedungRole = Role::create(
            [
                'name' => 'operator_bangunan_perbaikan_sarpras',
                'label' => 'Operator Bangunan Perbaikan Sarpras',
                'guard_name' => 'web',
                'description' => 'Mengelola permintaan perbaikan bangunan sarpras.'
            ]
        );
        $operatorKerusakanBangunanGedungRole->syncPermissions($operatorKerusakanGedungBangunanPermissions);


        // 🛡️ Role: Operator Kerusakan Gedung_Perlengkapan--------------------------------------
        $operatorKerusakanGedungPerlengkapanPermissions = [
            'view_admin_dashboard',

            'change_damage_status',
            'create_damage',
            'view_damages',
            'view_perlengkapan_damages',
            'report_damages',

            'view_homepage',
            'view_history',
        ];
        $operatorKerusakanPerlengkapanGedungRole = Role::create(
            [
                'name' => 'operator_perlengkapan_perbaikan_sarpras',
                'label' => 'Operator Perlengkapan Perbaikan Sarpras',
                'guard_name' => 'web',
                'description' => 'Mengelola permintaan perbaikan perlengkapan sarpras.'
            ]
        );
        $operatorKerusakanPerlengkapanGedungRole->syncPermissions($operatorKerusakanGedungPerlengkapanPermissions);


        // 👤 Role: Pegawai------------------------------
        $pegawaiPermissions = [
            'view_homepage',
            'view_history',

            'create_vehicle',
            'create_damage',
            'create_supplies',
        ];
        $pegawaiRole = Role::create(
            [
                'name' => 'pegawai',
                'label' => 'Pegawai',
                'guard_name' => 'web',
                'description' => 'Dapat mengajukan berbagai permintaan seperti booking ruangan, kendaraan, ATK, dan permintaan perbaikan sarpras.'
            ]
        );
        $pegawaiRole->syncPermissions($pegawaiPermissions);


        // // 👤 Role: superVisorRole------------------------------
        // $superVisorPermissions = [
        //     'view_homepage',
        //     'view_history',

        //     'create_vehicle',
        //     'create_damage',
        //     'create_supplies',
        //     'create_booking',
        // ];
        // $superVisorRole = Role::create(
        //     [
        //         'name' => 'supervisor',
        //         'label' => 'Supervisor',
        //         'guard_name' => 'web',
        //         'description' => 'Dapat mengajukan berbagai permintaan seperti booking ruangan, kendaraan, ATK, dan permintaan perbaikan sarpras.'
        //     ]
        // );
        // $superVisorRole->syncPermissions($superVisorPermissions);

        // 👤 Role: Pimpinan------------------------------
        $atasanPermissions = [
            'view_rooms',
            'view_admin_dashboard',
            'view_vehicles',
            'view_supplies',
            'view_bookings',
            'view_damages',
            'view_category_damages',
            'view_atk',
        ];
        $atasanRole = Role::create(
            [
                'name' => 'pimpinan',
                'label' => 'Pimpinan',
                'guard_name' => 'web',
                'description' => 'Dapat melihat berbagai permintaan seperti booking ruangan, kendaraan, ATK, dan permintaan perbaikan sarpras.'
            ]
        );
        $atasanRole->syncPermissions($atasanPermissions);


        // 🎖️ Role: Super Admin--------------------------------
        $superAdminPermissions = [
            'view_rooms',
            'create_rooms',
            'edit_rooms',
            'delete_rooms',
            'view_atk',
            'create_atk',
            'edit_atk',
            'delete_atk',
            'view_category_damages',
            'create_category_damages',
            'edit_category_damages',
            'delete_category_damages',
            'create_log_proses',
            'edit_log_proses',
            'delete_log_proses',
            'view_admin_damages',
            'view_damages',
            'report_damages',
            'create_damage',
            'change_damage_status',
            'view_bookings',
            'report_bookings',
            'create_booking',
            'change_booking_status',
            'view_supplies',
            'report_supplies',
            'create_supplies',
            'change_supplies_status',
            'view_vehicles',
            'create_vehicle',
            'change_vehicle_status',
            'view_admin_dashboard',
            'view_history',
            'view_homepage',
            'management_access',
            'delete_all_requests'
        ];

        $super_adminRole = Role::create(
            [
                'name' => 'super_admin',
                'label' => 'Super Admin',
                'guard_name' => 'web',
                'description' => 'Memiliki akses tampilan dan monitoring seluruh data dan modul permintaan.'
            ]
        );
        $super_adminRole->syncPermissions($superAdminPermissions);


        // ---------------------------------------------------------
        // 🎖️ Role: Developer--------------------------------
        $developerPermissions = [
            'view_rooms',
            'create_rooms',
            'edit_rooms',
            'delete_rooms',
            'view_atk',
            'create_atk',
            'edit_atk',
            'delete_atk',
            'view_category_damages',
            'create_category_damages',
            'edit_category_damages',
            'delete_category_damages',
            'create_log_proses',
            'edit_log_proses',
            'delete_log_proses',
            'view_damages',
            'view_admin_damages',
            'report_damages',
            'create_damage',
            'change_damage_status',
            'view_bookings',
            'report_bookings',
            'create_booking',
            'change_booking_status',
            'view_supplies',
            'report_supplies',
            'create_supplies',
            'change_supplies_status',
            'view_vehicles',
            'create_vehicle',
            'change_vehicle_status',
            'view_admin_dashboard',
            'view_history',
            'view_homepage',
            'management_access',
            'view_drivers',
            'manage_drivers',
            'view_vehicles_master',
            'manage_vehicles_master',
            'delete_all_requests'
        ];

        $developerRole = Role::create(
            [
                'name' => 'developer_swp',
                'label' => 'Developer Setwapres',
                'guard_name' => 'web',
                'description' => 'Memiliki akses tampilan dan monitoring seluruh data dan modul permintaan.'
            ]
        );
        $developerRole->syncPermissions($developerPermissions);
    }
}
