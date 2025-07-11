'use client';

import type React from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Check, Edit, Plus, Search, Trash2, X } from 'lucide-react';

import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

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
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [editingId, setEditingId] = useState('');
    const [editData, setEditData] = useState({ name: '', category: '', unit: '' });
    const [formData, setFormData] = useState({
        kode_atk: '',
        name: '',
        category: '',
        unit: '',
    });

    // Get unique categories
    const categories = Array.from(new Set(daftarAtk.data.map((item: any) => item.category)));

    // Filter items
    const filteredItems = daftarAtk.data.filter((item: any) => {
        const matchesSearch =
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;

        return matchesSearch && matchesCategory;
    });

    const handleAdd = () => {
        setFormData({
            kode_atk: '',
            name: '',
            category: '',
            unit: '',
        });
        setIsAddOpen(true);
    };

    const handleEdit = (item: any) => {
        setEditingId(item.id);
        setEditData({
            name: item.name,
            category: item.category,
            unit: item.unit,
        });
    };

    const handleSaveEdit = () => {
        router.put(route('daftaratk.update', editingId), editData, {
            onSuccess: () => {
                // Simulate API call
                setEditingId('');
                setEditData({ name: '', category: '', unit: '' });
            },
            onError: (error) => {
                console.log(error);
            },
        });
    };

    const handleCancelEdit = () => {
        setEditingId('');
        setEditData({ name: '', category: '', unit: '' });
    };

    const handleDelete = (item: any) => {
        setSelectedItem(item);
        setIsDeleteOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(route('daftaratk.store'), formData, {
            onSuccess: () => {
                setIsAddOpen(false);
                setFormData({
                    kode_atk: '',
                    name: '',
                    category: '',
                    unit: '',
                });
            },
            onError: (er) => {
                console.log(er);
            },
        });
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Button onClick={handleAdd} className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            Tambah ATK
                        </Button>
                    </div>
                </div>

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
                                        <TableHead>Kode ATK</TableHead>
                                        <TableHead>Nama ATK</TableHead>
                                        <TableHead>Kategori</TableHead>
                                        <TableHead>Satuan</TableHead>
                                        <TableHead className="text-right">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredItems.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="py-4 text-center text-gray-500">
                                                Tidak ada data ATK yang ditemukan
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredItems.map((item: any) => (
                                            <TableRow key={item.id}>
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
                                                            value={editData.unit}
                                                            onValueChange={(value) => setEditData({ ...editData, unit: value })}
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
                                                        <span className="text-sm text-gray-600">{item.unit}</span>
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
                    </CardContent>
                </Card>

                {/* Add Dialog */}
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Tambah ATK Baru</DialogTitle>
                            <DialogDescription>Tambahkan item ATK baru ke dalam sistem.</DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="name">Kode ATK</Label>
                                <Input
                                    id="kode_atk"
                                    value={formData.kode_atk}
                                    onChange={(e) => setFormData({ ...formData, kode_atk: e.target.value })}
                                    required
                                    autoFocus
                                />
                            </div>

                            <div>
                                <Label htmlFor="name">Nama ATK</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="category">Kategori</Label>
                                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih kategori" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Alat Tulis">Alat Tulis</SelectItem>
                                        <SelectItem value="Kertas">Kertas</SelectItem>
                                        <SelectItem value="Alat Kantor">Alat Kantor</SelectItem>
                                        <SelectItem value="Elektronik">Elektronik</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label htmlFor="unit">Satuan</Label>
                                <Select value={formData.unit} onValueChange={(value) => setFormData({ ...formData, unit: value })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih satuan" />
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
                            </div>

                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
                                    Batal
                                </Button>
                                <Button type="submit">Tambah ATK</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

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
