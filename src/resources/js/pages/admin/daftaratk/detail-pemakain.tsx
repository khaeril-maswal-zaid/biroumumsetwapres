'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { useMemo, useState } from 'react';

const formatTanggalIna = (tanggal: string) => {
    return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(new Date(tanggal));
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manajemen ATK',
        href: '/dashboard',
    },
];

const MONTHS_ID = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

function formatBulanTahun({ bulan, tahun }: any) {
    if (!tahun) return '';

    if (!bulan) {
        return tahun;
    }

    const monthIndex = Number(bulan) - 1;

    return `${MONTHS_ID[monthIndex]} ${tahun}`;
}

function AtkTabs({ active }: { active: 'daftar-atk' | 'perolehan-pemakaian' | 'book-stay' }) {
    return (
        <nav className="grid w-full grid-cols-3 rounded-lg bg-muted p-1">
            <Link
                href={route('daftaratk.index')}
                className={cn(
                    'flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition',
                    active === 'daftar-atk'
                        ? 'bg-background text-foreground shadow-sm'
                        : 'text-muted-foreground hover:bg-background/60 hover:text-foreground',
                )}
            >
                Daftar Persediaan ATK
            </Link>

            <Link
                href={route('stockopname.index')}
                className={cn(
                    'flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition',
                    active === 'perolehan-pemakaian'
                        ? 'bg-background text-foreground shadow-sm'
                        : 'text-muted-foreground hover:bg-background/60 hover:text-foreground',
                )}
            >
                Perolehan & Pemakaian
            </Link>

            <Link
                href={route('stockopname.buku_persediaan')}
                className={cn(
                    'flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition',
                    active === 'book-stay'
                        ? 'bg-background text-foreground shadow-sm'
                        : 'text-muted-foreground hover:bg-background/60 hover:text-foreground',
                )}
            >
                Buku Persediaan
            </Link>
        </nav>
    );
}

export default function ATKItemsManagement({ Persediaan, filters }: any) {
    const [filterUser, setFilterUser] = useState('Semua Pengguna');

    // Filter by selected bulan, tahun, and user only (removed date range filter)
    const filteredData = useMemo(() => {
        return Persediaan.filter((item: any) => {
            if (filterUser !== 'Semua Pengguna' && item.digunakan_oleh !== filterUser) return false;
            return true;
        });
    }, [filterUser]);

    const uniqueUsers = [...new Set(Persediaan.map((u: any) => u.digunakan_oleh))];

    const handleReset = () => {
        setFilterUser('Semua Pengguna');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl bg-linear-to-br from-white to-blue-100 p-4">
                <AtkTabs active="book-stay" />

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                                <div>
                                    <h2 className="text-xl font-bold">{Persediaan?.[0]?.itemAtk?.name}</h2>
                                    <p className="text-sm text-muted-foreground">{Persediaan?.[0]?.itemAtk?.kode_atk}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-muted-foreground">Periode</p>
                                    <p className="text-lg font-semibold">{formatBulanTahun(filters)}</p>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            <div className="space-y-3 md:flex md:items-end md:gap-3 md:space-y-0">
                                <div className="flex-1">
                                    <label className="mb-2 block text-sm font-medium text-foreground">Pengguna</label>
                                    <Select value={filterUser} onValueChange={setFilterUser}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Semua Pengguna" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Semua Pengguna">Semua Pengguna</SelectItem>
                                            {uniqueUsers.map((user, index) => (
                                                <SelectItem key={index} value={String(user)}>
                                                    {String(user)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex w-full gap-2 md:w-auto">
                                    <Button onClick={handleReset} className="flex-1 md:flex-none">
                                        Reset
                                    </Button>
                                </div>
                            </div>

                            <div className="overflow-hidden rounded-lg border">
                                <Table>
                                    <TableHeader className="bg-muted">
                                        <TableRow>
                                            <TableHead className="w-12">No</TableHead>
                                            <TableHead>Tanggal Pemakaian</TableHead>
                                            <TableHead className="w-24 text-right">Jumlah Dipakai</TableHead>
                                            <TableHead className="w-20">Satuan</TableHead>
                                            <TableHead>Digunakan Oleh</TableHead>
                                            <TableHead>Keterangan</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredData.length > 0 ? (
                                            filteredData.map((usage: any, idx: number) => (
                                                <TableRow key={idx} className="transition-colors hover:bg-muted/50">
                                                    <TableCell className="font-medium text-muted-foreground">{idx + 1}</TableCell>
                                                    <TableCell>{formatTanggalIna(usage.tanggal)}</TableCell>
                                                    <TableCell className="text-right font-medium">{usage.jumlah}</TableCell>
                                                    <TableCell className="text-muted-foreground">{usage.satuan}</TableCell>
                                                    <TableCell className="font-medium">{usage.digunakan_oleh}</TableCell>
                                                    <TableCell className="text-sm text-muted-foreground">{usage.keterangan}</TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                                                    Tidak ada data pemakaian
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
