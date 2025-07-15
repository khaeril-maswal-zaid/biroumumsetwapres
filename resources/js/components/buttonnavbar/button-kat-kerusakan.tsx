'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { router } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function ButtonKatKerusakan() {
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', kode_kerusakan: '' });

    const handleAdd = () => {
        if (!formData.name || !formData.kode_kerusakan) {
            toast.error('Semua field harus diisi!');
            return;
        }

        // Check if code already exists
        // if (filteredCategories.some((cat: any) => cat.kode_kerusakan === formData.kode_kerusakan)) {
        //     toast.error('Kode kerusakan sudah ada!');
        //     return;
        // }

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

    const resetForm = () => {
        setFormData({ name: '', kode_kerusakan: '' });
    };

    return (
        <>
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
                                className="mt-1"
                                id="name"
                                placeholder="Masukkan nama kategori"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label htmlFor="code">Kode Kerusakan</Label>
                            <Input
                                className="mt-1"
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
        </>
    );
}
