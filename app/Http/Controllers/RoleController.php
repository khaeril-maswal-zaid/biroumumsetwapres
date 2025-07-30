<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;


class RoleController extends Controller
{
    public function index()
    {
        $users = User::with('roles')->get()->map(function ($user) {
            return [
                'id' => (string) $user->id,
                'name' => $user->name,
                'nip' => $user->nip,
                'email' => $user->email,
                'role' => $user->roles->pluck('name')->first() ?? '-',
                'status' => $user->status ?? 'aktif',
                'last_login' => $user->last_login,
            ];
        });

        $roles =  Role::with(['permissions'])
            ->withCount('users')
            ->get()
            ->map(function ($role) {
                return [
                    'id' => $role->id,
                    'name' => $role->name,
                    'description' => $role->description,
                    'total_users' => $role->users_count,
                    'permissions' => $role->permissions->pluck('name')->toArray(),
                ];
            });

        return Inertia::render('admin/permissions/page', [
            'mockRoles' => $roles,
            'availablePermissions' => Permission::select(['name', 'label', 'category'])->get(),
            'mockUsers' => $users,
        ]);
    }

    public function create()
    {
        return Inertia::render('admin.roles.create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|unique:roles,name',
            'description' => 'nullable|string',
            'permissions' => 'nullable|array',
        ]);

        // Buat role beserta description
        $role = Role::create([
            'name' => $request->name,
            'description' => $request->description,
        ]);

        // Jika ada permission, hubungkan ke role
        if ($request->has('permissions')) {
            $role->syncPermissions($request->permissions);
        }
    }

    public function update(Request $request, Role $role)
    {
        $request->validate([
            'name' => 'required|string',
            'description' => 'nullable|string',
            'permissions' => 'nullable|array',
            'permissions.*' => 'exists:permissions,name',
        ]);

        $role->name = $request->name;
        $role->description = $request->description;
        $role->save();


        // Update name & description
        $role->update([
            'name' => $request->name,
            'description' => $request->description,
        ]);

        // Update permissions
        if ($request->has('permissions')) {
            $role->syncPermissions($request->permissions);
        }
    }

    public function destroy(Role $role)
    {
        $role->delete();
    }
}
