'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { router } from '@inertiajs/react';
import { DialogTrigger } from '@radix-ui/react-dialog';
import { Plus, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function ButtonKatKerusakan() {
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', kode_kerusakan: '', sub_kategori: [] as string[] });

    const handleAddSubKategori = () => {
        if (newSubItem.trim()) {
            setFormData({
                ...formData,
                sub_kategori: [...(formData.sub_kategori || []), newSubItem.trim()],
            });
            setNewSubItem('');
        }
    };

    const [newSubItem, setNewSubItem] = useState('');

    const handleRemoveSubKategori = (index: number) => {
        setFormData({
            ...formData,
            sub_kategori: formData.sub_kategori?.filter((_, i) => i !== index) || [],
        });
    };

    const handleCreate = () => {
        if (!formData.name || !formData.kode_kerusakan) {
            toast.error('Nama dan Kode Kerusakan harus diisi!');
            return;
        }

        router.post(route('daftarkerusakan.store'), formData, {
            onSuccess: () => {
                resetForm();
                toast.success('Kategori kerusakan berhasil ditambahkan!');
                setIsAddDialogOpen(false);
            },
            onError: (er) => {
                console.log(er);
                toast.error('Gagal menambahkan kategori kerusakan');
            },
        });
    };

    const resetForm = () => {
        setFormData({ name: '', kode_kerusakan: '', sub_kategori: [] });
    };

    return (
        <>
            {/* Add Dialog */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="mr-2 h-4 w-4" />
                        Tambah Kategori
                    </Button>
                </DialogTrigger>

                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Tambah Kategori Kerusakan</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                        <div>
                            <Label htmlFor="add-name">Nama Kategori</Label>
                            <Input
                                className="mt-1"
                                id="add-name"
                                placeholder="Contoh: Tata Udara"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label htmlFor="add-code">Kode Kerusakan</Label>
                            <Input
                                id="add-code"
                                placeholder="Contoh: TU-051"
                                value={formData.kode_kerusakan}
                                onChange={(e) => setFormData({ ...formData, kode_kerusakan: e.target.value })}
                            />
                        </div>

                        {/* Sub Kategori Input */}
                        <div>
                            <Label htmlFor="sub-item">Tambah Sub Kategori</Label>
                            <div className="mt-2 flex gap-2">
                                <Input
                                    id="sub-item"
                                    placeholder="Contoh: AC"
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
                                <Label className="text-xs">Sub Kategori yang ditambahkan:</Label>
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
                                    setIsAddDialogOpen(false);
                                    resetForm();
                                }}
                            >
                                Batal
                            </Button>
                            <Button onClick={handleCreate} className="bg-blue-600 hover:bg-blue-700">
                                Simpan
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
