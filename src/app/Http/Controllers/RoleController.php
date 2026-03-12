<?php

namespace App\Http\Controllers;

use App\Models\MasterPegawai;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
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
        $data = [
            [
                'name' => 'Gladys Anindya Trisvitanica Putri',
                'email' => 'gladys.atp@set.wapresri.go.id',
                'nip' => 'MagangSwp001',
                'biro' => '0239',
                'jabatan' => 'Magang',
            ],
            [
                'name' => 'Kyza Aulia',
                'email' => 'kyza.aulia@set.wapresri.go.id',
                'nip' => 'MagangSwp002',
                'biro' => '0239',
                'jabatan' => 'Magang',
            ],
        ];

        foreach ($data as $key => $value) {
            User::create([
                'nip' => $value['nip'],
                'nip_sso' => $value['nip'],
                'is_ldap' => 0,
                'email' => $value['email'],
                'password' => Hash::make($value['nip']),
            ]);

            MasterPegawai::create([
                'nip' => $value['nip'],
                'name' => $value['name'],
                'kode_unit' => '02',
                'kode_biro' => $value['biro'],
                'jabatan' => $value['jabatan'],
            ]);
        }

        die;
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
                    'nip'   => $nip,
                    'email' => $user->email ?? $user->nip_sso,
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
            'name' => Str::slug($request->name, '_'),
            'label' => $request->name,
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
