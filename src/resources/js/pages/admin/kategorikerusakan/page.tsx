'use client';

import ButtonKatKerusakan from '@/components/buttonnavbar/button-kat-kerusakan';
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Edit, Plus, Search, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface DamageCategory {
    id: string;
    name: string;
    kode_kerusakan: string;
    kode_unit: string;
    sub_kategori?: string[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manajemen Kategori Kerusakan',
        href: '/dashboard',
    },
];

export default function DamageCategoriesPage({ kategoriKerusakan }: any) {
    const [searchTerm, setSearchTerm] = useState('');

    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<DamageCategory | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        kode_kerusakan: '',
        sub_kategori: [] as string[],
    });
    const [newSubItem, setNewSubItem] = useState('');

    const filteredCategories = kategoriKerusakan.filter(
        (category: any) =>
            category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            category.kode_kerusakan.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const handleAddSubKategori = () => {
        if (newSubItem.trim()) {
            setFormData({
                ...formData,
                sub_kategori: [...(formData.sub_kategori || []), newSubItem.trim()],
            });
            setNewSubItem('');
        }
    };

    const handleRemoveSubKategori = (index: number) => {
        setFormData({
            ...formData,
            sub_kategori: formData.sub_kategori?.filter((_, i) => i !== index) || [],
        });
    };

    const handleEdit = (category: DamageCategory) => {
        setEditingCategory(category);
        setFormData({
            name: category.name,
            kode_kerusakan: category.kode_kerusakan,
            sub_kategori: category.sub_kategori || [],
        });
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
                resetForm();
                toast.success('Kategori kerusakan berhasil diperbarui!');
                setIsEditDialogOpen(false);
            },
            onError: (er) => {
                console.log(er);
                toast.error('Gagal memperbarui kategori kerusakan');
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
        setFormData({ name: '', kode_kerusakan: '', sub_kategori: [] });
        setEditingCategory(null);
        setNewSubItem('');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs} Button={ButtonKatKerusakan}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl bg-linear-to-br from-white to-blue-100 p-4">
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
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredCategories.map((category: any) => (
                        <Card
                            key={category.id}
                            className="gap-2 overflow-hidden border-l-4 border-l-blue-500 px-4 py-3 transition-all duration-200 hover:shadow-lg"
                        >
                            <CardContent className="space-y-4 p-4">
                                {/* Header */}
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h3 className="text-base font-semibold text-gray-900">{category.name}</h3>
                                        <Badge variant="outline" className="mt-2 border-blue-200 bg-blue-50 text-xs text-blue-700">
                                            {category.kode_kerusakan}
                                        </Badge>
                                    </div>
                                    <div className="flex gap-1">
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="h-8 w-8 p-0 hover:bg-blue-100"
                                            onClick={() => {
                                                handleEdit(category);
                                                setIsEditDialogOpen(true);
                                            }}
                                        >
                                            <Edit className="h-4 w-4 text-blue-600" />
                                        </Button>

                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-red-100">
                                                    <Trash2 className="h-4 w-4 text-red-600" />
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

                                {/* Sub Kategori */}
                                {category.sub_kategori && category.sub_kategori.length > 0 && (
                                    <div className="space-y-2 border-t pt-4">
                                        <p className="text-xs font-medium tracking-wide text-gray-600 uppercase">Sub Kategori</p>
                                        <div className="flex flex-wrap gap-2">
                                            {category.sub_kategori.map((sub: string, idx: number) => (
                                                <Badge key={idx} variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100">
                                                    {sub}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
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

                {/* Edit Dialog */}
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>Edit Kategori Kerusakan</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                            <div>
                                <Label htmlFor="edit-name">Nama Kategori</Label>
                                <Input
                                    className="mt-1"
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
                                    placeholder="Contoh: TU-051"
                                    value={formData.kode_kerusakan}
                                    readOnly
                                    className="mt-1 cursor-default bg-gray-100 text-gray-600"
                                />
                            </div>

                            {/* Sub Kategori Input */}
                            <div>
                                <Label htmlFor="edit-sub-item">Tambah Sub Kategori</Label>
                                <div className="mt-2 flex gap-2">
                                    <Input
                                        id="edit-sub-item"
                                        placeholder="Contoh: Exhaust Fan"
                                        value={newSubItem}
                                        onChange={(e) => setNewSubItem(e.target.value)}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                handleAddSubKategori();
                                            }
                                        }}
                                    />
                                    <Button type="button" onClick={handleAddSubKategori} className="bg-green-600 hover:bg-green-700">
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            {/* Sub Kategori List */}
                            {formData.sub_kategori && formData.sub_kategori.length > 0 && (
                                <div className="space-y-2">
                                    <Label className="text-xs">Sub Kategori:</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.sub_kategori.map((sub: string, idx: number) => (
                                            <div
                                                key={idx}
                                                className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-sm text-green-800"
                                            >
                                                {sub}
                                                <button type="button" onClick={() => handleRemoveSubKategori(idx)} className="hover:text-green-900">
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

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
                                <Button onClick={handleUpdate} className="bg-blue-600 hover:bg-blue-700">
                                    Simpan
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
