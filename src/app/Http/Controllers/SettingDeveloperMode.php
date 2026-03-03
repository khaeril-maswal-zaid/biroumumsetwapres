<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SettingDeveloperMode extends Controller
{
    public function migrateSeederPage()
    {
        return Inertia::render('settings/migrateseeder');
    }

    public function migrateSeeder(Request $request)
    {
        abort_unless(app()->environment(['local', 'development']), 403);

        $request->validate([
            'password' => ['required', 'current_password'],
            'confirm' => ['required', 'in:RESET_DATABASE'],
        ]);

        Artisan::queue('app:dev-refresh-database');

        return back()->with('success', 'Database refresh is running in background.');
    }
}
