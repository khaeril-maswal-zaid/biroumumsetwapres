<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
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

            // 🛠️ Kerusakan
            ['name' => 'view_damages', 'label' => 'Lihat Laporan Kerusakan Gedung', 'category' => 'Laporan Kerusakan Gedung'],
            ['name' => 'report_damages', 'label' => 'Data Laporan Kerusakan Gedung', 'category' => 'Laporan Kerusakan Gedung'],
            ['name' => 'create_damage', 'label' => 'Laporkan Kerusakan Gedung', 'category' => 'Laporan Kerusakan Gedung'],
            ['name' => 'change_damage_status', 'label' => 'Konfirmasi Kerusakan Gedung', 'category' => 'Laporan Kerusakan Gedung'],

            // 📅 Pemesanan Ruang
            ['name' => 'view_bookings', 'label' => 'Lihat Pemesanan Ruang', 'category' => 'Pemesanan Ruang Rapat'],
            ['name' => 'report_bookings', 'label' => 'Laporan Pemesanan Ruang', 'category' => 'Pemesanan Ruang Rapat'],
            ['name' => 'create_booking', 'label' => 'Ajukan Pemesanan Ruang', 'category' => 'Pemesanan Ruang Rapat'],
            ['name' => 'change_booking_status', 'label' => 'Konfirmasi Pemesanan Ruang', 'category' => 'Pemesanan Ruang Rapat'],

            // 🖊️ ATK
            ['name' => 'view_suppliess', 'label' => 'Lihat Permintaan ATK', 'category' => 'Permintaan ATK'],
            ['name' => 'report_suppliess', 'label' => 'Laporan Permintaan ATK', 'category' => 'Permintaan ATK'],
            ['name' => 'create_supplies', 'label' => 'Ajukan Permintaan ATK', 'category' => 'Permintaan ATK'],
            ['name' => 'change_supplies_status', 'label' => 'Konfirmasi Permintaan ATK', 'category' => 'Permintaan ATK'],

            // 🚗 Kendaraan
            ['name' => 'view_vehicles', 'label' => 'Lihat Permintaan Kendaraan', 'category' => 'Kendaraan'],
            ['name' => 'create_vehicle', 'label' => 'Ajukan Permintaan Kendaraan', 'category' => 'Kendaraan'],
            ['name' => 'change_vehicle_status', 'label' => 'Konfirmasi Permintaan Kendaraan', 'category' => 'Kendaraan'],

            // 📊 Umum
            ['name' => 'view_admin_dashboard', 'label' => 'Lihat Dashboard', 'category' => 'Umum'],
            ['name' => 'view_history', 'label' => 'Lihat Riwayat', 'category' => 'Umum'],
            ['name' => 'view_homepage', 'label' => 'Lihat Beranda', 'category' => 'Umum'],

            ['name' => 'management_access', 'label' => 'Akses Manajement', 'category' => 'Khusus'],
        ];

        // 🔁 Buat atau update semua permission dengan label & kategori
        foreach ($permissions as $perm) {
            Permission::updateOrCreate(
                [
                    'name' => $perm['name'],
                    'label' => $perm['label'],
                    'category' => $perm['category']
                ]
            );
        }


        // 🛡️ Role: Admin ATK---------------------------------------------
        $adminAtkPermissions = [
            'view_admin_dashboard',

            'change_supplies_status',
            'create_supplies',
            'view_suppliess',
            'report_suppliess',

            'delete_atk',
            'edit_atk',
            'create_atk',
            'view_atk',
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
        ];
        $adminRuanganRole = Role::create(
            [
                'name' => 'admin_ruangan',
                'label' => 'Admin Ruangan Rapat',
                'guard_name' => 'web',
                'description' => 'Mengelola ruangan rapat dan seluruh permintaan booking yang masuk.'
            ]
        );
        $adminRuanganRole->syncPermissions($adminRuanganPermissions);


        // 🛡️ Role: Admin Kerusakan Gedung--------------------------------------
        $adminKerusakanGedungPermissions = [
            'view_admin_dashboard',

            'change_damage_status',
            'create_damage',
            'view_damages',
            'report_damages',

            'delete_category_damages',
            'edit_category_damages',
            'create_category_damages',
            'view_category_damages',
        ];
        $adminKerusakanGedungRole = Role::create(
            [
                'name' => 'admin_kerusakan_gedung',
                'label' => 'Admin Kerusakan Gedung',
                'guard_name' => 'web',
                'description' => 'Mengelola laporan kerusakan gedung serta kategori kerusakan.'
            ]
        );
        $adminKerusakanGedungRole->syncPermissions($adminKerusakanGedungPermissions);


        // 👤 Role: Pegawai------------------------------
        $pegawaiPermissions = [
            'view_homepage',
            'view_history',

            'create_booking',
            'create_vehicle',
            'create_damage',
            'create_supplies',
        ];
        $pegawaiRole = Role::create(
            [
                'name' => 'pegawai',
                'label' => 'Pegawai',
                'guard_name' => 'web',
                'description' => 'Dapat mengajukan berbagai permintaan seperti booking ruangan, kendaraan, ATK, dan pelaporan kerusakan.'
            ]
        );
        $pegawaiRole->syncPermissions($pegawaiPermissions);


        // 🎖️ Role: Atasan--------------------------------
        $superAdminPermissions = [
            'view_admin_dashboard',

            'view_vehicles',
            'view_suppliess',
            'view_bookings',
            'view_damages',

            'view_category_damages',
            'view_atk',
            'view_rooms',

            'report_suppliess',
            'report_bookings',
            'report_damages',

            'management_access'
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
    }
}
