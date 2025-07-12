'use client';
import ButtonPermission from '@/components/buttonnavbar/button-permissons';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Edit, Search, Shield, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface Role {
    id: string;
    name: string;
    description: string;
    permissions: string[];
    user_count: number;
}

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    status: 'aktif' | 'nonaktif';
    last_login: string;
}

interface Permission {
    name: string;
    label: string;
    category: string;
}

export default function PermissionsPage({ mockRoles, availablePermissions, mockUsers }: any) {
    const [roles, setRoles] = useState<Role[]>(mockRoles);
    const [users, setUsers] = useState<User[]>(mockUsers);
    const [searchTerm, setSearchTerm] = useState('');
    const [isEditRoleDialogOpen, setIsEditRoleDialogOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [roleFormData, setRoleFormData] = useState({
        id: '',
        name: '',
        description: '',
        permissions: [] as string[],
    });

    useEffect(() => {
        setRoles(mockRoles);
        setUsers(mockUsers);
    }, [mockRoles, mockUsers]);

    const [isEditUserRoleDialogOpen, setIsEditUserRoleDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [selectedUserRole, setSelectedUserRole] = useState('');

    const filteredRoles = roles.filter(
        (role) => role.name.toLowerCase().includes(searchTerm.toLowerCase()) || role.description.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const filteredUsers = users.filter(
        (user) =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.role.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const resetRoleForm = () => {
        setRoleFormData({
            id: '',
            name: '',
            description: '',
            permissions: [],
        });
    };

    const handleEditRole = (role: Role) => {
        setSelectedRole(role);
        setRoleFormData({
            id: role.id,
            name: role.name,
            description: role.description,
            permissions: role.permissions,
        });
        setIsEditRoleDialogOpen(true);
    };

    const handleUpdateRole = () => {
        if (!selectedRole) return;

        // Validate required fields
        if (!roleFormData.name || !roleFormData.description) {
            alert('Mohon lengkapi nama role dan deskripsi');
            return;
        }

        if (roleFormData.permissions.length === 0) {
            alert('Mohon pilih minimal satu permission');
            return;
        }

        router.put(route('roles.update', roleFormData.id), roleFormData, {
            onSuccess: () => {
                setIsEditRoleDialogOpen(false);
                setSelectedRole(null);
                resetRoleForm();
            },
            onError: (errors) => {
                console.log('Validation Errors: ', errors);
            },
        });
    };

    const handleDeleteRole = (id: string) => {
        router.delete(route('roles.destroy', id), {
            onSuccess: () => {
                setIsEditRoleDialogOpen(false);
                setSelectedRole(null);
                resetRoleForm();
            },
            onError: (errors) => {
                console.log('Validation Errors: ', errors);
            },
        });
    };

    const handlePermissionChange = (permissionId: string, checked: boolean) => {
        if (checked) {
            setRoleFormData((prev) => ({
                ...prev,
                permissions: [...prev.permissions, permissionId],
            }));
        } else {
            setRoleFormData((prev) => ({
                ...prev,
                permissions: prev.permissions.filter((p) => p !== permissionId),
            }));
        }
    };

    const getPermissionLabel = (permissionId: string) => {
        const permission = availablePermissions.find((p: any) => p.name === permissionId);
        return permission ? permission.label : permissionId;
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'aktif':
                return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Aktif</Badge>;
            case 'nonaktif':
                return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Non-aktif</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    const groupedPermissions = availablePermissions.reduce(
        (acc: any, permission: Permission) => {
            if (!acc[permission.category]) {
                acc[permission.category] = [];
            }
            acc[permission.category].push(permission);
            return acc;
        },
        {} as Record<string, typeof availablePermissions>,
    );

    const handleEditUserRole = (user: User) => {
        setSelectedUser(user);
        setSelectedUserRole(user.role);
        setIsEditUserRoleDialogOpen(true);
    };

    const handleUpdateUserRole = () => {
        if (!selectedUser) return;
        router.patch(
            route('users.role', selectedUser.id),
            { selectedUserRole },
            {
                onSuccess: () => {
                    setIsEditUserRoleDialogOpen(false);
                    setSelectedUser(null);
                    setSelectedUserRole('');
                },
                onError: (e) => {
                    console.log(e);
                },
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs} Button={() => <ButtonPermission availablePermissions={availablePermissions} />}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Manajemen Hak Akses</h1>
                        <p className="text-muted-foreground">Kelola role dan permission pengguna sistem</p>
                    </div>
                </div>

                <Tabs defaultValue="roles" className="space-y-6">
                    <TabsList>
                        <TabsTrigger value="roles">Role & Permission</TabsTrigger>
                        <TabsTrigger value="users">Assignment User</TabsTrigger>
                    </TabsList>

                    <TabsContent value="roles" className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <div className="relative max-w-sm flex-1">
                                    <Search className="absolute top-2.5 left-2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Cari role..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-8"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                            {filteredRoles.map((role) => (
                                <Card key={role.id}>
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <CardTitle className="text-lg capitalize">{role.name}</CardTitle>
                                                <p className="mt-1 text-sm text-muted-foreground">{role.description}</p>
                                            </div>
                                            <Badge variant="secondary">{role.user_count} user</Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <p className="text-sm font-medium">Permissions ({role.permissions.length}):</p>
                                            <div className="flex flex-wrap gap-1 overflow-y-auto">
                                                {role.permissions.slice(0, 6).map((permission) => (
                                                    <Badge key={permission} variant="outline" className="text-xs">
                                                        {getPermissionLabel(permission)}
                                                    </Badge>
                                                ))}
                                                {role.permissions.length > 6 && (
                                                    <Badge variant="outline" className="text-xs">
                                                        +{role.permissions.length - 6} lainnya
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex gap-2 pt-2">
                                            <Button variant="outline" size="sm" onClick={() => handleEditRole(role)} className="flex-1">
                                                <Edit className="mr-1 h-4 w-4" />
                                                Edit
                                            </Button>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="outline" size="sm" className="bg-transparent text-red-600 hover:text-red-700">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Hapus Role</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Apakah Anda yakin ingin menghapus role "{role.name}"? Tindakan ini tidak dapat dibatalkan
                                                            dan akan mempengaruhi {role.user_count} pengguna.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Batal</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() => handleDeleteRole(role.id)}
                                                            className="bg-red-600 hover:bg-red-700"
                                                        >
                                                            Hapus
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Edit Role Dialog */}
                        <Dialog open={isEditRoleDialogOpen} onOpenChange={setIsEditRoleDialogOpen}>
                            <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
                                <DialogHeader>
                                    <DialogTitle>Edit Role</DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="edit_role_name">Nama Role</Label>
                                            <Input
                                                id="edit_role_name"
                                                value={roleFormData.name}
                                                onChange={(e) => setRoleFormData((prev) => ({ ...prev, name: e.target.value }))}
                                                placeholder="Masukkan nama role"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="edit_role_description">Deskripsi</Label>
                                            <Input
                                                id="edit_role_description"
                                                value={roleFormData.description}
                                                onChange={(e) => setRoleFormData((prev) => ({ ...prev, description: e.target.value }))}
                                                placeholder="Deskripsi role"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <Label>Permissions</Label>
                                        {Object.entries(groupedPermissions).map(([category, permissions]) => (
                                            <div key={category} className="space-y-2">
                                                <h4 className="text-sm font-medium text-gray-700">{category}</h4>
                                                <div className="grid grid-cols-2 gap-2 pl-4">
                                                    {permissions.map((permission: Permission) => (
                                                        <div key={permission.name} className="flex items-center space-x-2">
                                                            <Checkbox
                                                                id={`edit_${permission.name}`}
                                                                checked={roleFormData.permissions.includes(permission.name)}
                                                                onCheckedChange={(checked) =>
                                                                    handlePermissionChange(permission.name, checked as boolean)
                                                                }
                                                            />
                                                            <Label htmlFor={`edit_${permission.name}`} className="text-sm">
                                                                {permission.label}
                                                            </Label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsEditRoleDialogOpen(false)}>
                                        Batal
                                    </Button>
                                    <Button
                                        onClick={handleUpdateRole}
                                        disabled={!roleFormData.name || !roleFormData.description || roleFormData.permissions.length === 0}
                                    >
                                        Simpan Perubahan
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </TabsContent>

                    <TabsContent value="users" className="space-y-6">
                        <div className="flex items-center space-x-2">
                            <div className="relative max-w-sm flex-1">
                                <Search className="absolute top-2.5 left-2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Cari pengguna..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-8"
                                />
                            </div>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle>Assignment Role ke Pengguna</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Nama</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Role</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Last Login</TableHead>
                                            <TableHead>Aksi</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredUsers.map((user) => (
                                            <TableRow key={user.id}>
                                                <TableCell className="font-medium">{user.name}</TableCell>
                                                <TableCell>{user.email}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">{user.role}</Badge>
                                                </TableCell>
                                                <TableCell>{getStatusBadge(user.status)}</TableCell>
                                                <TableCell className="text-sm text-muted-foreground">{user.last_login}</TableCell>
                                                <TableCell>
                                                    <Button variant="outline" size="sm" onClick={() => handleEditUserRole(user)}>
                                                        <Edit className="mr-1 h-4 w-4" />
                                                        Edit Role
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                {filteredRoles.length === 0 && (
                    <div className="py-12 text-center">
                        <Shield className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-semibold text-gray-900">Tidak ada role</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            {searchTerm ? 'Tidak ada role yang sesuai dengan pencarian.' : 'Mulai dengan menambahkan role baru.'}
                        </p>
                    </div>
                )}

                {/* Edit User Role Dialog */}
                <Dialog open={isEditUserRoleDialogOpen} onOpenChange={setIsEditUserRoleDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Role Pengguna</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <Label>Pengguna</Label>
                                <Input value={selectedUser?.name || ''} disabled />
                            </div>
                            <div className="space-y-2">
                                <Label>Email</Label>
                                <Input value={selectedUser?.email || ''} disabled />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="user_role">Role</Label>
                                <Select value={selectedUserRole} onValueChange={setSelectedUserRole}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {roles.map((role) => (
                                            <SelectItem key={role.id} value={role.name}>
                                                {role.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsEditUserRoleDialogOpen(false)}>
                                Batal
                            </Button>
                            <Button onClick={handleUpdateUserRole} disabled={!selectedUserRole}>
                                Simpan Perubahan
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
