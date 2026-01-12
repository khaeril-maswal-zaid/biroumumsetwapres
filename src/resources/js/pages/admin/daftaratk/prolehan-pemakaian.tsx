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
    Coins,
    DollarSign,
    Package,
    Plus,
    Search,
} from 'lucide-react';

import { useToast } from '@/hooks/use-toast';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
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

export default function ATKItemsManagement({ daftarAtk, stockOpnames = [] }: any) {
    const { toast } = useToast();

    const [daftarAtkState] = useState(daftarAtk);
    const [logCategoryFilter, setLogCategoryFilter] = useState('all');
    const [isAddLogOpen, setIsAddLogOpen] = useState(false);
    const [logSearchTerm, setLogSearchTerm] = useState('');
    const [logCurrentPage, setLogCurrentPage] = useState(1);
    const [logItemsPerPage, setLogItemsPerPage] = useState(10);
    const [newLog, setNewLog] = useState({
        daftar_atk_id: '',
        quantity: '',
        type: 'Perolehan',
        unit_price: '',
        total_price: '',
    });
    const [selectedATK, setSelectedATK] = useState<any>(null);
    const [atkSearchTerm, setAtkSearchTerm] = useState('');

    const handleQuantityChange = (value: string) => {
        const quantity = value;
        const unitPrice = newLog.unit_price;
        const totalPrice = unitPrice ? (Number(quantity) * Number(unitPrice)).toString() : '';
        setNewLog({ ...newLog, quantity, total_price: totalPrice });
    };

    const handleUnitPriceChange = (value: string) => {
        const unitPrice = value;
        const quantity = newLog.quantity;
        const totalPrice = quantity ? (Number(quantity) * Number(unitPrice)).toString() : '';
        setNewLog({ ...newLog, unit_price: unitPrice, total_price: totalPrice });
    };

    // Get unique categories
    const categories = Array.from(new Set(daftarAtk.map((item: any) => item.category)));

    const handleATKSelect = (atkId: string) => {
        const atk = daftarAtkState.find((item: any) => item.id === Number(atkId));
        setSelectedATK(atk);
        setNewLog({ ...newLog, daftar_atk_id: atkId });
    };

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

    const filteredAtkForSelect = useMemo(() => {
        return daftarAtkState.filter(
            (atk: any) =>
                atk.name.toLowerCase().includes(atkSearchTerm.toLowerCase()) ||
                atk.category.toLowerCase().includes(atkSearchTerm.toLowerCase()) ||
                atk.kode_atk.toLowerCase().includes(atkSearchTerm.toLowerCase()),
        );
    }, [daftarAtkState, atkSearchTerm]);

    const handleAddLog = () => {
        router.post(route('stockopname.store'), newLog, {
            onSuccess: () => {
                setIsAddLogOpen(false);
                setNewLog({ daftar_atk_id: '', quantity: '', type: 'Perolehan', unit_price: '', total_price: '' });
                setSelectedATK(null);
                setAtkSearchTerm('');
            },
            onError: (errors) => {
                console.error('Error adding log:', errors);
                toast({ title: 'Gagal', description: Object.values(errors)[0], variant: 'destructive' });
            },
        });
    };

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
                            <Button onClick={() => setIsAddLogOpen(true)} className="gap-2 bg-white text-indigo-600 shadow-lg hover:bg-indigo-50">
                                <Plus className="h-4 w-4" />
                                Tambah Perolehan
                            </Button>
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
                                    <SelectTrigger className="w-[150px]">
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
                                        <TableHead>Nama ATK</TableHead>
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
                </Card>

                <Dialog
                    open={isAddLogOpen}
                    onOpenChange={(open) => {
                        setIsAddLogOpen(open);
                        if (!open) {
                            setAtkSearchTerm('');
                            setNewLog({
                                daftar_atk_id: '',
                                quantity: '',
                                type: 'Perolehan',
                                unit_price: '',
                                total_price: '',
                            });
                            setSelectedATK(null);
                        }
                    }}
                >
                    <DialogContent className="sm:max-w-[700px]">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-xl">
                                <Plus className="h-5 w-5 text-indigo-600" />
                                Tambah Perolehan
                            </DialogTitle>
                            <DialogDescription>Masukkan detail stok ATK yang masuk ke gudang.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-6 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="atk-select" className="flex items-center gap-2 text-base font-semibold">
                                    <Package className="h-4 w-4 text-indigo-600" />
                                    Pilih ATK
                                </Label>
                                <Select value={newLog.daftar_atk_id} onValueChange={handleATKSelect}>
                                    <SelectTrigger id="atk-select" className="h-11 w-full justify-start">
                                        <SelectValue placeholder="Cari dan pilih ATK..." className="w-full text-left">
                                            {selectedATK && (
                                                <div className="py-1 text-left">
                                                    <span className="font-medium">{selectedATK.name}</span>
                                                    <span className="text-xs text-muted-foreground"> • </span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {selectedATK.category} • {selectedATK.satuan}
                                                    </span>
                                                </div>
                                            )}
                                        </SelectValue>
                                    </SelectTrigger>

                                    <SelectContent>
                                        <div className="sticky top-0 z-10 border-b bg-white p-2">
                                            <div className="flex items-center space-x-2 rounded-lg border bg-white px-3">
                                                <Search className="h-4 w-4 text-gray-400" />
                                                <Input
                                                    placeholder="Cari ATK..."
                                                    value={atkSearchTerm}
                                                    onChange={(e) => setAtkSearchTerm(e.target.value)}
                                                    className="h-9 border-0 focus-visible:ring-0"
                                                    onClick={(e) => e.stopPropagation()}
                                                    onKeyDown={(e) => e.stopPropagation()}
                                                />
                                            </div>
                                        </div>
                                        <div className="max-h-[300px] overflow-y-auto">
                                            {filteredAtkForSelect.length === 0 ? (
                                                <div className="p-4 text-center text-sm text-muted-foreground">Tidak ada ATK yang ditemukan</div>
                                            ) : (
                                                filteredAtkForSelect.map((atk: any) => (
                                                    <SelectItem key={atk.id} value={String(atk.id)} className="cursor-pointer">
                                                        <div className="flex flex-col py-1">
                                                            <span className="font-medium">{atk.name}</span>
                                                            <span className="text-xs text-muted-foreground">
                                                                {atk.kode_atk} • {atk.category} • {atk.satuan}
                                                            </span>
                                                        </div>
                                                    </SelectItem>
                                                ))
                                            )}
                                        </div>
                                    </SelectContent>
                                </Select>

                                {selectedATK && (
                                    <div className="mt-2 rounded-lg border-2 border-indigo-200 bg-linear-to-r from-indigo-50 to-purple-50 p-4">
                                        <div className="flex items-center justify-between gap-4">
                                            <div className="flex items-center gap-3">
                                                <div className="rounded-lg bg-white p-2 shadow-sm">
                                                    <Package className="h-5 w-5 text-indigo-600" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-indigo-900">{selectedATK.name}</p>
                                                    <p className="text-sm text-indigo-600">{selectedATK.kode_atk}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Badge variant="outline" className="border-indigo-300 bg-white text-indigo-700">
                                                    Karegori: {selectedATK.category}
                                                </Badge>
                                                <Badge variant="outline" className="border-purple-300 bg-white text-purple-700">
                                                    Satuan: {selectedATK.satuan}
                                                </Badge>
                                                <Badge variant="default" className="bg-indigo-600">
                                                    Stok: {selectedATK.quantity}
                                                </Badge>
                                                {newLog.quantity && Number(newLog.quantity) > 0 && (
                                                    <Badge
                                                        variant="default"
                                                        className={`${
                                                            selectedATK.quantity + Number(newLog.quantity) >= 0 ? 'bg-green-600' : 'bg-red-600'
                                                        }`}
                                                    >
                                                        Stok Akhir: {selectedATK.quantity + Number(newLog.quantity)}
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="quantity" className="flex items-center gap-2 font-semibold">
                                        <ArrowDownCircle className="h-4 w-4 text-green-600" />
                                        Jumlah Masuk
                                    </Label>
                                    <Input
                                        id="quantity"
                                        type="number"
                                        placeholder="0"
                                        value={newLog.quantity}
                                        onChange={(e) => handleQuantityChange(e.target.value)}
                                        className="h-11 text-lg font-semibold"
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="unit-price" className="flex items-center gap-2 font-semibold">
                                        <Coins className="h-4 w-4 text-indigo-600" />
                                        Harga Satuan (Rp)
                                    </Label>
                                    <Input
                                        id="unit-price"
                                        type="number"
                                        placeholder="0"
                                        value={newLog.unit_price}
                                        onChange={(e) => handleUnitPriceChange(e.target.value)}
                                        className="h-11 text-lg"
                                    />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label className="flex items-center gap-2 font-semibold">
                                    <DollarSign className="h-4 w-4 text-indigo-600" />
                                    Total Harga (Rp)
                                </Label>
                                <div className="rounded-lg border-2 border-indigo-200 bg-linear-to-r from-indigo-50 to-purple-50 p-4">
                                    <div className="text-2xl font-bold text-indigo-600">
                                        Rp {newLog.total_price ? Number(newLog.total_price).toLocaleString('id-ID') : '0'}
                                    </div>
                                    <p className="mt-1 text-xs text-indigo-500">Otomatis dihitung dari jumlah × harga satuan</p>
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAddLogOpen(false)}>
                                Batal
                            </Button>
                            <Button
                                onClick={handleAddLog}
                                disabled={!newLog.daftar_atk_id || !newLog.quantity || !newLog.unit_price}
                                className="bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Simpan Log
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
