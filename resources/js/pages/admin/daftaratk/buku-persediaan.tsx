'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, PackageSearch, RotateCcw } from 'lucide-react';
import { useMemo, useState } from 'react';

import { ItemCombobox } from '@/components/biroumum/item-combobox';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manajemen ATK',
        href: '/dashboard',
    },
];

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

const MONTHS = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

const YEARS = ['2026'];

export default function ATKItemsManagement({ Persediaan }: any) {
    const [selectedItem, setSelectedItem] = useState<string | null>(null);
    const [selectedKodeAtk, setSelectedKodeAtk] = useState<string | null>(null);
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedYear, setSelectedYear] = useState('2026');
    const [logItemsPerPage, setLogItemsPerPage] = useState(10);
    const [logCurrentPage, setLogCurrentPage] = useState(1);

    // Filter logic
    const filteredData = useMemo(() => {
        return Persediaan;
    }, [Persediaan]);

    const summary = useMemo(() => {
        const total = filteredData.length;
        const totalUsage = filteredData.reduce((sum: number, item: any) => sum + item.pemakaian, 0);

        return { total, totalUsage };
    }, [filteredData]);

    const logTotalItems = filteredData.length;
    const logTotalPages = Math.ceil(logTotalItems / logItemsPerPage);
    const logStartIndex = (logCurrentPage - 1) * logItemsPerPage;
    const logEndIndex = Math.min(logStartIndex + logItemsPerPage, logTotalItems);

    const paginatedLogs = useMemo(() => {
        return filteredData.slice(logStartIndex, logEndIndex);
    }, [filteredData, logStartIndex, logEndIndex]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl bg-linear-to-br from-white to-blue-100 p-4">
                <AtkTabs active="book-stay" />

                <Card className="pt-0">
                    <CardHeader className="rounded-t-md bg-linear-to-r from-blue-500 to-indigo-600 py-2.5 text-white">
                        <div className="space-y-0">
                            <CardTitle className="flex items-center gap-2">
                                <PackageSearch className="h-5 w-5" />
                                Buku Persediaan ATK
                            </CardTitle>
                            <CardDescription className="text-blue-50">Riwayat pergerakan dan saldo persediaan ATK.</CardDescription>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        <div className="space-y-3 md:flex md:items-end md:gap-3 md:space-y-0">
                            <div className="flex-1">
                                <label className="mb-2 block text-sm font-medium text-foreground">Item ATK</label>
                                <ItemCombobox
                                    items={Persediaan.map((i: any) => ({
                                        id: String(i.id),
                                        name: i.name,
                                        category: i.kategori,
                                        kode_atk: i.kode_atk,
                                        satuan: i.satuan,
                                    }))}
                                    value={selectedItem}
                                    onSelect={setSelectedItem}
                                    kodeAtk={setSelectedKodeAtk}
                                />
                            </div>

                            <div className="w-full md:w-auto">
                                <label className="mb-2 block text-sm font-medium text-foreground">
                                    <Calendar className="mr-1 inline h-4 w-4" />
                                    Bulan
                                </label>
                                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                                    <SelectTrigger className="w-full md:w-40">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {MONTHS.map((month, idx) => (
                                            <SelectItem key={month} value={String(idx + 1)}>
                                                {month}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="w-full md:w-auto">
                                <label className="mb-2 block text-sm font-medium text-foreground">Tahun</label>
                                <Select value={selectedYear} onValueChange={setSelectedYear}>
                                    <SelectTrigger className="w-full md:w-40">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {YEARS.map((year) => (
                                            <SelectItem key={year} value={year}>
                                                {year}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex w-full gap-2 md:w-auto">
                                <Button
                                    className="flex-1 md:flex-none"
                                    onClick={() => {
                                        router.get(
                                            route('stockopname.buku_persediaan'),
                                            {
                                                daftar_atk_kode: selectedKodeAtk,
                                                bulan: selectedMonth,
                                                tahun: selectedYear,
                                            },
                                            {
                                                preserveState: true,
                                                preserveScroll: true,
                                            },
                                        );
                                    }}
                                >
                                    Apply Filter
                                </Button>

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                        (router.get(
                                            route('stockopname.buku_persediaan'),
                                            {},
                                            {
                                                preserveState: true,
                                                preserveScroll: true,
                                            },
                                        ),
                                            setSelectedItem(null));
                                        setSelectedMonth('');
                                        setSelectedKodeAtk(null);
                                        setSelectedYear('2026');
                                    }}
                                    title="Reset filters"
                                >
                                    <RotateCcw className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-lg border">
                            <Table>
                                <TableHeader className="bg-muted">
                                    <TableRow>
                                        <TableHead className="w-12">No</TableHead>
                                        <TableHead>Jenis Barang</TableHead>
                                        <TableHead>Kategori</TableHead>
                                        <TableHead className="w-24">Satuan</TableHead>
                                        <TableHead className="w-20 text-right">Jumlah</TableHead>
                                        <TableHead className="w-24 text-right">Pemakaian</TableHead>
                                        <TableHead className="w-20 text-right">Saldo</TableHead>
                                        <TableHead className="w-20 text-right">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paginatedLogs.map((item: any, idx: number) => {
                                        const saldoValue = item.saldo;
                                        const isLow = saldoValue <= 5;
                                        const isPositive = saldoValue > 0;

                                        return (
                                            <TableRow key={item.id} className="transition-colors hover:bg-muted/50">
                                                <TableCell className="font-medium text-muted-foreground">{logStartIndex + idx + 1}</TableCell>
                                                <TableCell className="font-medium">{item.name}</TableCell>
                                                <TableCell className="text-muted-foreground">{item.kategori}</TableCell>
                                                <TableCell className="text-muted-foreground">{item.satuan}</TableCell>
                                                <TableCell className="text-right font-medium">{item?.jumlah || 0}</TableCell>
                                                <TableCell className="text-right font-medium">{item?.pemakaian || 0}</TableCell>
                                                <TableCell
                                                    className={`text-right font-medium ${isLow ? 'text-destructive' : isPositive ? 'text-green-600 dark:text-green-400' : 'text-destructive'}`}
                                                >
                                                    {saldoValue}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Badge
                                                        onClick={() => {
                                                            router.get(
                                                                route('stockopname.detail_pemakaian'),
                                                                {
                                                                    kodeAtk: item.kode_atk,
                                                                    bulan: selectedMonth,
                                                                    tahun: selectedYear,
                                                                },
                                                                {
                                                                    preserveState: true,
                                                                    preserveScroll: true,
                                                                },
                                                            );
                                                        }}
                                                        className="cursor-pointer bg-blue-500 text-white transition select-none hover:bg-blue-600 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 focus-visible:outline-none active:bg-blue-700"
                                                    >
                                                        Detail Pemakaian
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>

                        {logTotalItems > 0 && (
                            <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-muted-foreground">Tampilkan</span>
                                        <Select value={String(logItemsPerPage)} onValueChange={(value) => setLogItemsPerPage(Number(value))}>
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
                                        Menampilkan <span className="font-medium text-foreground">{logStartIndex + 1}</span> -{' '}
                                        <span className="font-medium text-foreground">{logEndIndex}</span> dari{' '}
                                        <span className="font-medium text-foreground">{logTotalItems}</span> data
                                    </div>
                                </div>

                                {/* Right: Pagination controls for logs */}
                                <div className="flex items-center gap-1">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8 bg-transparent"
                                        onClick={() => setLogCurrentPage(1)}
                                        disabled={logCurrentPage === 1}
                                    >
                                        <ChevronsLeft className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8 bg-transparent"
                                        onClick={() => setLogCurrentPage((prev) => Math.max(prev - 1, 1))}
                                        disabled={logCurrentPage === 1}
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>
                                    <span className="px-2 text-sm text-muted-foreground">
                                        Halaman {logCurrentPage} dari {logTotalPages}
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8 bg-transparent"
                                        onClick={() => setLogCurrentPage((prev) => Math.min(prev + 1, logTotalPages))}
                                        disabled={logCurrentPage === logTotalPages}
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8 bg-transparent"
                                        onClick={() => setLogCurrentPage(logTotalPages)}
                                        disabled={logCurrentPage === logTotalPages}
                                    >
                                        <ChevronsRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>

                    <CardFooter className="border-t pt-4">
                        <div className="ml-auto flex gap-8 text-sm">
                            <div>
                                <p className="text-muted-foreground">Total Items</p>
                                <p className="text-lg font-semibold">{summary.total}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Total Pemakaian</p>
                                <p className="text-lg font-semibold">{summary.totalUsage}</p>
                            </div>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </AppLayout>
    );
}
