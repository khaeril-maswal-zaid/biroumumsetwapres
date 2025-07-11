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
            ['name' => 'view_rooms', 'label' => 'Lihat Data Ruangan', 'category' => 'Manajemen'],
            ['name' => 'create_rooms', 'label' => 'Tambah Ruangan', 'category' => 'Manajemen'],
            ['name' => 'edit_rooms', 'label' => 'Ubah Ruangan', 'category' => 'Manajemen'],
            ['name' => 'delete_rooms', 'label' => 'Hapus Ruangan', 'category' => 'Manajemen'],

            // 🛠️ Kerusakan
            ['name' => 'view_damages', 'label' => 'Lihat Laporan Kerusakan', 'category' => 'Kerusakan'],
            ['name' => 'report_damage', 'label' => 'Laporkan Kerusakan', 'category' => 'Kerusakan'],
            ['name' => 'change_damage_status', 'label' => 'Konfirmasi Kerusakan', 'category' => 'Kerusakan'],

            // 📅 Pemesanan Ruang
            ['name' => 'view_bookings', 'label' => 'Lihat Pemesanan Ruang', 'category' => 'Pemesanan'],
            ['name' => 'create_booking', 'label' => 'Ajukan Pemesanan Ruang', 'category' => 'Pemesanan'],
            ['name' => 'change_booking_status', 'label' => 'Konfirmasi Pemesanan Ruang', 'category' => 'Pemesanan'],

            // 🖊️ ATK
            ['name' => 'view_supplies_requests', 'label' => 'Lihat Permintaan ATK', 'category' => 'ATK'],
            ['name' => 'create_supplies_request', 'label' => 'Ajukan Permintaan ATK', 'category' => 'ATK'],
            ['name' => 'change_supplies_status', 'label' => 'Konfirmasi Permintaan ATK', 'category' => 'ATK'],

            // 🚗 Kendaraan
            ['name' => 'view_vehicle_requests', 'label' => 'Lihat Permintaan Kendaraan', 'category' => 'Kendaraan'],
            ['name' => 'create_vehicle_request', 'label' => 'Ajukan Permintaan Kendaraan', 'category' => 'Kendaraan'],
            ['name' => 'change_vehicle_status', 'label' => 'Konfirmasi Permintaan Kendaraan', 'category' => 'Kendaraan'],

            // 📊 Umum
            ['name' => 'view_admin_dashboard', 'label' => 'Lihat Dashboard', 'category' => 'Umum'],
            ['name' => 'view_history', 'label' => 'Lihat Riwayat', 'category' => 'Umum'],
            ['name' => 'view_homepage', 'label' => 'Lihat Beranda', 'category' => 'Umum'],
        ];

        // 🔁 Buat atau update semua permission dengan label & kategori
        foreach ($permissions as $perm) {
            Permission::updateOrCreate(
                ['name' => $perm['name']],
                ['label' => $perm['label'], 'category' => $perm['category']]
            );
        }

        // 🛡️ Role: Admin
        $adminRole = Role::firstOrCreate(
            ['name' => 'admin', 'guard_name' => 'web'], // pencarian
            ['description' => 'Akses penuh ke semua fitur sistem'] // nilai default jika belum ada
        );
        $adminRole->syncPermissions(Permission::all());

        // 👤 Role: Pegawai
        $pegawaiPermissions = [
            'create_booking',
            'view_homepage',
            'view_history',
            'create_vehicle_request',
            'report_damage',
            'create_supplies_request',
        ];
        $pegawaiRole = Role::firstOrCreate(
            ['name' => 'pegawai', 'guard_name' => 'web'],
            ['description' => 'Dapat mengajukan permintaan dan melihat statusnya']
        );
        $pegawaiRole->syncPermissions($pegawaiPermissions);

        // 🎖️ Role: Atasan
        $atasanPermissions = [
            'view_rooms',
            'view_damages',
            'view_bookings',
            'view_supplies_requests',
            'view_vehicle_requests',
            'change_damage_status',
            'change_booking_status',
            'change_supplies_status',
            'view_admin_dashboard',
            'view_history',
        ];
        $atasanRole = Role::firstOrCreate(
            ['name' => 'atasan', 'guard_name' => 'web'],
            ['description' => 'Dapat memantau dan mengonfirmasi permintaan']
        );
        $atasanRole->syncPermissions($atasanPermissions);
    }
}
