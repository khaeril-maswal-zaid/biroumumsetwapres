'use client';

import ButtonKatAtk from '@/components/buttonnavbar/button-kat-atk';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Edit, Search } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Kategori ATK',
        href: '/dashboard',
    },
];

export default function ATKItemsManagement({ categoriesAtk }: any) {
    const { toast } = useToast();

    const [searchTerm, setSearchTerm] = useState('');

    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<any | null>(null);
    const [formData, setFormData] = useState({
        nama_kategori: '',
        kode_kategori: '',
    });

    const filteredCategories = categoriesAtk.filter(
        (category: any) =>
            category.nama_kategori.toLowerCase().includes(searchTerm.toLowerCase()) ||
            category.kode_kategori.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const handleEdit = (category: any) => {
        setEditingCategory(category);
        setFormData({
            nama_kategori: category.nama_kategori,
            kode_kategori: category.kode_kategori,
        });
    };

    const handleUpdate = () => {
        if (!formData.nama_kategori || !formData.kode_kategori) {
            toast({
                title: 'Validasi gagal',
                description: 'Semua field harus diisi!',
                variant: 'destructive',
            });
            return;
        }

        // Check if code already exists (excluding current item)
        if (filteredCategories.some((cat: any) => cat.kode_kategori === formData.kode_kategori && cat.id !== editingCategory?.id)) {
            toast({
                title: 'Gagal',
                description: 'Kode kategori sudah ada!',
                variant: 'destructive',
            });
            return;
        }

        router.put(route('kategoriatk.update', editingCategory?.id), formData, {
            onSuccess: () => {
                setEditingCategory(null);
                resetForm();
                toast({
                    title: 'Berhasil Diperbarui',
                    description: 'Kategori kerusakan berhasil diperbarui!',
                    variant: 'default',
                });
                setIsEditDialogOpen(false);
            },
            onError: (er) => {
                toast({
                    title: 'Validasi gagal',
                    description: Object.values(er)[0],
                    variant: 'destructive',
                });
            },
        });
    };

    const resetForm = () => {
        setFormData({ nama_kategori: '', kode_kategori: '' });
        setEditingCategory(null);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs} Button={ButtonKatAtk}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl bg-linear-to-br from-white to-blue-100 p-4">
                {/* Categories Grid */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                    {categoriesAtk.map((category: any) => (
                        <Card
                            key={category.id}
                            className="gap-2 overflow-hidden border-l-4 border-l-blue-500 px-4 py-3 transition-all duration-200 hover:shadow-lg"
                        >
                            <CardContent className="space-y-4 p-4">
                                {/* Header */}
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h3 className="text-base font-semibold text-gray-900">{category.nama_kategori}</h3>
                                        <Badge variant="outline" className="mt-2 border-blue-200 bg-blue-50 text-xs text-blue-700">
                                            {category.kode_kategori}
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
                                            <Edit className="h-4 w-4 text-blue-800" />
                                        </Button>
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
                {categoriesAtk.length === 0 && (
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
                                    value={formData.nama_kategori}
                                    onChange={(e) => setFormData({ ...formData, nama_kategori: e.target.value })}
                                />
                            </div>
                            <div>
                                <Label htmlFor="edit-code">Kode Kategori</Label>
                                <Input
                                    id="edit-code"
                                    placeholder="Contoh: TU-051"
                                    value={formData.kode_kategori}
                                    readOnly
                                    className="mt-1 cursor-default bg-gray-100 text-gray-600"
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
