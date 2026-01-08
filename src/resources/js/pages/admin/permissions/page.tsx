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
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Edit, Search, Shield, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

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
    label: string;
    permissions: string[];
    total_users: number;
}

interface User {
    id: string;
    name: string;
    email: string;
    nip: string;
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
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

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
            user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.nip.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

    //----------- PAGINATE ------------------

    const totalItems = users.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

    const paginatedItems = useMemo(() => {
        return filteredUsers.slice(startIndex, endIndex);
    }, [filteredUsers, startIndex, endIndex]);

    const handleItemsPerPageChange = (value: string) => {
        setItemsPerPage(Number(value));
        setCurrentPage(1);
    };

    const goToFirstPage = () => setCurrentPage(1);
    const goToLastPage = () => setCurrentPage(totalPages);
    const goToPreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
    const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

    // Generate page numbers to display
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
            } else {
                pages.push(1);
                pages.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            }
        }
        return pages;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs} Button={() => <ButtonPermission availablePermissions={availablePermissions} />}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-lg font-bold tracking-tight">Manajemen Hak Akses</h1>
                        <p className="text-sm text-muted-foreground">Kelola role dan permission pengguna sistem</p>
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

                        <div className="grid gap-5 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                            {filteredRoles.map((role) => (
                                <Card key={role.id} className="gap-0">
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <CardTitle className="text-lg capitalize">{role.label}</CardTitle>
                                                <p className="mt-1 text-sm text-muted-foreground">{role.description}</p>
                                            </div>
                                            <Badge variant="secondary">{role.total_users} user</Badge>
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
                                                            dan akan mempengaruhi {role.total_users} pengguna.
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
                                                className="mt-1"
                                                id="edit_role_name"
                                                value={roleFormData.name}
                                                onChange={(e) => setRoleFormData((prev) => ({ ...prev, name: e.target.value }))}
                                                placeholder="Masukkan nama role"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="edit_role_description">Deskripsi</Label>
                                            <Input
                                                className="mt-1"
                                                id="edit_role_description"
                                                value={roleFormData.description}
                                                onChange={(e) => setRoleFormData((prev) => ({ ...prev, description: e.target.value }))}
                                                placeholder="Deskripsi role"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <Label className="text-1xl">Permissions:</Label>
                                        {Object.entries(groupedPermissions).map(([category, permissions]) => (
                                            <div key={category} className="mt-1 space-y-2">
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
                                            <TableHead>NIP</TableHead>
                                            <TableHead>Role</TableHead>
                                            <TableHead>Aksi</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {paginatedItems.map((user) => (
                                            <TableRow key={user.id}>
                                                <TableCell className="font-medium">{user.name}</TableCell>
                                                <TableCell>{user.email}</TableCell>
                                                <TableCell>{user.nip}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">
                                                        {user.role.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}{' '}
                                                    </Badge>
                                                </TableCell>
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

                                {/* Pagination */}
                                {totalItems > 0 && (
                                    <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                        {/* Left: Items per page selector & info */}
                                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-muted-foreground">Tampilkan</span>
                                                <Select value={String(itemsPerPage)} onValueChange={handleItemsPerPageChange}>
                                                    <SelectTrigger className="h-8 w-[70px]">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="5">5</SelectItem>
                                                        <SelectItem value="10">10</SelectItem>
                                                        <SelectItem value="20">20</SelectItem>
                                                        <SelectItem value="50">50</SelectItem>
                                                        <SelectItem value="100">100</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <span className="text-sm text-muted-foreground">data</span>
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                Menampilkan <span className="font-medium text-foreground">{startIndex + 1}</span> -{' '}
                                                <span className="font-medium text-foreground">{endIndex}</span> dari{' '}
                                                <span className="font-medium text-foreground">{totalItems}</span> data
                                            </div>
                                        </div>

                                        {/* Right: Pagination controls */}
                                        <div className="flex items-center gap-1">
                                            {/* First Page */}
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-8 w-8 bg-transparent"
                                                onClick={goToFirstPage}
                                                disabled={currentPage === 1}
                                            >
                                                <ChevronsLeft className="h-4 w-4" />
                                                <span className="sr-only">Halaman pertama</span>
                                            </Button>

                                            {/* Previous Page */}
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-8 w-8 bg-transparent"
                                                onClick={goToPreviousPage}
                                                disabled={currentPage === 1}
                                            >
                                                <ChevronLeft className="h-4 w-4" />
                                                <span className="sr-only">Halaman sebelumnya</span>
                                            </Button>

                                            {/* Page Numbers */}
                                            <div className="flex items-center gap-1">
                                                {getPageNumbers().map((page, index) =>
                                                    page === '...' ? (
                                                        <span key={`ellipsis-${index}`} className="px-2 text-muted-foreground">
                                                            ...
                                                        </span>
                                                    ) : (
                                                        <Button
                                                            key={page}
                                                            variant={currentPage === page ? 'default' : 'outline'}
                                                            size="icon"
                                                            className="h-8 w-8"
                                                            onClick={() => setCurrentPage(page as number)}
                                                        >
                                                            {page}
                                                        </Button>
                                                    ),
                                                )}
                                            </div>

                                            {/* Next Page */}
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-8 w-8 bg-transparent"
                                                onClick={goToNextPage}
                                                disabled={currentPage === totalPages}
                                            >
                                                <ChevronRight className="h-4 w-4" />
                                                <span className="sr-only">Halaman selanjutnya</span>
                                            </Button>

                                            {/* Last Page */}
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-8 w-8 bg-transparent"
                                                onClick={goToLastPage}
                                                disabled={currentPage === totalPages}
                                            >
                                                <ChevronsRight className="h-4 w-4" />
                                                <span className="sr-only">Halaman terakhir</span>
                                            </Button>
                                        </div>
                                    </div>
                                )}
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
                                <Input className="mt-1" value={selectedUser?.name || ''} disabled />
                            </div>
                            <div className="space-y-2">
                                <Label>Email</Label>
                                <Input className="mt-1" value={selectedUser?.email || ''} disabled />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="user_role">Role</Label>
                                <Select value={selectedUserRole} onValueChange={setSelectedUserRole}>
                                    <SelectTrigger className="mt-1">
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
