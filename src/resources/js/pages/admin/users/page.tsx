'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Building, Mail, Search } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function UsersAdmin({ users }: any) {
    console.log(users);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [roleFilter, setRoleFilter] = useState('all');
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleActivateUser = async (userId: string) => {
        setIsProcessing(true);
        // Simulasi API call
        setTimeout(() => {
            console.log(`User ${userId} activated`);
            setIsProcessing(false);
            setIsDetailsOpen(false);
            // Di aplikasi nyata, ini akan update data dari server
        }, 1000);
    };

    const handleDeactivateUser = async (userId: string) => {
        setIsProcessing(true);
        // Simulasi API call
        setTimeout(() => {
            console.log(`User ${userId} deactivated`);
            setIsProcessing(false);
            setIsDetailsOpen(false);
            // Di aplikasi nyata, ini akan update data dari server
        }, 1000);
    };

    // Filter users based on search term, status, and nip
    const filteredUsers = users.data.filter((user) => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.unit_kerja.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    const handleViewDetails = (user: any) => {
        setSelectedUser(user);
        setIsDetailsOpen(true);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Manajemen Pengguna</h1>
                    <p className="text-gray-500">Kelola semua pengguna sistem Biro Umum.</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Pengguna</CardTitle>
                        <CardDescription>Semua pengguna yang terdaftar dalam sistem.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div className="flex w-full max-w-sm items-center space-x-2">
                                <Search className="h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Cari nama, email, atau divisi..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full"
                                />
                            </div>
                            <div className="flex items-center space-x-2">
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger className="w-[140px]">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Status</SelectItem>
                                        <SelectItem value="active">Aktif</SelectItem>
                                        <SelectItem value="inactive">Tidak Aktif</SelectItem>
                                        <SelectItem value="suspended">Suspended</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select value={roleFilter} onValueChange={setRoleFilter}>
                                    <SelectTrigger className="w-[140px]">
                                        <SelectValue placeholder="Role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Role</SelectItem>
                                        <SelectItem value="Manager">Manager</SelectItem>
                                        <SelectItem value="Supervisor">Supervisor</SelectItem>
                                        <SelectItem value="Staff">Staff</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Pengguna</TableHead>
                                        <TableHead className="hidden md:table-cell">Divisi</TableHead>
                                        <TableHead className="hidden lg:table-cell">Role</TableHead>
                                        <TableHead className="text-right">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredUsers.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="py-4 text-center text-gray-500">
                                                Tidak ada pengguna yang ditemukan
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredUsers.map((user) => (
                                            <TableRow key={user.id}>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-8 w-8">
                                                            <AvatarImage src={user.avatar || '/placeholder.svg'} alt={user.name} />
                                                            <AvatarFallback>
                                                                {user.name
                                                                    .split(' ')
                                                                    .map((n) => n[0])
                                                                    .join('')}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <div className="font-medium">{user.name}</div>
                                                            <div className="text-sm text-gray-500">{user.email}</div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell">{user.unit_kerja}</TableCell>
                                                <TableCell className="hidden lg:table-cell">{user.nip}</TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="sm" onClick={() => handleViewDetails(user)}>
                                                        Detail
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                {/* User Details Dialog */}
                <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                    <DialogContent className="sm:max-w-lg">
                        <DialogHeader>
                            <DialogTitle>Detail Pengguna</DialogTitle>
                            <DialogDescription>Informasi lengkap tentang pengguna.</DialogDescription>
                        </DialogHeader>
                        {selectedUser && (
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-16 w-16">
                                        <AvatarImage src={selectedUser.avatar || '/placeholder.svg'} alt={selectedUser.name} />
                                        <AvatarFallback className="text-lg">
                                            {selectedUser.name
                                                .split(' ')
                                                .map((n: string) => n[0])
                                                .join('')}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h3 className="text-lg font-medium">{selectedUser.name}</h3>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-gray-500" />
                                        <p className="text-sm">{selectedUser.email}</p>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Building className="h-4 w-4 text-gray-500" />
                                        <p className="text-sm">{selectedUser.unit_kerja}</p>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <p className="text-sm">NIP: {selectedUser.nip}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                        <DialogFooter className="flex justify-between sm:justify-between">
                            <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
                                Tutup
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
