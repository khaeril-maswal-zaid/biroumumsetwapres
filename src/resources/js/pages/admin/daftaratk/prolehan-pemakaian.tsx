'use client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
    ArrowDownCircle,
    ArrowUpCircle,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    ClipboardList,
    Plus,
    Search,
    Trash2,
} from 'lucide-react';

import { useToast } from '@/hooks/use-toast';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';

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

type MassEntry = {
    id: string;
    daftar_atk_id: string;
    quantity: string;
    unit_price: string;
    total_price: string;
};

const uuid = () => Date.now().toString(36) + Math.random().toString(36).substring(2);

export default function ATKItemsManagement({ daftarAtk, stockOpnames = [] }: any) {
    const { toast } = useToast();

    const [logCategoryFilter, setLogCategoryFilter] = useState('all');
    const [isAddMassOpen, setIsAddMassOpen] = useState(false);
    const [logSearchTerm, setLogSearchTerm] = useState('');
    const [logCurrentPage, setLogCurrentPage] = useState(1);
    const [logItemsPerPage, setLogItemsPerPage] = useState(10);

    const [massEntries, setMassEntries] = useState<MassEntry[]>([{ id: uuid(), daftar_atk_id: '', quantity: '', unit_price: '', total_price: '' }]);
    const [massSearchQueries, setMassSearchQueries] = useState<Record<number, string>>({});

    const handleMassEntryChange = (index: number, field: string, value: string) => {
        const entries = [...massEntries];
        entries[index] = { ...entries[index], [field]: value };
        const qty = entries[index].quantity ? Number(entries[index].quantity) : 0;
        const unit = entries[index].unit_price ? Number(entries[index].unit_price) : 0;
        entries[index].total_price = qty && unit ? String(qty * unit) : '';
        setMassEntries(entries);
    };

    const addMassRow = () => {
        setMassEntries([...massEntries, { id: uuid(), daftar_atk_id: '', quantity: '', unit_price: '', total_price: '' }]);
    };

    const removeMassRow = (index: number) => {
        const entries = massEntries.filter((_, i) => i !== index);
        setMassEntries(entries.length ? entries : [{ id: uuid(), daftar_atk_id: '', quantity: '', unit_price: '', total_price: '' }]);
    };

    const handleSubmitMass = () => {
        router.post(route('stockopname.store'), massEntries as any, {
            onSuccess: () => {
                toast({ title: 'Tercatat', description: 'Perolehan massal berhasil dicatat' });
                setIsAddMassOpen(false);
                setMassEntries([{ id: uuid(), daftar_atk_id: '', quantity: '', unit_price: '', total_price: '' }]);
            },
            onError: (errors) => {
                toast({ title: 'Gagal', description: Object.values(errors)[0], variant: 'destructive' });
            },
        });
    };

    function MassEntryRow({ entry, idx }: { entry: MassEntry; idx: number }) {
        const [query, setQuery] = useState('');

        const q = (query || '').toLowerCase().trim();
        const filtered = q
            ? daftarAtk.filter(
                  (atk: any) =>
                      atk.name.toLowerCase().includes(q) ||
                      String(atk.kode_atk).toLowerCase().includes(q) ||
                      String(atk.satuan).toLowerCase().includes(q) ||
                      String(atk.category).toLowerCase().includes(q),
              )
            : daftarAtk;

        return (
            <div className="grid grid-cols-12 items-center gap-3 rounded-md border bg-white p-3 shadow-sm">
                <div className="col-span-6">
                    <Label className="text-xs font-semibold">Pilih ATK</Label>
                    <Select value={entry.daftar_atk_id} onValueChange={(v) => handleMassEntryChange(idx, 'daftar_atk_id', v)}>
                        <SelectTrigger className="h-10 w-full justify-start">
                            <SelectValue placeholder="Pilih ATK...">
                                {entry.daftar_atk_id && <div>{daftarAtk.find((a: any) => String(a.id) === String(entry.daftar_atk_id))?.name}</div>}
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            <div className="p-2">
                                <Input placeholder="Cari ATK..." value={query} onChange={(e) => setQuery(e.target.value)} className="mb-2" />
                                <div className="max-h-64 overflow-y-auto">
                                    {filtered.map((atk: any) => (
                                        <SelectItem key={atk.id} value={String(atk.id)}>
                                            <div className="flex flex-col py-1">
                                                <span className="font-medium">{atk.name}</span>
                                                <span className="text-xs text-muted-foreground">
                                                    {atk.kode_atk} • {atk.category} • {atk.satuan}
                                                </span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </div>
                            </div>
                        </SelectContent>
                    </Select>
                </div>

                <div className="col-span-1">
                    <Label className="text-xs font-semibold">Jumlah</Label>
                    <Input value={entry.quantity} onChange={(e) => handleMassEntryChange(idx, 'quantity', e.target.value)} className="h-10" />
                </div>

                <div className="col-span-2">
                    <Label className="text-xs font-semibold">Harga Satuan (Rp)</Label>
                    <Input value={entry.unit_price} onChange={(e) => handleMassEntryChange(idx, 'unit_price', e.target.value)} className="h-10" />
                </div>

                <div className="col-span-2 text-right">
                    <Label className="text-xs font-semibold">Total</Label>
                    <div className="mt-1 text-sm font-semibold">Rp {entry.total_price ? Number(entry.total_price).toLocaleString('id-ID') : '0'}</div>
                </div>

                <div className="col-span-1 text-right">
                    <Button size="icon" variant="ghost" onClick={() => removeMassRow(idx)}>
                        <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                </div>
            </div>
        );
    }

    // Get unique categories
    const categories = Array.from(new Set(daftarAtk.map((item: any) => item.category)));

    // Filtered logs
    const filteredLogs = stockOpnames.filter((log: any) => {
        const atk = daftarAtk.find((item: any) => item.id == log.daftar_atk_id);
        const matchesSearch =
            !logSearchTerm ||
            (atk &&
                (atk.name.toLowerCase().includes(logSearchTerm.toLowerCase()) || atk.category.toLowerCase().includes(logSearchTerm.toLowerCase())));
        const matchesCategory = logCategoryFilter === 'all' || (atk && atk.category === logCategoryFilter);
        return matchesSearch && matchesCategory;
    });

    const logTotalItems = filteredLogs.length;
    const logTotalPages = Math.ceil(logTotalItems / logItemsPerPage);
    const logStartIndex = (logCurrentPage - 1) * logItemsPerPage;
    const logEndIndex = Math.min(logStartIndex + logItemsPerPage, logTotalItems);

    const paginatedLogs = useMemo(() => {
        return filteredLogs.slice(logStartIndex, logEndIndex);
    }, [filteredLogs, logStartIndex, logEndIndex]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl bg-linear-to-br from-white to-blue-100 p-4">
                <AtkTabs active="perolehan-pemakaian" />

                <Card className="pt-0">
                    <CardHeader className="rounded-t-md bg-linear-to-r from-blue-500 to-indigo-600 py-2.5 text-white">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0">
                                <CardTitle className="flex items-center gap-2.5">
                                    <ClipboardList className="h-5 w-5" />
                                    Perolehan & Pemakaian
                                </CardTitle>
                                <CardDescription className="text-indigo-50">Riwayat pergerakan stok alat tulis kantor.</CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    onClick={() => setIsAddMassOpen(true)}
                                    className="gap-2 bg-white text-indigo-600 shadow-lg hover:bg-indigo-50"
                                >
                                    <Plus className="h-4 w-4" />
                                    Tambah Perolehan Massal
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div className="flex w-full max-w-sm items-center space-x-2">
                                <Search className="h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Cari nama atau kategori ATK..."
                                    value={logSearchTerm}
                                    onChange={(e) => setLogSearchTerm(e.target.value)}
                                    className="w-full"
                                />
                            </div>
                            <div className="flex items-center space-x-2">
                                <Select value={logCategoryFilter} onValueChange={setLogCategoryFilter}>
                                    <SelectTrigger className="w-37.5">
                                        <SelectValue placeholder="Kategori" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Kategori</SelectItem>
                                        {categories.map((category, index) => (
                                            <SelectItem key={index} value={String(category)}>
                                                {String(category)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>No</TableHead>
                                        <TableHead>Jenis Barang ATK</TableHead>
                                        <TableHead>Kategori</TableHead>
                                        <TableHead>Satuan</TableHead>
                                        <TableHead>Jumlah</TableHead>
                                        <TableHead>Tipe</TableHead>
                                        <TableHead>Harga Satuan</TableHead>
                                        <TableHead>Total Harga</TableHead>
                                        <TableHead>Tanggal</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paginatedLogs.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={9} className="py-4 text-center text-gray-500">
                                                Tidak ada data log stok yang ditemukan
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        paginatedLogs.map((log: any, index: number) => {
                                            const atk = daftarAtk.find((item: any) => item.id == log.daftar_atk_id);
                                            return (
                                                <TableRow key={log.id}>
                                                    <TableCell>{logStartIndex + index + 1}</TableCell>
                                                    <TableCell>{atk?.name || 'N/A'}</TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline">{atk?.category || 'N/A'}</Badge>
                                                    </TableCell>
                                                    <TableCell>{atk?.satuan || 'N/A'}</TableCell>
                                                    <TableCell>{log.quantity}</TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            className={`gap-1 ${log.type == 'Perolehan' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}`}
                                                        >
                                                            {log.type == 'Perolehan' ? (
                                                                <ArrowDownCircle className="h-3 w-3" />
                                                            ) : (
                                                                <ArrowUpCircle className="h-3 w-3" />
                                                            )}
                                                            {log.type}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        {log.unit_price > 0 ? (
                                                            `Rp ${log.unit_price.toLocaleString('id-ID')}`
                                                        ) : (
                                                            <span className="text-muted-foreground italic">-</span>
                                                        )}
                                                    </TableCell>

                                                    <TableCell>
                                                        {log.unit_price > 0 ? (
                                                            `Rp ${log.total_price.toLocaleString('id-ID')}`
                                                        ) : (
                                                            <span className="text-muted-foreground italic">-</span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>{new Date(log.created_at).toLocaleDateString('id-ID')}</TableCell>
                                                </TableRow>
                                            );
                                        })
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Pagination for logs */}
                        {logTotalItems > 0 && (
                            <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-muted-foreground">Tampilkan</span>
                                        <Select value={String(logItemsPerPage)} onValueChange={(value) => setLogItemsPerPage(Number(value))}>
                                            <SelectTrigger className="h-8 w-17.5">
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
                </Card>

                <Dialog
                    open={isAddMassOpen}
                    onOpenChange={(open) => {
                        setIsAddMassOpen(open);
                        if (!open) {
                            setMassEntries([{ id: uuid(), daftar_atk_id: '', quantity: '', unit_price: '', total_price: '' }]);
                        }
                    }}
                >
                    <DialogContent className="gap-1.5 bg-linear-to-r from-white to-blue-50 lg:min-w-4xl">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-xl">
                                <Plus className="h-5 w-5 text-indigo-600" />
                                Tambah Perolehan Massal
                            </DialogTitle>
                            <DialogDescription>Masukkan beberapa perolehan sekaligus.</DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-4 py-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="sm" onClick={addMassRow}>
                                        <Plus className="h-4 w-4" />
                                        Tambah Baris
                                    </Button>
                                </div>
                            </div>

                            <div className="max-h-96 space-y-3 overflow-y-auto">
                                {massEntries.map((entry, idx) => (
                                    <div key={entry.id} className="grid grid-cols-12 items-center gap-3 rounded-md border bg-white p-3 shadow-sm">
                                        <div className="col-span-6">
                                            <Label className="text-xs font-semibold">Pilih ATK</Label>
                                            <Select value={entry.daftar_atk_id} onValueChange={(v) => handleMassEntryChange(idx, 'daftar_atk_id', v)}>
                                                <SelectTrigger className="h-10 w-full justify-start">
                                                    <SelectValue placeholder="Pilih ATK...">
                                                        {entry.daftar_atk_id && (
                                                            <div>
                                                                {daftarAtk.find((a: any) => String(a.id) === String(entry.daftar_atk_id))?.name}
                                                            </div>
                                                        )}
                                                    </SelectValue>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <div className="p-2">
                                                        <Input
                                                            placeholder="Cari ATK..."
                                                            value={massSearchQueries[idx] || ''}
                                                            onChange={(e) => setMassSearchQueries((prev) => ({ ...prev, [idx]: e.target.value }))}
                                                            className="mb-2"
                                                            onKeyDown={(e) => e.stopPropagation()}
                                                        />
                                                        <div className="max-h-64 overflow-y-auto">
                                                            {(() => {
                                                                const q = (massSearchQueries[idx] || '').toLowerCase().trim();
                                                                const filtered = q
                                                                    ? daftarAtk.filter(
                                                                          (atk: any) =>
                                                                              atk.name.toLowerCase().includes(q) ||
                                                                              String(atk.kode_atk).toLowerCase().includes(q) ||
                                                                              String(atk.satuan).toLowerCase().includes(q) ||
                                                                              String(atk.category).toLowerCase().includes(q),
                                                                      )
                                                                    : daftarAtk;

                                                                return filtered.map((atk: any) => (
                                                                    <SelectItem key={atk.id} value={String(atk.id)}>
                                                                        <div className="flex flex-col py-1">
                                                                            <span className="font-medium">{atk.name}</span>
                                                                            <span className="text-xs text-muted-foreground">
                                                                                {atk.kode_atk} • {atk.category} • {atk.satuan}
                                                                            </span>
                                                                        </div>
                                                                    </SelectItem>
                                                                ));
                                                            })()}
                                                        </div>
                                                    </div>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="col-span-1">
                                            <Label className="text-xs font-semibold">Jumlah</Label>
                                            <Input
                                                value={entry.quantity}
                                                onChange={(e) => handleMassEntryChange(idx, 'quantity', e.target.value)}
                                                className="h-10"
                                            />
                                        </div>

                                        <div className="col-span-2">
                                            <Label className="text-xs font-semibold">Harga Satuan (Rp)</Label>
                                            <Input
                                                value={entry.unit_price}
                                                onChange={(e) => handleMassEntryChange(idx, 'unit_price', e.target.value)}
                                                className="h-10"
                                            />
                                        </div>

                                        <div className="col-span-2 text-right">
                                            <Label className="text-xs font-semibold">Total</Label>
                                            <div className="mt-1 text-sm font-semibold">
                                                Rp {entry.total_price ? Number(entry.total_price).toLocaleString('id-ID') : '0'}
                                            </div>
                                        </div>

                                        <div className="col-span-1 text-right">
                                            <Button size="icon" variant="ghost" onClick={() => removeMassRow(idx)}>
                                                <Trash2 className="h-4 w-4 text-red-600" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAddMassOpen(false)}>
                                Batal
                            </Button>
                            <Button
                                onClick={handleSubmitMass}
                                className="bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Simpan Perolehan Massal
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
