<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\KerusakanGedungController;
use App\Http\Controllers\PemesananRuangRapatController;
use App\Http\Controllers\PermintaanAtkController;
use App\Http\Controllers\PermintaanKendaraanController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [HomeController::class, 'index'])->name('home');

Route::get('/ruang-rapat', [PemesananRuangRapatController::class, 'create'])->name('ruangrapat.create');

Route::get('/kerusakan-gedung', [KerusakanGedungController::class, 'create'])->name('kerusakangedung.create');

Route::get('/permintaan-kendaraan', [PermintaanKendaraanController::class, 'create'])->name('permintaankendaraan.create');

Route::get('/permintaan-atk', [PermintaanAtkController::class, 'create'])->name('permintaanatk.create');


Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
