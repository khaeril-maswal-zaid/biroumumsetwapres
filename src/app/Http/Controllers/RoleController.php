<?php

namespace App\Http\Controllers;

use App\Models\MasterPegawai;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;


class RoleController extends Controller
{
    public function index()
    {
        $kodeUnit = Auth::user()?->pegawai?->kode_unit;

        $users = User::with(['roles', 'pegawai.unit'])
            ->whereHas('pegawai', fn($q) => $q->where('kode_unit', $kodeUnit))
            ->whereNot('nip', 'Developer165#')
            ->orderBy(
                MasterPegawai::select('name')
                    ->whereColumn('master_pegawais.nip', 'users.nip')
            )
            ->get()
            ->map(function ($user) {
                $nip = $user?->pegawai?->nip;

                return [
                    'id'    => (string) $user->id,
                    'name'  => $user?->pegawai?->name,
                    'nip'   => $nip ? substr($nip, 0, -4) . '****' : null,
                    'email' => $user->email ?? 'NIP SSO',
                    'role'  => $user->roles->pluck('name')->first() ?? '-',
                ];
            });

        $roles =  Role::with(['permissions'])
            ->whereNot('name', 'developer_swp')
            ->withCount('users')
            ->get()
            ->map(function ($role) {
                return [
                    'id' => $role->id,
                    'name' => $role->name,
                    'label' => $role->label,
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
            'label' => 'required|string',
            'description' => 'nullable|string',
            'permissions' => 'nullable|array',
            'permissions.*' => 'exists:permissions,name',
        ]);

        $role->label = $request->label;
        $role->description = $request->description;
        $role->save();


        // Update name & description
        $role->update([
            'name' => Str::slug($request->label, '_'),
            'description' => $request->description,
            'label' => $request->label
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
