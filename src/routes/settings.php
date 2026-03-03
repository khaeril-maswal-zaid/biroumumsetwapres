<?php

use App\Http\Controllers\SettingDeveloperMode;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function () {
    Route::redirect('settings', 'settings/appearance');

    // Route::get('settings/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    // Route::patch('settings/profile', [ProfileController::class, 'update'])->name('profile.update');
    // Route::delete('settings/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Route::get('settings/password', [PasswordController::class, 'edit'])->name('password.edit');
    // Route::put('settings/password', [PasswordController::class, 'update'])->name('password.update');

    Route::get('settings/developer-only', [SettingDeveloperMode::class, 'migrateSeederPage'])->name('developeronly.page');
    Route::post('settings/developer-only', [SettingDeveloperMode::class, 'migrateSeeder'])->name('developeronly.migrate');

    // Route::get('settings/appearance', function () {
    //     return Inertia::render('settings/appearance');
    // })->name('appearance');
});
