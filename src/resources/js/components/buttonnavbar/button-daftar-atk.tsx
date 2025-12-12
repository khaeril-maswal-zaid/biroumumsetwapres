'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { router, usePage } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';

export default function ButtonAtk() {
    const { kategoriAtk } = usePage().props;

    const [isAddOpen, setIsAddOpen] = useState(false);
    const [formData, setFormData] = useState({
        kode_atk: '',
        name: '',
        category: '',
        satuan: '',
    });

    const handleAdd = () => {
        setFormData({
            kode_atk: '',
            name: '',
            category: '',
            satuan: '',
        });
        setIsAddOpen(true);
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
                    satuan: '',
                });
            },
            onError: (er) => {
                console.log(er);
            },
        });
    };

    return (
        <>
            <Button onClick={handleAdd} className="flex items-center gap-2">
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
                            <Label htmlFor="name">Kode ATK</Label>
                            <Input
                                className="mt-1"
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
                                className="mt-1"
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="category">Kategori</Label>
                            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                                <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="Pilih kategori" />
                                </SelectTrigger>
                                <SelectContent>
                                    {kategoriAtk.map((kategori: string) => (
                                        <SelectItem key={kategori} value={kategori}>
                                            {kategori}
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

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
                                Batal
                            </Button>
                            <Button type="submit">Tambah ATK</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
