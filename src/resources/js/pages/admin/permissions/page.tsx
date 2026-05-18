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
import { useToast } from '@/hooks/use-toast';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Edit, Search, Shield, ShieldCheck, Trash2, Users } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

// ─── Breadcrumbs ──────────────────────────────────────────────────────────────

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Pengaturan Hak Akses',
        href: '/dashboard',
    },
];

// ─── Types ────────────────────────────────────────────────────────────────────

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
    klasifikasi?: string | null;
}

// ─── Klasifikasi colour config ────────────────────────────────────────────────

const klasConfig: Record<
    string,
    {
        headerBg: string;
        borderAccent: string;
        badgeBg: string;
        badgeText: string;
        cardHeaderBg: string;
        cardHeaderBorder: string;
        checkboxCls: string;
        itemCheckedBg: string;
        itemCheckedBorder: string;
        itemCheckedText: string;
    }
> = {
    Layanan: {
        headerBg: 'bg-blue-50 dark:bg-blue-950/40',
        borderAccent: 'border-l-4 border-l-blue-500',
        badgeBg: 'bg-blue-100 dark:bg-blue-900/60',
        badgeText: 'text-blue-800 dark:text-blue-200',
        cardHeaderBg: 'bg-gradient-to-r from-blue-50 to-white dark:from-blue-950/40 dark:to-transparent',
        cardHeaderBorder: 'border-b border-blue-100 dark:border-blue-900',
        checkboxCls: 'data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600',
        itemCheckedBg: 'bg-blue-50 dark:bg-blue-950/30',
        itemCheckedBorder: 'border-blue-200 dark:border-blue-800',
        itemCheckedText: 'text-blue-800 dark:text-blue-200',
    },
    Master: {
        headerBg: 'bg-violet-50 dark:bg-violet-950/40',
        borderAccent: 'border-l-4 border-l-violet-500',
        badgeBg: 'bg-violet-100 dark:bg-violet-900/60',
        badgeText: 'text-violet-800 dark:text-violet-200',
        cardHeaderBg: 'bg-gradient-to-r from-violet-50 to-white dark:from-violet-950/40 dark:to-transparent',
        cardHeaderBorder: 'border-b border-violet-100 dark:border-violet-900',
        checkboxCls: 'data-[state=checked]:bg-violet-600 data-[state=checked]:border-violet-600',
        itemCheckedBg: 'bg-violet-50 dark:bg-violet-950/30',
        itemCheckedBorder: 'border-violet-200 dark:border-violet-800',
        itemCheckedText: 'text-violet-800 dark:text-violet-200',
    },
    Lainnya: {
        headerBg: 'bg-emerald-50 dark:bg-emerald-950/40',
        borderAccent: 'border-l-4 border-l-emerald-500',
        badgeBg: 'bg-emerald-100 dark:bg-emerald-900/60',
        badgeText: 'text-emerald-800 dark:text-emerald-200',
        cardHeaderBg: 'bg-gradient-to-r from-emerald-50 to-white dark:from-emerald-950/40 dark:to-transparent',
        cardHeaderBorder: 'border-b border-emerald-100 dark:border-emerald-900',
        checkboxCls: 'data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600',
        itemCheckedBg: 'bg-emerald-50 dark:bg-emerald-950/30',
        itemCheckedBorder: 'border-emerald-200 dark:border-emerald-800',
        itemCheckedText: 'text-emerald-800 dark:text-emerald-200',
    },
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PermissionsPage({ mockRoles, availablePermissions, mockUsers }: any) {
    const { toast } = useToast();

    const [roles, setRoles] = useState<Role[]>(mockRoles);
    const [users, setUsers] = useState<User[]>(mockUsers);
    const [searchTerm, setSearchTerm] = useState('');
    const [isEditRoleDialogOpen, setIsEditRoleDialogOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [roleFormData, setRoleFormData] = useState({
        id: '',
        label: '',
        description: '',
        permissions: [] as string[],
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [isEditUserRoleDialogOpen, setIsEditUserRoleDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [selectedUserRole, setSelectedUserRole] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setRoles(mockRoles);
        setUsers(mockUsers);
    }, [mockRoles, mockUsers]);

    // ── filtered lists ───────────────────────────────────────────────────────

    const filteredRoles = roles.filter(
        (r) => r.name.toLowerCase().includes(searchTerm.toLowerCase()) || r.description.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const filteredUsers = users.filter(
        (u) =>
            u?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.nip.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.role.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    // ── permission grouping ──────────────────────────────────────────────────

    const groupedPermissions = availablePermissions.reduce(
        (acc: any, p: Permission) => {
            if (!acc[p.category]) acc[p.category] = [];
            acc[p.category].push(p);
            return acc;
        },
        {} as Record<string, Permission[]>,
    );

    const permissionsByKlasifikasi = availablePermissions.reduce(
        (acc: any, p: Permission) => {
            const k = p.klasifikasi || 'Lainnya';
            if (!acc[k]) acc[k] = {};
            if (!acc[k][p.category]) acc[k][p.category] = [];
            acc[k][p.category].push(p);
            return acc;
        },
        {} as Record<string, Record<string, Permission[]>>,
    );

    // ── permission helpers ───────────────────────────────────────────────────

    const getPermissionLabel = (id: string) => {
        const p = availablePermissions.find((p: any) => p.name === id);
        return p ? p.label : id;
    };

    const getAllPermissionNamesInCategory = (cat: string) => (groupedPermissions[cat] || []).map((p: Permission) => p.name);

    const getAllPermissionNamesInKlasifikasi = (klas: string) =>
        Object.values(permissionsByKlasifikasi[klas] || {})
            .flat()
            .map((p: Permission) => p.name);

    const isCategoryAllSelected = (cat: string) => {
        const names = getAllPermissionNamesInCategory(cat);
        return names.length > 0 && names.every((n: string) => roleFormData.permissions.includes(n));
    };

    const toggleCategorySelectAll = (cat: string, checked: boolean) => {
        const names = getAllPermissionNamesInCategory(cat);
        setRoleFormData((prev) => {
            const next = new Set(prev.permissions);
            checked ? names.forEach((n: string) => next.add(n)) : names.forEach((n: string) => next.delete(n));
            return { ...prev, permissions: Array.from(next) };
        });
    };

    const isKlasifikasiAllSelected = (klas: string) => {
        const names = getAllPermissionNamesInKlasifikasi(klas);
        return names.length > 0 && names.every((n) => roleFormData.permissions.includes(n));
    };

    const toggleKlasifikasiSelectAll = (klas: string, checked: boolean) => {
        const names = getAllPermissionNamesInKlasifikasi(klas);
        setRoleFormData((prev) => {
            const next = new Set(prev.permissions);
            checked ? names.forEach((n: string) => next.add(n)) : names.forEach((n: string) => next.delete(n));
            return { ...prev, permissions: Array.from(next) };
        });
    };

    const handlePermissionChange = (id: string, checked: boolean) =>
        setRoleFormData((prev) => ({
            ...prev,
            permissions: checked ? [...prev.permissions, id] : prev.permissions.filter((p) => p !== id),
        }));

    // ── role handlers ────────────────────────────────────────────────────────

    const resetRoleForm = () => setRoleFormData({ id: '', label: '', description: '', permissions: [] });

    const handleEditRole = (role: Role) => {
        setSelectedRole(role);
        setRoleFormData({ id: role.id, label: role.label, description: role.description, permissions: role.permissions });
        setIsEditRoleDialogOpen(true);
    };

    const handleUpdateRole = () => {
        setIsSubmitting(true);
        if (!selectedRole) return;
        if (!roleFormData.label || !roleFormData.description) {
            alert('Mohon lengkapi nama role dan deskripsi');
            setIsSubmitting(false);
            return;
        }
        if (roleFormData.permissions.length === 0) {
            alert('Mohon pilih minimal satu permission');
            setIsSubmitting(false);
            return;
        }
        router.put(route('roles.update', roleFormData.id), roleFormData, {
            onSuccess: () => {
                setIsEditRoleDialogOpen(false);
                setSelectedRole(null);
                resetRoleForm();
                toast({
                    title: 'Berhasil',
                    description: `Hak akses role ${roleFormData.label} berhasil diperbarui`,
                });
                setIsSubmitting(false);
            },
            onError: (er) => toast({ title: 'Validasi gagal', description: Object.values(er)[0], variant: 'destructive' }),
        });
    };

    const handleDeleteRole = (id: string) => {
        router.delete(route('roles.destroy', id), {
            onSuccess: () => {
                setIsEditRoleDialogOpen(false);
                setSelectedRole(null);
                resetRoleForm();
                toast({ title: 'Terhapus', description: 'Role berhasil dihapus' });
            },
            onError: (er) => toast({ title: 'Validasi gagal', description: Object.values(er)[0], variant: 'destructive' }),
        });
    };

    // ── user role handlers ───────────────────────────────────────────────────

    const handleEditUserRole = (user: User) => {
        setSelectedUser(user);
        setSelectedUserRole(user.role);
        setIsEditUserRoleDialogOpen(true);
    };

    const handleUpdateUserRole = () => {
        setIsSubmitting(true);
        if (!selectedUser) return;
        router.patch(
            route('users.role', selectedUser.id),
            { selectedUserRole },
            {
                onSuccess: () => {
                    setIsEditUserRoleDialogOpen(false);
                    setSelectedUser(null);
                    setSelectedUserRole('');
                    toast({ title: 'Berhasil', description: 'Berhasil melakukan edit role user' });
                    setIsSubmitting(false);
                },
                onError: (er) => toast({ title: 'Validasi gagal', description: Object.values(er)[0], variant: 'destructive' }),
            },
        );
    };

    // ── pagination ───────────────────────────────────────────────────────────

    const totalItems = users.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

    const paginatedItems = useMemo(() => filteredUsers.slice(startIndex, endIndex), [filteredUsers, startIndex, endIndex]);

    const handleItemsPerPageChange = (value: string) => {
        setItemsPerPage(Number(value));
        setCurrentPage(1);
    };
    const goToFirstPage = () => setCurrentPage(1);
    const goToLastPage = () => setCurrentPage(totalPages);
    const goToPreviousPage = () => setCurrentPage((p) => Math.max(p - 1, 1));
    const goToNextPage = () => setCurrentPage((p) => Math.min(p + 1, totalPages));

    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else if (currentPage <= 3) {
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
        return pages;
    };

    // ── render ───────────────────────────────────────────────────────────────

    return (
        <AppLayout breadcrumbs={breadcrumbs} Button={() => <ButtonPermission availablePermissions={availablePermissions} />}>
            <Head title="Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* ── Page heading ── */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/50">
                            <ShieldCheck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">Manajemen Hak Akses</h1>
                            <p className="text-sm text-muted-foreground">Kelola role dan permission pengguna sistem</p>
                        </div>
                    </div>
                </div>

                {/* ── Tabs ── */}
                <Tabs defaultValue="roles" className="space-y-6">
                    <TabsList className="bg-slate-100 dark:bg-slate-800">
                        <TabsTrigger
                            value="roles"
                            className="data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-blue-400"
                        >
                            <ShieldCheck className="mr-1.5 h-4 w-4" />
                            Role &amp; Permission
                        </TabsTrigger>
                        <TabsTrigger
                            value="users"
                            className="data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-blue-400"
                        >
                            <Users className="mr-1.5 h-4 w-4" />
                            Assignment User
                        </TabsTrigger>
                    </TabsList>

                    {/* ════════════════════════════════════════════════════════
                        TAB: Role & Permission
                    ════════════════════════════════════════════════════════ */}
                    <TabsContent value="roles" className="space-y-6">
                        {/* Search */}
                        <div className="flex items-center justify-between">
                            <div className="relative max-w-sm flex-1">
                                <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Cari role..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-9 focus-visible:ring-blue-500"
                                />
                            </div>
                        </div>

                        {/* Role cards grid */}
                        <div className="grid gap-5 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                            {filteredRoles.map((role) => (
                                <Card
                                    key={role.id}
                                    className="gap-0 overflow-hidden border-slate-200 pt-0 shadow-none transition-shadow hover:shadow-md dark:border-slate-700"
                                >
                                    {/* Card top accent bar */}
                                    <div className="h-1 w-full bg-linear-to-r from-blue-500 to-violet-500" />

                                    <CardHeader className="pt-5 pb-3">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-2.5">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/50">
                                                    <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                                </div>
                                                <div>
                                                    <CardTitle className="text-base text-slate-900 capitalize dark:text-slate-100">
                                                        {role.label}
                                                    </CardTitle>
                                                    <p className="mt-0.5 text-xs text-muted-foreground">{role.description}</p>
                                                </div>
                                            </div>
                                            <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100 dark:bg-slate-700 dark:text-slate-300">
                                                {role.total_users} user
                                            </Badge>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
                                                Permissions ({role.permissions.length})
                                            </p>
                                            <div className="flex flex-wrap gap-1.5">
                                                {role.permissions.slice(0, 6).map((perm) => (
                                                    <Badge
                                                        key={perm}
                                                        variant="outline"
                                                        className="border-blue-200 bg-blue-50 text-xs text-blue-700 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-300"
                                                    >
                                                        {getPermissionLabel(perm)}
                                                    </Badge>
                                                ))}
                                                {role.permissions.length > 6 && (
                                                    <Badge
                                                        variant="outline"
                                                        className="border-slate-200 bg-slate-50 text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400"
                                                    >
                                                        +{role.permissions.length - 6} lainnya
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex gap-2 pt-1">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleEditRole(role)}
                                                className="flex-1 border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-950/30 dark:text-blue-300 dark:hover:bg-blue-900/40"
                                            >
                                                <Edit className="mr-1.5 h-3.5 w-3.5" />
                                                Edit
                                            </Button>

                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="border-red-200 bg-red-50 text-red-600 hover:bg-red-100 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-900/40"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent className="border-slate-200 dark:border-slate-700">
                                                    <AlertDialogHeader>
                                                        <div className="flex items-center gap-2.5">
                                                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-100 dark:bg-red-950/50">
                                                                <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
                                                            </div>
                                                            <AlertDialogTitle className="text-slate-900 dark:text-slate-100">
                                                                Hapus Role
                                                            </AlertDialogTitle>
                                                        </div>
                                                        <AlertDialogDescription className="text-slate-500 dark:text-slate-400">
                                                            Yakin hapus role{' '}
                                                            <span className="font-semibold text-slate-700 dark:text-slate-300">"{role.name}"</span>?
                                                            Tindakan ini mempengaruhi{' '}
                                                            <span className="font-semibold text-red-600">{role.total_users} pengguna</span> dan tidak
                                                            dapat dibatalkan.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel className="border-slate-200 hover:bg-slate-50 dark:border-slate-700">
                                                            Batal
                                                        </AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() => handleDeleteRole(role.id)}
                                                            className="bg-red-600 text-white hover:bg-red-700"
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

                        {/* ── Edit Role Dialog ── */}
                        <Dialog open={isEditRoleDialogOpen} onOpenChange={setIsEditRoleDialogOpen}>
                            <DialogContent className="max-h-[90vh] min-w-[72rem] overflow-y-auto p-0">
                                {/* Sticky header */}
                                <DialogHeader className="sticky top-0 z-10 flex flex-row items-center gap-3 border-b bg-white px-6 py-4 dark:border-slate-700 dark:bg-slate-900">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/50">
                                        <ShieldCheck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <DialogTitle className="text-base font-semibold text-slate-900 dark:text-slate-100">Edit Role</DialogTitle>
                                        {roleFormData.permissions.length > 0 && (
                                            <p className="text-xs text-slate-500">{roleFormData.permissions.length} permission dipilih</p>
                                        )}
                                    </div>
                                </DialogHeader>

                                {/* Body */}
                                <div className="flex flex-col gap-6 px-6 py-5">
                                    {/* Form inputs */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <Label htmlFor="edit_role_name" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                Nama Role
                                            </Label>
                                            <Input
                                                id="edit_role_name"
                                                value={roleFormData.label}
                                                onChange={(e) => setRoleFormData((prev) => ({ ...prev, label: e.target.value }))}
                                                placeholder="Masukkan nama role"
                                                className="h-9 border-slate-200 bg-white text-sm placeholder:text-slate-400 focus-visible:ring-blue-500 dark:border-slate-700 dark:bg-slate-800"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label htmlFor="edit_role_description" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                Deskripsi
                                            </Label>
                                            <Input
                                                id="edit_role_description"
                                                value={roleFormData.description}
                                                onChange={(e) => setRoleFormData((prev) => ({ ...prev, description: e.target.value }))}
                                                placeholder="Deskripsi role"
                                                className="h-9 border-slate-200 bg-white text-sm placeholder:text-slate-400 focus-visible:ring-blue-500 dark:border-slate-700 dark:bg-slate-800"
                                            />
                                        </div>
                                    </div>

                                    {/* Klasifikasi sections */}
                                    <div className="flex flex-col gap-5">
                                        {(['Layanan', 'Master', 'Lainnya'] as const).map((klas) => {
                                            const klasGroup = permissionsByKlasifikasi[klas];
                                            if (!klasGroup) return null;
                                            const cfg = klasConfig[klas];
                                            const totalPerms = Object.values(klasGroup).flat().length;
                                            const allSelected = isKlasifikasiAllSelected(klas);

                                            return (
                                                <div key={klas} className="flex flex-col gap-3">
                                                    {/* Klasifikasi header bar */}
                                                    <div
                                                        className={cn(
                                                            'flex items-center justify-between rounded-lg px-4 py-2.5',
                                                            cfg.headerBg,
                                                            cfg.borderAccent,
                                                        )}
                                                    >
                                                        <div className="flex items-center gap-2.5">
                                                            <span
                                                                className={cn(
                                                                    'rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide',
                                                                    cfg.badgeBg,
                                                                    cfg.badgeText,
                                                                )}
                                                            >
                                                                {klas}
                                                            </span>
                                                            <span className="text-xs text-slate-500 dark:text-slate-400">
                                                                {totalPerms} permission total
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Label
                                                                htmlFor={`select_all_klas_${klas}`}
                                                                className="cursor-pointer text-xs text-slate-600 dark:text-slate-400"
                                                            >
                                                                Pilih semua
                                                            </Label>
                                                            <Checkbox
                                                                id={`select_all_klas_${klas}`}
                                                                checked={allSelected}
                                                                onCheckedChange={(checked) => toggleKlasifikasiSelectAll(klas, checked as boolean)}
                                                                className={cn(
                                                                    'h-4 w-4 rounded border-slate-300 dark:border-slate-600',
                                                                    cfg.checkboxCls,
                                                                )}
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Permission cards grid */}
                                                    <div className="grid gap-3 md:grid-cols-3">
                                                        {Object.entries(klasGroup).map(([category, perms]) => {
                                                            const catAll = isCategoryAllSelected(category);
                                                            return (
                                                                <Card
                                                                    key={category}
                                                                    className="overflow-hidden border-slate-200 p-0 shadow-none transition-shadow hover:shadow-sm dark:border-slate-700"
                                                                >
                                                                    {/* Card header */}
                                                                    <CardHeader
                                                                        className={cn(
                                                                            'flex flex-row items-center justify-between px-4 py-2.5',
                                                                            cfg.cardHeaderBg,
                                                                            cfg.cardHeaderBorder,
                                                                        )}
                                                                    >
                                                                        <div>
                                                                            <CardTitle className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                                                                                {category}
                                                                            </CardTitle>
                                                                            <p className="text-[11px] text-slate-400 dark:text-slate-500">
                                                                                {perms.length} permission
                                                                            </p>
                                                                        </div>
                                                                        <div className="flex items-center gap-1.5">
                                                                            <Label
                                                                                htmlFor={`select_all_cat_${category}`}
                                                                                className="cursor-pointer text-[11px] text-slate-500 dark:text-slate-400"
                                                                            >
                                                                                All
                                                                            </Label>
                                                                            <Checkbox
                                                                                id={`select_all_cat_${category}`}
                                                                                checked={catAll}
                                                                                onCheckedChange={(checked) =>
                                                                                    toggleCategorySelectAll(category, checked as boolean)
                                                                                }
                                                                                className={cn(
                                                                                    'h-3.5 w-3.5 rounded border-slate-300 dark:border-slate-600',
                                                                                    cfg.checkboxCls,
                                                                                )}
                                                                            />
                                                                        </div>
                                                                    </CardHeader>

                                                                    {/* Permission items */}
                                                                    <CardContent className="grid grid-cols-2 gap-1.5 px-4 pt-3 pb-4">
                                                                        {perms.map((permission: Permission) => {
                                                                            const isChecked = roleFormData.permissions.includes(permission.name);
                                                                            return (
                                                                                <Label
                                                                                    key={permission.name}
                                                                                    htmlFor={`edit_${permission.name}`}
                                                                                    className={cn(
                                                                                        'flex cursor-pointer items-center gap-2 rounded-md border px-2.5 py-1.5 text-[11px] font-medium transition-all select-none',
                                                                                        isChecked
                                                                                            ? cn(
                                                                                                  cfg.itemCheckedBg,
                                                                                                  cfg.itemCheckedBorder,
                                                                                                  cfg.itemCheckedText,
                                                                                              )
                                                                                            : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:bg-white dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-400 dark:hover:bg-slate-800',
                                                                                    )}
                                                                                >
                                                                                    <Checkbox
                                                                                        id={`edit_${permission.name}`}
                                                                                        checked={isChecked}
                                                                                        onCheckedChange={(checked) =>
                                                                                            handlePermissionChange(
                                                                                                permission.name,
                                                                                                checked as boolean,
                                                                                            )
                                                                                        }
                                                                                        className={cn(
                                                                                            'h-3.5 w-3.5 rounded border-slate-300 dark:border-slate-600',
                                                                                            cfg.checkboxCls,
                                                                                        )}
                                                                                    />
                                                                                    <span>{permission.label}</span>
                                                                                </Label>
                                                                            );
                                                                        })}
                                                                    </CardContent>
                                                                </Card>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Sticky footer */}
                                <DialogFooter className="sticky bottom-0 z-10 border-t bg-white px-6 py-4 dark:border-slate-700 dark:bg-slate-900">
                                    <Button
                                        variant="outline"
                                        onClick={() => setIsEditRoleDialogOpen(false)}
                                        className="border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                                    >
                                        Batal
                                    </Button>
                                    <Button
                                        onClick={handleUpdateRole}
                                        disabled={
                                            !roleFormData.label || !roleFormData.description || roleFormData.permissions.length === 0 || isSubmitting
                                        }
                                        className="bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40"
                                    >
                                        {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </TabsContent>

                    {/* ════════════════════════════════════════════════════════
                        TAB: Assignment User
                    ════════════════════════════════════════════════════════ */}
                    <TabsContent value="users" className="space-y-6">
                        {/* Search */}
                        <div className="flex items-center space-x-2">
                            <div className="relative max-w-sm flex-1">
                                <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Cari pengguna..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-9 focus-visible:ring-blue-500"
                                />
                            </div>
                        </div>

                        <Card className="border-slate-200 shadow-none dark:border-slate-700">
                            <CardHeader className="border-b border-slate-100 bg-slate-50/60 px-6 py-4 dark:border-slate-700 dark:bg-slate-800/40">
                                <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4 text-slate-500" />
                                    <CardTitle className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                                        Assignment Role ke Pengguna
                                    </CardTitle>
                                </div>
                            </CardHeader>

                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-slate-100 bg-slate-50/40 hover:bg-slate-50/40 dark:border-slate-700 dark:bg-slate-800/20">
                                            <TableHead className="text-xs font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">
                                                No
                                            </TableHead>
                                            <TableHead className="text-xs font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">
                                                Nama
                                            </TableHead>
                                            <TableHead className="text-xs font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">
                                                Username
                                            </TableHead>
                                            <TableHead className="text-xs font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">
                                                NIP
                                            </TableHead>
                                            <TableHead className="text-xs font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">
                                                Role
                                            </TableHead>
                                            <TableHead className="text-xs font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">
                                                Aksi
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {paginatedItems.map((user, index) => (
                                            <TableRow
                                                key={user.id}
                                                className="border-slate-100 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800/40"
                                            >
                                                <TableCell>{index + paginatedItems.indexOf(user) + 1}</TableCell>
                                                <TableCell className="font-medium text-slate-900 dark:text-slate-100">{user.name}</TableCell>
                                                <TableCell className="text-slate-600 dark:text-slate-400">{user.email}</TableCell>
                                                <TableCell className="font-mono text-sm text-slate-600 dark:text-slate-400">{user.nip}</TableCell>
                                                <TableCell>
                                                    <Badge className="border-violet-200 bg-violet-50 text-violet-700 hover:bg-violet-50 dark:border-violet-800 dark:bg-violet-950/40 dark:text-violet-300">
                                                        {user.role.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleEditUserRole(user)}
                                                        className="border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-950/30 dark:text-blue-300"
                                                    >
                                                        <Edit className="mr-1.5 h-3.5 w-3.5" />
                                                        Edit Role
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>

                                {/* Pagination */}
                                {totalItems > 0 && (
                                    <div className="flex flex-col gap-4 border-t border-slate-100 px-6 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-700">
                                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-muted-foreground">Tampilkan</span>
                                                <Select value={String(itemsPerPage)} onValueChange={handleItemsPerPageChange}>
                                                    <SelectTrigger className="h-8 w-[70px] border-slate-200 focus:ring-blue-500 dark:border-slate-700">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {['5', '10', '20', '50', '100'].map((v) => (
                                                            <SelectItem key={v} value={v}>
                                                                {v}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <span className="text-sm text-muted-foreground">data</span>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                Menampilkan <span className="font-medium text-foreground">{startIndex + 1}</span>–
                                                <span className="font-medium text-foreground">{endIndex}</span> dari{' '}
                                                <span className="font-medium text-foreground">{totalItems}</span> data
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-1">
                                            {[
                                                {
                                                    icon: <ChevronsLeft className="h-4 w-4" />,
                                                    onClick: goToFirstPage,
                                                    disabled: currentPage === 1,
                                                    label: 'Halaman pertama',
                                                },
                                                {
                                                    icon: <ChevronLeft className="h-4 w-4" />,
                                                    onClick: goToPreviousPage,
                                                    disabled: currentPage === 1,
                                                    label: 'Halaman sebelumnya',
                                                },
                                            ].map(({ icon, onClick, disabled, label }) => (
                                                <Button
                                                    key={label}
                                                    variant="outline"
                                                    size="icon"
                                                    className="h-8 w-8 border-slate-200 bg-transparent hover:bg-slate-100 disabled:opacity-40 dark:border-slate-700 dark:hover:bg-slate-800"
                                                    onClick={onClick}
                                                    disabled={disabled}
                                                >
                                                    {icon}
                                                    <span className="sr-only">{label}</span>
                                                </Button>
                                            ))}

                                            <div className="flex items-center gap-1">
                                                {getPageNumbers().map((page, i) =>
                                                    page === '...' ? (
                                                        <span key={`e-${i}`} className="px-1 text-sm text-muted-foreground">
                                                            …
                                                        </span>
                                                    ) : (
                                                        <Button
                                                            key={page}
                                                            variant={currentPage === page ? 'default' : 'outline'}
                                                            size="icon"
                                                            className={cn(
                                                                'h-8 w-8 text-sm',
                                                                currentPage === page
                                                                    ? 'border-blue-600 bg-blue-600 text-white hover:bg-blue-700'
                                                                    : 'border-slate-200 bg-transparent hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800',
                                                            )}
                                                            onClick={() => setCurrentPage(page as number)}
                                                        >
                                                            {page}
                                                        </Button>
                                                    ),
                                                )}
                                            </div>

                                            {[
                                                {
                                                    icon: <ChevronRight className="h-4 w-4" />,
                                                    onClick: goToNextPage,
                                                    disabled: currentPage === totalPages,
                                                    label: 'Halaman selanjutnya',
                                                },
                                                {
                                                    icon: <ChevronsRight className="h-4 w-4" />,
                                                    onClick: goToLastPage,
                                                    disabled: currentPage === totalPages,
                                                    label: 'Halaman terakhir',
                                                },
                                            ].map(({ icon, onClick, disabled, label }) => (
                                                <Button
                                                    key={label}
                                                    variant="outline"
                                                    size="icon"
                                                    className="h-8 w-8 border-slate-200 bg-transparent hover:bg-slate-100 disabled:opacity-40 dark:border-slate-700 dark:hover:bg-slate-800"
                                                    onClick={onClick}
                                                    disabled={disabled}
                                                >
                                                    {icon}
                                                    <span className="sr-only">{label}</span>
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                {/* Empty state */}
                {filteredRoles.length === 0 && (
                    <div className="flex flex-col items-center py-16 text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
                            <Shield className="h-8 w-8 text-slate-400" />
                        </div>
                        <h3 className="mt-4 text-sm font-semibold text-slate-900 dark:text-slate-100">Tidak ada role</h3>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            {searchTerm ? 'Tidak ada role yang sesuai dengan pencarian.' : 'Mulai dengan menambahkan role baru.'}
                        </p>
                    </div>
                )}

                {/* ── Edit User Role Dialog ── */}
                <Dialog open={isEditUserRoleDialogOpen} onOpenChange={setIsEditUserRoleDialogOpen}>
                    <DialogContent className="border-slate-200 dark:border-slate-700">
                        <DialogHeader className="border-b border-slate-100 pb-4 dark:border-slate-700">
                            <div className="flex items-center gap-2.5">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 dark:bg-violet-950/50">
                                    <Users className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                                </div>
                                <DialogTitle className="text-base font-semibold text-slate-900 dark:text-slate-100">Edit Role Pengguna</DialogTitle>
                            </div>
                        </DialogHeader>

                        <div className="grid gap-4 py-4">
                            <div className="space-y-1.5">
                                <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">Pengguna</Label>
                                <Input
                                    value={selectedUser?.name || ''}
                                    disabled
                                    className="h-9 border-slate-200 bg-slate-50 text-sm dark:border-slate-700 dark:bg-slate-800"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</Label>
                                <Input
                                    value={selectedUser?.email || ''}
                                    disabled
                                    className="h-9 border-slate-200 bg-slate-50 text-sm dark:border-slate-700 dark:bg-slate-800"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="user_role" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Role
                                </Label>
                                <Select value={selectedUserRole} onValueChange={setSelectedUserRole}>
                                    <SelectTrigger className="h-9 border-slate-200 focus:ring-violet-500 dark:border-slate-700">
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

                        <DialogFooter className="border-t border-slate-100 pt-4 dark:border-slate-700">
                            <Button
                                variant="outline"
                                onClick={() => setIsEditUserRoleDialogOpen(false)}
                                className="border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
                            >
                                Batal
                            </Button>
                            <Button
                                onClick={handleUpdateUserRole}
                                disabled={!selectedUserRole || isSubmitting}
                                className="bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-40"
                            >
                                {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
