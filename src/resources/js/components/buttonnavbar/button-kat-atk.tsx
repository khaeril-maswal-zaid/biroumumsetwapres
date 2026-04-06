'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { router } from '@inertiajs/react';
import { DialogTrigger } from '@radix-ui/react-dialog';
import { Plus } from 'lucide-react';
import { useState } from 'react';

export default function ButtonKatAtk() {
    const { toast } = useToast();

    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '' });

    const handleCreate = () => {
        if (!formData.name) {
            toast({
                title: 'Berhasil',
                description: 'Nama Kategori ATK harus diisi!',
            });
            return;
        }

        router.post(route('kategoriatk.store'), formData, {
            onSuccess: () => {
                resetForm();
                toast({
                    title: 'Berhasil',
                    description: 'Kategori ATK berhasil ditambahkan!',
                });
                setIsAddDialogOpen(false);
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
        setFormData({ name: '' });
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
                        <DialogTitle>Tambah Kategori ATK</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                        <div>
                            <Label htmlFor="add-name">Nama Kategori</Label>
                            <Input
                                className="mt-1"
                                id="add-name"
                                placeholder="Contoh: Amplop"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
