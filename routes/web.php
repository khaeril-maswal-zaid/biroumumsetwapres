<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\KerusakanGedungController;
use App\Http\Controllers\PemesananRuangRapatController;
use App\Http\Controllers\PermintaanAtkController;
use App\Http\Controllers\PermintaanKendaraanController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'ruleUser:pegawai'])->group(function () {
    Route::get('/', [HomeController::class, 'index'])->name('home');

    Route::get('/ruang-rapat', [PemesananRuangRapatController::class, 'create'])->name('ruangrapat.create');
    Route::post('/ruang-rapat/store', [PemesananRuangRapatController::class, 'store'])->name('ruangrapat.store');
    Route::get('/ruang-rapat/tersedia', [PemesananRuangRapatController::class, 'tersedia'])->name('ruangrapat.tersedia');

    Route::get('/kerusakan-gedung', [KerusakanGedungController::class, 'create'])->name('kerusakangedung.create');
    Route::post('/kerusakan-gedung/store', [KerusakanGedungController::class, 'store'])->name('kerusakangedung.store');

    Route::get('/permintaan-kendaraan', [PermintaanKendaraanController::class, 'create'])->name('permintaankendaraan.create');

    Route::get('/permintaan-atk', [PermintaanAtkController::class, 'create'])->name('permintaanatk.create');
    Route::post('/permintaan-atk/store', [PermintaanAtkController::class, 'store'])->name('permintaanatk.store');

    Route::get('/profile', [UserController::class, 'show'])->name('user.create');
});

Route::middleware(['auth', 'verified', 'ruleUser:admin'])->group(function () {
    Route::get('/dashboard', [HomeController::class, 'admin'])->name('dashboard');

    Route::get('/dashboard/ruang-rapat', [PemesananRuangRapatController::class, 'index'])->name('ruangrapat.index');

    Route::get('/dashboard/kerusakan-gedung', [KerusakanGedungController::class, 'index'])->name('kerusakanbarang.index');

    Route::get('/dashboard/permintaan-kendaraan', [PermintaanKendaraanController::class, 'index'])->name('permintaankendaraan.index');

    Route::get('/dashboard/permintaan-atk', [PermintaanAtkController::class, 'index'])->name('permintaanatk.index');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
