<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        return Inertia::render('biroumum/profile/page');
    }

    public function role(Request $request, User $user)
    {
        $user->syncRoles([$request->selectedUserRole]);
    }
}
