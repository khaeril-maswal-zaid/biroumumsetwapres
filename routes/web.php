<?php

use App\Http\Controllers\DaftarRuanganController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\KerusakanGedungController;
use App\Http\Controllers\PemesananRuangRapatController;
use App\Http\Controllers\PermintaanAtkController;
use App\Http\Controllers\PermintaanKendaraanController;
use App\Http\Controllers\UserController;
use App\Models\DaftarRuangan;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'ruleUser:pegawai'])->group(function () {
    Route::get('/', [HomeController::class, 'index'])->name('home');

    Route::get('/ruang-rapat', [PemesananRuangRapatController::class, 'create'])->name('ruangrapat.create');
    Route::post('/ruang-rapat/store', [PemesananRuangRapatController::class, 'store'])->name('ruangrapat.store');

    Route::get('/kerusakan-gedung', [KerusakanGedungController::class, 'create'])->name('kerusakangedung.create');
    Route::post('/kerusakan-gedung/store', [KerusakanGedungController::class, 'store'])->name('kerusakangedung.store');
    Route::patch('/dashboard/kerusakan-gedung-confirmed/{kerusakanGedung:kode_pelaporan}', [KerusakanGedungController::class, 'status'])->name('kerusakangedung.statusconfir');

    Route::get('/permintaan-kendaraan', [PermintaanKendaraanController::class, 'create'])->name('permintaankendaraan.create');

    Route::get('/permintaan-atk', [PermintaanAtkController::class, 'create'])->name('permintaanatk.create');
    Route::post('/permintaan-atk/store', [PermintaanAtkController::class, 'store'])->name('permintaanatk.store');
    Route::patch('/dashboard/permintaan-atk-confirmed/{permintaanAtk:kode_pelaporan}', [PermintaanAtkController::class, 'status'])->name('permintaanatk.statusconfir');

    Route::get('/profile', [UserController::class, 'show'])->name('user.create');

    Route::get('/history', [HomeController::class, 'history'])->name('history');
});

Route::middleware(['auth', 'verified', 'ruleUser:admin'])->group(function () {
    Route::get('/dashboard', [HomeController::class, 'admin'])->name('dashboard');

    Route::get('/dashboard/ruang-rapat', [PemesananRuangRapatController::class, 'index'])->name('ruangrapat.index');
    Route::patch('/dashboard/ruang-rapat/{pemesananruangrapat:kode_booking}', [PemesananRuangRapatController::class, 'status'])->name('ruangrapat.status');

    Route::get('/dashboard/kerusakan-gedung', [KerusakanGedungController::class, 'index'])->name('kerusakangedung.index');
    Route::patch('/dashboard/kerusakan-gedung/{kerusakanGedung:kode_pelaporan}', [KerusakanGedungController::class, 'status'])->name('kerusakangedung.status');

    Route::get('/dashboard/permintaan-kendaraan', [PermintaanKendaraanController::class, 'index'])->name('permintaankendaraan.index');

    Route::get('/dashboard/permintaan-atk', [PermintaanAtkController::class, 'index'])->name('permintaanatk.index');
    Route::patch('/dashboard/permintaan-atk/{permintaanAtk:kode_pelaporan}', [PermintaanAtkController::class, 'status'])->name('permintaanatk.status');

    Route::get('/dashboard/manajemen-ruangan', [DaftarRuanganController::class, 'index'])->name('rooms.index');
    Route::post('/dashboard/manajemen-ruangan/store', [DaftarRuanganController::class, 'store'])->name('rooms.store');
    Route::put('/dashboard/manajemen-ruangan/update/{daftarRuangan:kode_ruangan}', [DaftarRuanganController::class, 'update'])->name('rooms.update');
    Route::delete('/dashboard/manajemen-ruangan/delete/{daftarRuangan:kode_ruangan}', [DaftarRuanganController::class, 'destroy'])->name('rooms.delete');

    Route::get('/dashboard/manajemen-permissions', [HomeController::class, 'sementara'])->name('permissions.index');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
