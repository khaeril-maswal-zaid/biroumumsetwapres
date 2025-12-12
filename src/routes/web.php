<?php

use App\Http\Controllers\DaftarAtkController;
use App\Http\Controllers\DaftarRuanganController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\KategoriKerusakanController;
use App\Http\Controllers\KerusakanGedungController;
use App\Http\Controllers\LogProsesController;
use App\Http\Controllers\PemesananRuangRapatController;
use App\Http\Controllers\PermintaanAtkController;
use App\Http\Controllers\PermintaanKendaraanController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    // Halaman utama user (view_homepage)
    Route::get('/', [HomeController::class, 'index'])
        ->name('home');
    // ->middleware('permission:view_homepage');

    // Profile user (bisa semua user terverifikasi)
    Route::get('/profile', [UserController::class, 'show'])
        ->name('user.create')->middleware('permission:view_homepage');

    // History user (view_history)
    Route::get('/history', [HomeController::class, 'history'])
        ->name('history');
    // ->middleware('permission:view_history');


    // Pengajuan Ruang Rapat (create_booking)
    Route::get('/ruang-rapat', [PemesananRuangRapatController::class, 'create'])
        ->name('ruangrapat.create')->middleware('permission:create_booking');

    Route::get('/pemesanan-ruang-rapat-available/', [PemesananRuangRapatController::class, 'getAvailableRooms'])
        ->name('ruangrapat.available');

    Route::post('/ruang-rapat/store', [PemesananRuangRapatController::class, 'store'])
        ->name('ruangrapat.store')->middleware('permission:create_booking');

    // Laporan Kerusakan Gedung (create_damage)
    Route::get('/lapor-kerusakan-gedung', [KerusakanGedungController::class, 'create'])
        ->name('kerusakangedung.create')->middleware('permission:create_damage');

    Route::post('/kerusakan-gedung/store', [KerusakanGedungController::class, 'store'])
        ->name('kerusakangedung.store')->middleware('permission:create_damage');

    // Permintaan ATK (create_supplies)
    Route::get('/permintaan-atk', [PermintaanAtkController::class, 'create'])
        ->name('permintaanatk.create')->middleware('permission:create_supplies');

    Route::post('/permintaan-atk/store', [PermintaanAtkController::class, 'store'])
        ->name('permintaanatk.store')->middleware('permission:create_supplies');

    // Permintaan Kendaraan (create_vehicle_request)
    Route::get('/permintaan-kendaraan', [PermintaanKendaraanController::class, 'create'])
        ->name('permintaankendaraan.create');
    // ->middleware('permission:create_vehicle_request');



    //---------------------------------------DASHBOARD --------------------------------
    //---------------------------------------------------------------------------------

    // Dashboard admin (view_admin_dashboard)
    Route::get('/dashboard', [HomeController::class, 'admin'])
        ->name('dashboard')
        ->middleware('permission:view_admin_dashboard');



    // Manajemen Booking (view_bookings & change_booking_status)
    Route::get('/dashboard/ruang-rapat', [PemesananRuangRapatController::class, 'index'])
        ->name('ruangrapat.index')
        ->middleware('permission:view_bookings');

    Route::put('/dashboard/ruang-rapat/update/{pemesananRuangRapat:kode_booking}', [PemesananRuangRapatController::class, 'update'])
        ->name('ruangrapat.update')
        ->middleware('permission:view_bookings');

    Route::get('/dashboard/ruang-rapat-review/{pemesananRuangRapat:kode_booking}', [PemesananRuangRapatController::class, 'show'])
        ->name('ruangrapat.show')
        ->middleware('permission:view_bookings');

    Route::patch('/dashboard/ruang-rapat/{pemesananRuangRapat:kode_booking}', [PemesananRuangRapatController::class, 'status'])
        ->name('ruangrapat.status')
        ->middleware('permission:change_booking_status');



    //Log Proces Perbaikan kerusakan
    Route::post('/log-proses-kerusakan', [LogProsesController::class, 'store'])
        ->name('logproses.store')->middleware('permission:create_log_proses');
    Route::delete('/log-proses-kerusakan/delete/{logProses}', [LogProsesController::class, 'destroy'])
        ->name('logproses.destroy')->middleware('permission:delete_log_proses');



    // Manajemen Kerusakan (view_damages & change_damage_status)
    Route::get('/dashboard/kerusakan-gedung', [KerusakanGedungController::class, 'index'])
        ->name('kerusakangedung.index')
        ->middleware('permission:view_damages');

    Route::get('/dashboard/kerusakan-gedung/detail/{kerusakanGedung:kode_pelaporan}', [KerusakanGedungController::class, 'show'])
        ->name('kerusakangedung.show')
        ->middleware('permission:view_damages');

    Route::patch('/dashboard/kerusakan-gedung/{kerusakanGedung:kode_pelaporan}', [KerusakanGedungController::class, 'status'])
        ->name('kerusakangedung.status')
        ->middleware('permission:change_damage_status');

    Route::patch('/dashboard/kerusakan-gedung/set-urgensi/{kerusakanGedung:kode_pelaporan}', [KerusakanGedungController::class, 'urgensi'])
        ->name('kerusakangedung.urgensi')
        ->middleware('permission:change_damage_status');



    // Manajemen ATK (view_supplies_requests & change_supplies_status)
    Route::get('/dashboard/permintaan-atk', [PermintaanAtkController::class, 'index'])
        ->name('permintaanatk.index')
        ->middleware('permission:view_suppliess');

    Route::get('/dashboard/permintaan-atk-review/{permintaanAtk:kode_pelaporan}', [PermintaanAtkController::class, 'show'])
        ->name('permintaanatk.show')
        ->middleware('permission:view_suppliess');

    Route::patch('/dashboard/permintaan-atk/{permintaanAtk:kode_pelaporan}', [PermintaanAtkController::class, 'status'])
        ->name('permintaanatk.status')
        ->middleware('permission:change_supplies_status');

    // Manajemen Permintaan Kendaraan (view_vehicle_requests)
    Route::get('/dashboard/permintaan-kendaraan', [PermintaanKendaraanController::class, 'index'])
        ->name('permintaankendaraan.index')
        ->middleware('permission:view_vehicle_requests');



    // Manajemen Daftar Ruangan (view_rooms, create_rooms, edit_rooms, delete_rooms)
    Route::get('/dashboard/manajemen-ruangan', [DaftarRuanganController::class, 'index'])
        ->name('rooms.index')
        ->middleware('permission:view_rooms');


    Route::post('/dashboard/manajemen-ruangan/store', [DaftarRuanganController::class, 'store'])
        ->name('rooms.store')
        ->middleware('permission:create_rooms');


    Route::put('/dashboard/manajemen-ruangan/update/{daftarRuangan:kode_ruangan}', [DaftarRuanganController::class, 'update'])
        ->name('rooms.update')
        ->middleware('permission:edit_rooms');


    Route::delete('/dashboard/manajemen-ruangan/delete/{daftarRuangan:kode_ruangan}', [DaftarRuanganController::class, 'destroy'])
        ->name('rooms.delete')
        ->middleware('permission:delete_rooms');



    Route::get('/dashboard/daftar-atk', [DaftarAtkController::class, 'index'])
        ->name('daftaratk.index')
        ->middleware('permission:view_atk');


    Route::put('/dashboard/daftar-atk/{daftarAtk}', [DaftarAtkController::class, 'update'])
        ->name('daftaratk.update')
        ->middleware('permission:create_atk');


    Route::post('/dashboard/daftar-atk/store', [DaftarAtkController::class, 'store'])
        ->name('daftaratk.store')
        ->middleware('permission:edit_atk');


    Route::delete('/dashboard/daftar-atk/destroy/{daftarAtk}', [DaftarAtkController::class, 'destroy'])
        ->name('daftaratk.destroy')
        ->middleware('permission:delete_atk');



    //Kategori Kerusakan
    Route::get('/dashboard/daftar-kategori-kerusakan', [KategoriKerusakanController::class, 'index'])
        ->name('daftarkerusakan.index')
        ->middleware('permission:view_category_damages');


    Route::post('/dashboard/daftar-kategori-kerusakan/store', [KategoriKerusakanController::class, 'store'])
        ->name('daftarkerusakan.store')
        ->middleware('permission:create_category_damages');


    Route::put('/dashboard/daftar-kategori-kerusakan/update/{kategoriKerusakan}', [KategoriKerusakanController::class, 'update'])
        ->name('daftarkerusakan.update')
        ->middleware('permission:edit_category_damages');


    Route::delete('/dashboard/daftar-kategori-kerusakan/destroy/{kategoriKerusakan}', [KategoriKerusakanController::class, 'destroy'])
        ->name('daftarkerusakan.destroy')
        ->middleware('permission:delete_category_damages');




    //Ruang Rapat
    Route::get('/dashboard/ruang-rapat/reports', [PemesananRuangRapatController::class, 'reports'])
        ->name('ruangrapat.reports')
        ->middleware('permission:report_bookings');


    Route::get('/dashboard/permintaan-atk/reports', [PermintaanAtkController::class, 'reports'])
        ->name('permintaanatk.reports')
        ->middleware('permission:report_suppliess');


    Route::get('/dashboard/kerusakan-gedung/reports', [KerusakanGedungController::class, 'reports'])
        ->name('kerusakangedung.reports')
        ->middleware('permission:report_damages');


    // (Opsional) Manajemen Permissions via UI
    Route::get('/dashboard/manajemen-permissions', [RoleController::class, 'index'])
        ->name('roles.index')
        ->middleware('permission:management_access');


    Route::post('/dashboard/manajemen-permissions/store', [RoleController::class, 'store'])
        ->name('roles.store')
        ->middleware('permission:management_access');


    Route::put('/dashboard/manajemen-permissions/update/{role}', [RoleController::class, 'update'])
        ->name('roles.update')
        ->middleware('permission:management_access');


    Route::delete('/dashboard/manajemen-permissions/destroy/{role}', [RoleController::class, 'destroy'])
        ->name('roles.destroy')
        ->middleware('permission:management_access');


    Route::patch('/dashboard/user/role/{user}', [UserController::class, 'role'])
        ->name('users.role')
        ->middleware('permission:management_access');



    Route::patch('/dashboard/isread-notfikasi/{notification}', [HomeController::class, 'isReadNotfif'])
        ->name('notif.isread')
        ->middleware('permission:view_admin_dashboard');


    Route::patch('/dashboard/isread-notfikasi-all', [HomeController::class, 'isReadAllNotfif'])
        ->name('notif.isreadall')
        ->middleware('permission:view_admin_dashboard');
});


require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';

// routes/web.php
Route::get('/{filename}', [PermintaanAtkController::class, 'showMemo'])->name('memo');
