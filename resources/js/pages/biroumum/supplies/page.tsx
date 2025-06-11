'use client';

import { BottomNavigation } from '@/components/biroumum/bottom-navigation';
import { DesktopNavigation } from '@/components/biroumum/desktop-navigation';
import { PageHeader } from '@/components/biroumum/page-header';
import { SuccessAlert } from '@/components/biroumum/success-alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { PenTool } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';

export default function SuppliesRequest() {
    const [formData, setFormData] = useState({
        name: '',
        devisi: '',
        items: [{ name: '', quantity: '', unit: '' }],
        justification: '',
        urgency: '',
        contact: '',
    });
    const [showSuccess, setShowSuccess] = useState(false);

    const addItem = () => {
        setFormData({
            ...formData,
            items: [...formData.items, { name: '', quantity: '', unit: '' }],
        });
    };

    const removeItem = (index: number) => {
        const newItems = formData.items.filter((_, i) => i !== index);
        setFormData({ ...formData, items: newItems });
    };

    const updateItem = (index: number, field: string, value: string) => {
        const newItems = formData.items.map((item, i) => (i === index ? { ...item, [field]: value } : item));
        setFormData({ ...formData, items: newItems });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setShowSuccess(true);
        setTimeout(() => {
            setShowSuccess(false);
        }, 3000);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <DesktopNavigation />

            <div className="pb-20 md:pb-0">
                <div className="space-y-6 p-4">
                    <PageHeader title="Permintaan Alat Tulis Kantor" backUrl="/" />

                    <SuccessAlert show={showSuccess} message="Permintaan alat tulis kantor berhasil diajukan!" />

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <PenTool className="h-5 w-5" />
                                <span>Form Permintaan ATK</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <Label htmlFor="name">Nama pengaju</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                        autoFocus
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="devisi">Unit kerja</Label>
                                    <Select value={formData.devisi} onValueChange={(value) => setFormData({ ...formData, devisi: value })}>
                                        <SelectTrigger className="w-[280px]" id="devisi">
                                            <SelectValue placeholder="Pilih Unit kerja" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Biro 1">Biro 1</SelectItem>
                                            <SelectItem value="Biro 2">Biro 2</SelectItem>
                                            <SelectItem value="Biro 3">Biro 3</SelectItem>
                                            <SelectItem value="Biro 4">Biro 4</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label>Daftar Barang</Label>
                                    {formData.items.map((item, index) => (
                                        <div key={index} className="mt-2 grid grid-cols-12 gap-2">
                                            <div className="col-span-5">
                                                <Input
                                                    placeholder="Nama barang"
                                                    value={item.name}
                                                    onChange={(e) => updateItem(index, 'name', e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className="col-span-3">
                                                <Input
                                                    type="number"
                                                    placeholder="Jumlah"
                                                    value={item.quantity}
                                                    onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className="col-span-3">
                                                <Select value={item.unit} onValueChange={(value) => updateItem(index, 'unit', value)}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Satuan" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="pcs">Pcs</SelectItem>
                                                        <SelectItem value="box">Box</SelectItem>
                                                        <SelectItem value="pack">Pack</SelectItem>
                                                        <SelectItem value="rim">Rim</SelectItem>
                                                        <SelectItem value="lusin">Lusin</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="col-span-1">
                                                {formData.items.length > 1 && (
                                                    <Button type="button" variant="outline" size="sm" onClick={() => removeItem(index)}>
                                                        ×
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    <Button type="button" variant="outline" size="sm" onClick={addItem} className="mt-2">
                                        + Tambah Barang
                                    </Button>
                                </div>

                                <div>
                                    <Label htmlFor="justification">Justifikasi Kebutuhan</Label>
                                    <Textarea
                                        id="justification"
                                        placeholder="Jelaskan alasan kebutuhan barang-barang tersebut..."
                                        value={formData.justification}
                                        onChange={(e) => setFormData({ ...formData, justification: e.target.value })}
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="urgency">Tingkat Urgensi</Label>
                                    <RadioGroup
                                        value={formData.urgency}
                                        onValueChange={(value) => setFormData({ ...formData, urgency: value })}
                                        className="mt-2"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="normal" id="normal" />
                                            <Label htmlFor="normal">Normal (1-2 minggu)</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="mendesak" id="mendesak" />
                                            <Label htmlFor="mendesak">Mendesak (3-5 hari)</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="segera" id="segera" />
                                            <Label htmlFor="segera">Segera (1-2 hari)</Label>
                                        </div>
                                    </RadioGroup>
                                </div>

                                <div>
                                    <Label htmlFor="contact">Narahubung</Label>
                                    <Input
                                        id="contact"
                                        placeholder="Nama dan nomor telepon"
                                        value={formData.contact}
                                        onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                                        required
                                    />
                                </div>

                                <Button type="submit" className="w-full">
                                    Ajukan Permintaan
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <BottomNavigation />
        </div>
    );
}
