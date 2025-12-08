'use client';
import ButtonAtk from '@/components/buttonnavbar/button-daftar-atk';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Check, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Edit, Search, Trash2, X } from 'lucide-react';

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

export default function ATKItemsManagement({ daftarAtk }: any) {
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [editingId, setEditingId] = useState('');
    const [editData, setEditData] = useState({ name: '', category: '', satuan: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

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

    const totalItems = filteredItems.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

    const paginatedItems = useMemo(() => {
        return filteredItems.slice(startIndex, endIndex);
    }, [filteredItems, startIndex, endIndex]);

    // Reset to page 1 when filter changes
    const handleSearchChange = (value: string) => {
        setSearchTerm(value);
        setCurrentPage(1);
    };

    const handleCategoryChange = (value: string) => {
        setCategoryFilter(value);
        setCurrentPage(1);
    };

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
        <AppLayout breadcrumbs={breadcrumbs} Button={ButtonAtk}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Daftar ATK</CardTitle>
                        <CardDescription>Semua alat tulis kantor yang tersedia dalam sistem.</CardDescription>
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
                                            <SelectItem key={index} value={category}>
                                                {category}
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
                                                                <SelectItem value="Lusin">Lusin</SelectItem>
                                                                <SelectItem value="Botol">Botol</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    ) : (
                                                        <span className="text-sm text-gray-600">{item.satuan}</span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {editingId === item.id ? (
                                                        <div className="flex items-center justify-end gap-2">
                                                            <Button variant="ghost" size="sm" onClick={handleSaveEdit} className="text-green-600">
                                                                <Check className="h-4 w-4" />
                                                            </Button>
                                                            <Button variant="ghost" size="sm" onClick={handleCancelEdit} className="text-red-600">
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
            </div>
        </AppLayout>
    );
}
