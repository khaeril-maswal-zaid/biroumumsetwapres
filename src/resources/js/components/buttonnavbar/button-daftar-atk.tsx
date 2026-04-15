'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { router, usePage } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';

export default function ButtonAtk() {
    const { toast } = useToast();

    const { kategoriAtk } = usePage().props;
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        kode_kategori_atk: '',
        satuan: '',
        available_stock: 0,
    });

    const handleAdd = () => {
        setFormData({
            name: '',
            kode_kategori_atk: '',
            satuan: '',
            available_stock: 0,
        });
        setIsAddOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        setIsProcessing(true);
        e.preventDefault();
        router.post(route('daftaratk.store'), formData, {
            onSuccess: () => {
                toast({
                    title: 'Berhasil',
                    description: 'ATK baru berhasil ditambahkan',
                });
                setIsAddOpen(false);
                setFormData({
                    name: '',
                    kode_kategori_atk: '',
                    satuan: '',
                    available_stock: 0,
                });
                setIsProcessing(false);
            },
            onError: (er) => {
                toast({
                    title: 'Validasi gagal',
                    description: Object.values(er)[0],
                    variant: 'destructive',
                });
                setIsProcessing(false);
            },
        });
    };

    return (
        <>
            <Button onClick={handleAdd} className="flex items-center gap-2 bg-white text-indigo-600 shadow-lg hover:bg-indigo-50">
                <Plus className="h-4 w-4" />
                Tambah ATK
            </Button>

            {/* Add Dialog */}
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Tambah ATK Baru</DialogTitle>
                        <DialogDescription>Tambahkan item ATK baru ke dalam sistem.</DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="name">Jenis Barang ATK</Label>
                            <Input
                                className="mt-1"
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="category">Kategori</Label>
                            <Select
                                value={formData.kode_kategori_atk}
                                onValueChange={(value) => setFormData({ ...formData, kode_kategori_atk: value })}
                            >
                                <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="Pilih kategori" />
                                </SelectTrigger>
                                <SelectContent>
                                    {kategoriAtk.map((kategori: any) => (
                                        <SelectItem key={kategori.kode_kategori} value={kategori.kode_kategori}>
                                            {kategori.nama_kategori}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="satuan">Satuan</Label>
                            <Select value={formData.satuan} onValueChange={(value) => setFormData({ ...formData, satuan: value })}>
                                <SelectTrigger className="mt-1">
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

                        <div>
                            <Label htmlFor="available_stock">Batas Atas</Label>
                            <Input
                                className="mt-1"
                                id="available_stock"
                                type=""
                                min={0}
                                value={formData.available_stock}
                                onChange={(e) => setFormData({ ...formData, available_stock: parseInt(e.target.value) })}
                                required
                            />
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
                                Batal
                            </Button>
                            <Button type="submit" disabled={isProcessing}>
                                {isProcessing ? 'Menambahkan...' : 'Tambah ATK'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
