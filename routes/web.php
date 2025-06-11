<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\KerusakanBarangController;
use App\Http\Controllers\PemesananRuangRapatController;
use App\Http\Controllers\PermintaanAtkController;
use App\Http\Controllers\PermintaanKendaraanController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [HomeController::class, 'index'])->name('home');

Route::get('/ruang-rapat', [PemesananRuangRapatController::class, 'create'])->name('ruangrapat.create');

Route::get('/kerusakan-gedung', [KerusakanBarangController::class, 'create'])->name('kerusakanbarang.create');

Route::get('/permintaan-kendaraan', [PermintaanKendaraanController::class, 'create'])->name('permintaankendaraan.create');

Route::get('/permintaan-atk', [PermintaanAtkController::class, 'create'])->name('permintaanatk.create');


Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [HomeController::class, 'admin'])->name('dashboard');

    Route::get('/dashboard/ruang-rapat', [PemesananRuangRapatController::class, 'index'])->name('ruangrapat.index');

    Route::get('/dashboard/kerusakan-gedung', [KerusakanBarangController::class, 'index'])->name('kerusakanbarang.index');

    Route::get('/dashboard/permintaan-kendaraan', [PermintaanKendaraanController::class, 'index'])->name('permintaankendaraan.index');

    Route::get('/dashboard/permintaan-atk', [PermintaanAtkController::class, 'index'])->name('permintaanatk.index');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
