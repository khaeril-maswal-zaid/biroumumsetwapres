<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Show the login page.
     */
    public function create(Request $request): Response
    {
        return Inertia::render('auth/login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();
        $request->session()->regenerate();

        $user = Auth::user();

        $adminAtkPermissions = [
            'view_admin_dashboard',

            'change_supplies_status',
            'create_supplies',
            'view_suppliess',

            'delete_atk',
            'edit_atk',
            'create_atk',
            'view_atk',
        ];

        $adminRuanganPermissions = [
            'view_admin_dashboard',

            'change_booking_status',
            'create_booking',
            'view_bookings',

            'delete_rooms',
            'edit_rooms',
            'create_rooms',
            'view_rooms',
        ];

        $adminKerusakanGedungPermissions = [
            'view_admin_dashboard',

            'change_damage_status',
            'create_damage',
            'view_damages',

            'delete_category_damages',
            'edit_category_damages',
            'create_category_damages',
            'view_category_damages',
        ];

        $superAdminPermissions = [
            'view_admin_dashboard',

            'view_vehicles',
            'view_suppliess',
            'view_bookings',
            'view_damages',

            'view_category_damages',
            'view_atk',
            'view_rooms',

            'management_access'
        ];

        $allPermissions = array_merge(
            $adminAtkPermissions,
            $adminRuanganPermissions,
            $adminKerusakanGedungPermissions,
            $superAdminPermissions
        );

        if ($user->hasAnyPermission($allPermissions)) {
            return redirect()->intended(route('dashboard'));
        }

        return redirect()->intended(route('home'));
    }


    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
