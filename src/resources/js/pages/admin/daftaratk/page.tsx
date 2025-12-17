'use client';
import ButtonAtk from '@/components/buttonnavbar/button-daftar-atk';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    ArrowDownCircle,
    ArrowUpCircle,
    Check,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    ClipboardList,
    DollarSign,
    Edit,
    Package,
    Plus,
    Search,
    Trash2,
    X,
} from 'lucide-react';
('use client');

import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function ATKItemsManagement({ daftarAtk, stockOpnames = [] }: any) {
    const [daftarAtkState] = useState(daftarAtk);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [editingId, setEditingId] = useState('');
    const [editData, setEditData] = useState({ name: '', category: '', satuan: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [logCategoryFilter, setLogCategoryFilter] = useState('all');
    const [isAddLogOpen, setIsAddLogOpen] = useState(false);
    const [logSearchTerm, setLogSearchTerm] = useState('');
    const [logCurrentPage, setLogCurrentPage] = useState(1);
    const [logItemsPerPage, setLogItemsPerPage] = useState(10);
    const [newLog, setNewLog] = useState({
        daftar_atk_id: '',
        quantity: '',
        type: 'Masuk',
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

    // Filter items
    const filteredItems = daftarAtk.filter((item: any) => {
        const matchesSearch =
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;

        return matchesSearch && matchesCategory;
    });

    const handleEdit = (item: any) => {
        setEditingId(item.id);
        setEditData({
            name: item.name,
            category: item.category,
            satuan: item.satuan,
        });
    };

    const handleSaveEdit = () => {
        router.put(route('daftaratk.update', editingId), editData, {
            onSuccess: () => {
                // Simulate API call
                setEditingId('');
                setEditData({ name: '', category: '', satuan: '' });
            },
            onError: (error) => {
                console.log(error);
            },
        });
    };

    const handleCancelEdit = () => {
        setEditingId('');
        setEditData({ name: '', category: '', satuan: '' });
    };

    const handleDelete = (item: any) => {
        setSelectedItem(item);
        setIsDeleteOpen(true);
    };

    const handleDeleteConfirm = () => {
        router.delete(route('daftaratk.destroy', selectedItem?.id), {
            onSuccess: () => {
                setIsDeleteOpen(false);
                setSelectedItem(null);
            },
            onError: (er) => {
                console.log(er);
            },
        });
    };

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

    const totalItems = filteredItems.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

    const paginatedItems = useMemo(() => {
        return filteredItems.slice(startIndex, endIndex);
    }, [filteredItems, startIndex, endIndex]);

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
                setNewLog({ daftar_atk_id: '', quantity: '', type: 'Masuk', unit_price: '', total_price: '' });
                setSelectedATK(null);
                setAtkSearchTerm('');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl bg-linear-to-br from-white to-blue-100 p-4">
                <Tabs defaultValue="daftar-atk" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="daftar-atk">Daftar ATK</TabsTrigger>
                        <TabsTrigger value="log-stok">Log Stok ATK</TabsTrigger>
                    </TabsList>

                    <TabsContent value="daftar-atk" className="space-y-4">
                        <Card className="pt-0">
                            <CardHeader className="rounded-t-lg bg-linear-to-r from-blue-500 to-indigo-600 py-2 text-white">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <CardTitle className="flex items-center gap-2">
                                            <Package className="h-5 w-5" />
                                            Daftar ATK
                                        </CardTitle>
                                        <CardDescription className="text-blue-50">
                                            Semua alat tulis kantor yang tersedia dalam sistem.
                                        </CardDescription>
                                    </div>
                                    <ButtonAtk />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                    <div className="flex w-full max-w-sm items-center space-x-2">
                                        <Search className="h-4 w-4 text-gray-400" />
                                        <Input
                                            placeholder="Cari nama atau kategori ATK..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full"
                                        />
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
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
                                                <TableHead>Kode ATK</TableHead>
                                                <TableHead>Nama ATK</TableHead>
                                                <TableHead>Kategori</TableHead>
                                                <TableHead>Satuan</TableHead>
                                                <TableHead>Stok</TableHead>
                                                <TableHead className="text-right">Aksi</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {paginatedItems.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={4} className="py-4 text-center text-gray-500">
                                                        Tidak ada data ATK yang ditemukan
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                paginatedItems.map((item: any, index: number) => (
                                                    <TableRow key={item.id}>
                                                        <TableCell>
                                                            <div className="text-sm font-medium text-muted-foreground">{startIndex + index + 1}</div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="font-medium">{item.kode_atk}</div>
                                                        </TableCell>
                                                        <TableCell>
                                                            {editingId === item.id ? (
                                                                <Input
                                                                    value={editData.name}
                                                                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                                                    className="w-full"
                                                                    autoFocus
                                                                />
                                                            ) : (
                                                                <div className="font-medium">{item.name}</div>
                                                            )}
                                                        </TableCell>
                                                        <TableCell>
                                                            {editingId === item.id ? (
                                                                <Select
                                                                    value={editData.category}
                                                                    onValueChange={(value) => setEditData({ ...editData, category: value })}
                                                                >
                                                                    <SelectTrigger className="w-full">
                                                                        <SelectValue />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="Alat Tulis">Alat Tulis</SelectItem>
                                                                        <SelectItem value="Kertas">Kertas</SelectItem>
                                                                        <SelectItem value="Alat Kantor">Alat Kantor</SelectItem>
                                                                        <SelectItem value="Elektronik">Elektronik</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            ) : (
                                                                <Badge variant="outline">{item.category}</Badge>
                                                            )}
                                                        </TableCell>
                                                        <TableCell>
                                                            {editingId === item.id ? (
                                                                <Select
                                                                    value={editData.satuan}
                                                                    onValueChange={(value) => setEditData({ ...editData, satuan: value })}
                                                                >
                                                                    <SelectTrigger className="w-full">
                                                                        <SelectValue />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="Pcs">Pcs</SelectItem>
                                                                        <SelectItem value="Box">Box</SelectItem>
                                                                        <SelectItem value="Pack">Pack</SelectItem>
                                                                        <SelectItem value="Rim">Rim</SelectItem>
                                                                        <SelectItem value="Buah">Buah</SelectItem>
                                                                        <SelectItem value="Lusin">Lusin</SelectItem>
                                                                        <SelectItem value="Botol">Botol</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            ) : (
                                                                <span className="text-sm text-gray-600">{item.satuan}</span>
                                                            )}
                                                        </TableCell>
                                                        <TableCell>
                                                            <span className="text-sm font-medium">{item.quantity}</span>
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            {editingId === item.id ? (
                                                                <div className="flex items-center justify-end gap-2">
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={handleSaveEdit}
                                                                        className="text-green-600"
                                                                    >
                                                                        <Check className="h-4 w-4" />
                                                                    </Button>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={handleCancelEdit}
                                                                        className="text-red-600"
                                                                    >
                                                                        <X className="h-4 w-4" />
                                                                    </Button>
                                                                </div>
                                                            ) : (
                                                                <div className="flex items-center justify-end gap-2">
                                                                    <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}>
                                                                        <Edit className="h-4 w-4" />
                                                                    </Button>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => handleDelete(item)}
                                                                        className="text-red-600 hover:text-red-700"
                                                                    >
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </Button>
                                                                </div>
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>

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
                    <TabsContent value="log-stok" className="space-y-4">
                        <Card className="pt-0">
                            <CardHeader className="rounded-t-lg bg-linear-to-r from-indigo-500 to-purple-600 py-2 text-white">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <CardTitle className="flex items-center gap-2">
                                            <ClipboardList className="h-5 w-5" />
                                            Log Stok ATK
                                        </CardTitle>
                                        <CardDescription className="text-indigo-50">Riwayat pergerakan stok alat tulis kantor.</CardDescription>
                                    </div>
                                    <Button
                                        onClick={() => setIsAddLogOpen(true)}
                                        className="gap-2 bg-white text-indigo-600 shadow-lg hover:bg-indigo-50"
                                    >
                                        <Plus className="h-4 w-4" />
                                        Tambah Log Stok
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
                                                                    className={`gap-1 ${log.type == 'Masuk' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}`}
                                                                >
                                                                    {log.type == 'Masuk' ? (
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
                    </TabsContent>
                </Tabs>

                {/* Delete Confirmation Dialog */}
                <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Hapus ATK</DialogTitle>
                            <DialogDescription>
                                Apakah Anda yakin ingin menghapus "{selectedItem?.name}"? Tindakan ini tidak dapat dibatalkan.
                            </DialogDescription>
                        </DialogHeader>

                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
                                Batal
                            </Button>
                            <Button variant="destructive" onClick={handleDeleteConfirm}>
                                Hapus
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <Dialog
                    open={isAddLogOpen}
                    onOpenChange={(open) => {
                        setIsAddLogOpen(open);
                        if (!open) {
                            setAtkSearchTerm('');
                            setNewLog({
                                daftar_atk_id: '',
                                quantity: '',
                                type: 'Masuk',
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
                                Tambah Log Stok Masuk
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
                                                            selectedATK.quantity - Number(newLog.quantity) >= 0 ? 'bg-green-600' : 'bg-red-600'
                                                        }`}
                                                    >
                                                        Stok Akhir: {selectedATK.quantity - Number(newLog.quantity)}
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
                                        <DollarSign className="h-4 w-4 text-indigo-600" />
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
