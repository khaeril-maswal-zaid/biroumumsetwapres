'use client';

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
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Edit, Plus, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface DamageCategory {
    id: string;
    name: string;
    kode_kerusakan: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function DamageCategoriesPage({ kategoriKerusakan }: any) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<DamageCategory | null>(null);
    const [formData, setFormData] = useState({ name: '', kode_kerusakan: '' });

    const filteredCategories = kategoriKerusakan.data.filter(
        (category: any) =>
            category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            category.kode_kerusakan.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const handleAdd = () => {
        if (!formData.name || !formData.kode_kerusakan) {
            toast.error('Semua field harus diisi!');
            return;
        }

        // Check if code already exists
        if (filteredCategories.some((cat: any) => cat.kode_kerusakan === formData.kode_kerusakan)) {
            toast.error('Kode kerusakan sudah ada!');
            return;
        }

        router.post(route('daftarkerusakan.store'), formData, {
            onSuccess: () => {
                setFormData({ name: '', kode_kerusakan: '' });
                setIsAddDialogOpen(false);
                toast.success('Kategori kerusakan berhasil ditambahkan!');
            },
            onError: (er) => {
                console.log(er);
            },
        });
    };

    const handleEdit = (category: DamageCategory) => {
        setEditingCategory(category);
        setFormData({ name: category.name, kode_kerusakan: category.kode_kerusakan });
    };

    const handleUpdate = () => {
        if (!formData.name || !formData.kode_kerusakan) {
            toast.error('Semua field harus diisi!');
            return;
        }

        // Check if code already exists (excluding current item)
        if (filteredCategories.some((cat: any) => cat.kode_kerusakan === formData.kode_kerusakan && cat.id !== editingCategory?.id)) {
            toast.error('Kode kerusakan sudah ada!');
            return;
        }

        router.put(route('daftarkerusakan.update', editingCategory?.id), formData, {
            onSuccess: () => {
                setEditingCategory(null);
                setFormData({ name: '', kode_kerusakan: '' });
                toast.success('Kategori kerusakan berhasil diperbarui!');
                setIsEditDialogOpen(false);
            },
            onError: (er) => {
                console.log(er);
            },
        });
    };

    const handleDelete = (id: string) => {
        router.delete(route('daftarkerusakan.destroy', id), {
            onSuccess: () => {
                toast.success('Kategori kerusakan berhasil dihapus!');
            },
            onError: (er) => {
                console.log(er);
            },
        });
    };

    const resetForm = () => {
        setFormData({ name: '', kode_kerusakan: '' });
        setEditingCategory(null);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Manajemen Kategori Kerusakan</h1>
                        <p className="mt-1 text-gray-600">Kelola kategori kerusakan untuk sistem pelaporan</p>
                    </div>

                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-blue-600 hover:bg-blue-700">
                                <Plus className="mr-2 h-4 w-4" />
                                Tambah Kategori
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Tambah Kategori Kerusakan</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 pt-4">
                                <div>
                                    <Label htmlFor="name">Nama Kategori</Label>
                                    <Input
                                        id="name"
                                        placeholder="Masukkan nama kategori"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="code">Kode Kerusakan</Label>
                                    <Input
                                        id="code"
                                        placeholder="Contoh: ELK001"
                                        value={formData.kode_kerusakan}
                                        onChange={(e) => setFormData({ ...formData, kode_kerusakan: e.target.value.toUpperCase() })}
                                    />
                                </div>
                                <div className="flex justify-end gap-2 pt-4">
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setIsAddDialogOpen(false);
                                            resetForm();
                                        }}
                                    >
                                        Batal
                                    </Button>
                                    <Button onClick={handleAdd}>Tambah</Button>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Search & Stats Row */}
                <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
                    <div className="relative max-w-md">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                        <Input
                            placeholder="Cari kategori atau kode..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    <div className="flex gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                            <span>Total: {filteredCategories.length}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-green-500"></div>
                            <span>Ditampilkan: {filteredCategories.length}</span>
                        </div>
                    </div>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {filteredCategories.map((category: any) => (
                        <Card key={category.id} className="gap-0 border-l-4 border-l-red-500 py-0 transition-shadow duration-200 hover:shadow-md">
                            <CardContent className="p-4">
                                <div className="mb-3 flex items-start justify-between">
                                    <div className="flex-1">
                                        <h3 className="mb-2 text-sm leading-tight font-medium text-gray-900">{category.name}</h3>
                                        <Badge variant="outline" className="border-red-200 bg-red-50 text-xs text-red-700">
                                            {category.kode_kerusakan}
                                        </Badge>
                                    </div>
                                    <div className="ml-2 flex gap-1">
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="h-7 w-7 p-0 hover:bg-blue-100"
                                            onClick={() => {
                                                handleEdit(category);
                                                setIsEditDialogOpen(true);
                                            }}
                                        >
                                            <Edit className="h-3.5 w-3.5 text-blue-600" />
                                        </Button>

                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button size="sm" variant="ghost" className="h-7 w-7 p-0 hover:bg-red-100">
                                                    <Trash2 className="h-3.5 w-3.5 text-red-600" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Hapus Kategori</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Apakah Anda yakin ingin menghapus kategori "{category.name}"? Tindakan ini tidak dapat
                                                        dibatalkan.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Batal</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() => handleDelete(category.id)}
                                                        className="bg-red-600 hover:bg-red-700"
                                                    >
                                                        Hapus
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Empty State */}
                {filteredCategories.length === 0 && (
                    <div className="py-12 text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                            <Search className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="mb-2 text-lg font-medium text-gray-900">
                            {searchTerm ? 'Tidak ada hasil pencarian' : 'Belum ada kategori kerusakan'}
                        </h3>
                        <p className="mb-4 text-gray-600">
                            {searchTerm
                                ? `Tidak ditemukan kategori dengan kata kunci "${searchTerm}"`
                                : 'Mulai dengan menambahkan kategori kerusakan pertama'}
                        </p>
                        {searchTerm && (
                            <Button variant="outline" onClick={() => setSearchTerm('')}>
                                Hapus Filter
                            </Button>
                        )}
                    </div>
                )}

                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Kategori Kerusakan</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                            <div>
                                <Label htmlFor="edit-name">Nama Kategori</Label>
                                <Input
                                    id="edit-name"
                                    placeholder="Masukkan nama kategori"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <Label htmlFor="edit-code">Kode Kerusakan</Label>
                                <Input
                                    id="edit-code"
                                    placeholder="Contoh: ELK001"
                                    value={formData.kode_kerusakan}
                                    readOnly
                                    className="cursor-default bg-gray-100 text-gray-600"
                                />
                            </div>
                            <div className="flex justify-end gap-2 pt-4">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setIsEditDialogOpen(false);
                                        resetForm();
                                    }}
                                >
                                    Batal
                                </Button>
                                <Button onClick={handleUpdate}>Simpan</Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
