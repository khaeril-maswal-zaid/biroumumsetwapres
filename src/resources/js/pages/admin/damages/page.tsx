'use client';

import { StatusBadge } from '@/components/badges/StatusBadge';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import AppLayout from '@/layouts/app-layout';
import { SharedData, type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Eye, ImageIcon, Search, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function DamagesAdmin({ kerusakan }: any) {
    const { toast } = useToast();
    const { auth } = usePage<SharedData>().props;

    useEffect(() => {
        const interval = setInterval(() => {
            router.reload({
                only: ['kerusakan'],
            });
        }, 60 * 1000); // 60 detik

        return () => clearInterval(interval);
    }, []);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    // Filter damages based on search term and status
    const filteredDamages = kerusakan.data.filter((damage: any) => {
        const matchesSearch =
            damage?.pelapor?.pegawai?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            damage.lokasi.toLowerCase().includes(searchTerm.toLowerCase()) ||
            damage.kode_pelaporan.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || damage.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const handleDelete = (kodePelaporan: string) => {
        router.delete(route('kerusakangedung.destroy', kodePelaporan), {
            onSuccess: () => {
                setDeleteConfirm(null);
                toast({ title: 'Berhasil', description: 'Laporan kerusakan berhasil dihapus.' });
            },
            onError: (errors) => {
                toast({ title: 'Gagal', description: Object.values(errors)[0], variant: 'destructive' });
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto bg-linear-to-br from-white to-blue-100 p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Laporan Kerusakan</CardTitle>
                        <CardDescription>Semua laporan kerusakan gedung yang telah diajukan.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div className="flex w-full max-w-sm items-center space-x-2">
                                <Search className="h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Cari nama, lokasi, atau kode laporan......"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full"
                                />
                            </div>
                            <div className="flex items-center space-x-2">
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Filter Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Status</SelectItem>
                                        <SelectItem value="pending">Menunggu</SelectItem>
                                        <SelectItem value="confirmed">Selesai</SelectItem>
                                        <SelectItem value="cancelled">Ditolak</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>No</TableHead>
                                        <TableHead>Kode Laporan</TableHead>
                                        <TableHead>Nama Pelapor</TableHead>
                                        <TableHead>Lokasi</TableHead>
                                        <TableHead className="hidden md:table-cell">Nama Item Rusak</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="hidden md:table-cell">Foto</TableHead>
                                        <TableHead className="text-center">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredDamages.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="py-4 text-center text-gray-500">
                                                Tidak ada laporan kerusakan yang ditemukan
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredDamages.map((damage: any, index: any) => (
                                            <TableRow key={damage.kode_pelaporan}>
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell className="font-mono text-sm font-medium">{damage.kode_pelaporan}</TableCell>
                                                <TableCell>
                                                    <div className="font-medium">{damage?.pelapor?.pegawai?.name}</div>
                                                    <div className="text-sm text-gray-500">{damage.unit_kerja}</div>
                                                </TableCell>
                                                <TableCell>{damage.lokasi}</TableCell>
                                                <TableCell className="hidden md:table-cell">{damage.item}</TableCell>
                                                <TableCell>
                                                    <StatusBadge status={damage.status} isRead={damage.is_read} />
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell">
                                                    {damage.picture.length > 0 ? (
                                                        <Badge variant="outline" className="flex items-center gap-1">
                                                            <ImageIcon className="h-3 w-3" />
                                                            <span>{damage.picture.length}</span>
                                                        </Badge>
                                                    ) : (
                                                        <span className="text-sm text-gray-500">-</span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <div className="inline-flex items-center justify-center">
                                                        <Link
                                                            href={route('kerusakangedung.show', damage.kode_pelaporan)}
                                                            className="inline-flex items-center gap-1 font-medium"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                            Lihat Detail
                                                        </Link>

                                                        {auth?.permissions?.includes('delete_all_requests') && (
                                                            <>
                                                                <span className="mx-3">||</span>

                                                                <button
                                                                    onClick={() => setDeleteConfirm(damage.kode_pelaporan)}
                                                                    className="inline-flex items-center gap-1 font-medium text-red-600 hover:text-red-800"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                    Hapus
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                <AlertDialog open={deleteConfirm !== null} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Hapus Layanan</AlertDialogTitle>
                            <AlertDialogDescription>
                                Apakah Anda yakin ingin menghapus laporan ini? Tindakan ini tidak dapat dibatalkan.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <div className="mt-4 flex justify-end gap-3">
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={() => deleteConfirm !== null && handleDelete(deleteConfirm)}
                                className="bg-red-600 hover:bg-red-700"
                            >
                                Hapus
                            </AlertDialogAction>
                        </div>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </AppLayout>
    );
}
