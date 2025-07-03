<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleUser
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */


    public function handle(Request $request, Closure $next, string $requiredRole): Response
    {
        $user = $request->user();

        // Kalau user tidak punya role yang diminta, redirect sesuai peran sebenarnya
        if (!$user->hasRole($requiredRole)) {
            return match ($user->role) {
                'pegawai' => redirect()->route('home'),
                'admin' => redirect()->route('dashboard'),
                default => abort(403, 'Role tidak dikenali.')
            };
        }

        return $next($request);
    }
}
