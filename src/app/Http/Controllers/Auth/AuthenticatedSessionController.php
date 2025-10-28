<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;
use LdapRecord\Auth\BindException;
use LdapRecord\Container;

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

    public function ldap_authenticate($nip_Sso, $password_Sso, User $user): RedirectResponse
    {
        try {
            $ldapUser = Container::getDefaultConnection()
                ->query();
            // ->where('samaccountname', '=', $nip_Sso)
            // ->first();

            dd($ldapUser);

            if (!$ldapUser || !Container::getDefaultConnection()->auth()->attempt($ldapUser['distinguishedname'][0], $password_Sso)) {
                return redirect()->back()->withErrors(['username' => 'Username atau password tidak sesuai']);
            }

            Auth::login($user);

            //After login successfully --------------------
            $userLoged = Auth::user();


            if ($userLoged->hasAnyPermission('view_admin_dashboard')) {
                return to_route('dashboard');
            }

            return to_route('home');
            //--------------------------------------------
        } catch (BindException $e) {
            Log::error('LDAP authentication failed', [
                'message' => $e->getMessage(),
                'username' => $nip_Sso
            ]);

            return redirect()->back()->withErrors(['username' => 'Terjadi kesalahan pada sistem autentikasi']);
        }
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $use_login = User::where('nip_sso', $request->email)->first();

        if ($use_login?->is_ldap) {
            $this->ldap_authenticate($request->email, $request->password, $use_login);
        }

        // $passwordDefault = '1234567';
        // if ($request->password === $passwordDefault) {
        //     Auth::login($use_login);
        // }

        // $user = Auth::user();

        // if ($user?->hasAnyPermission('view_admin_dashboard')) {
        //     return to_route('dashboard');
        // }

        // if ($user) {
        //     return to_route('home');
        // }

        $request->authenticate();
        $request->session()->regenerate();

        $user = Auth::user();

        if ($user->hasAnyPermission('view_admin_dashboard')) {
            return to_route('dashboard');
        }

        return to_route('home');
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
