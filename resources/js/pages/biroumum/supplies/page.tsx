'use client';

import { BottomNavigation } from '@/components/biroumum/bottom-navigation';
import { PageHeader } from '@/components/biroumum/page-header';
import { SuccessAlert } from '@/components/biroumum/success-alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import type { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { Calendar, Clock, PenTool, Zap } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';

export default function SuppliesRequest() {
    const { auth } = usePage<SharedData>().props;
    const [formData, setFormData] = useState({
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
        console.log(formData);

        e.preventDefault();
        setShowSuccess(true);
        setTimeout(() => {
            setShowSuccess(false);
        }, 3000);
    };

    const urgencyOptions = [
        {
            value: 'normal',
            label: 'Normal',
            description: '1-2 minggu',
            icon: Calendar,
            color: 'bg-green-50 border-green-200 text-green-800',
            selectedColor: 'bg-green-100 border-green-400',
            iconColor: 'text-green-600',
        },
        {
            value: 'mendesak',
            label: 'Mendesak',
            description: '4-6 hari',
            icon: Clock,
            color: 'bg-yellow-50 border-yellow-200 text-yellow-800',
            selectedColor: 'bg-yellow-100 border-yellow-400',
            iconColor: 'text-yellow-600',
        },
        {
            value: 'segera',
            label: 'Segera',
            description: '1-2 hari',
            icon: Zap,
            color: 'bg-red-50 border-red-200 text-red-800',
            selectedColor: 'bg-red-100 border-red-400',
            iconColor: 'text-red-600',
        },
    ];

    return (
        <div className="mx-auto min-h-screen w-full max-w-md bg-gray-50">
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
                                    <Label htmlFor="name">Nama Pelapor</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        readOnly
                                        value={auth?.user.name}
                                        className="cursor-not-allowed border border-gray-300 bg-gray-100 text-gray-500"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="unitkerja">Unit Kerja</Label>
                                    <Input
                                        id="unitkerja"
                                        type="text"
                                        value={auth?.user.unit_kerja}
                                        readOnly
                                        className="cursor-not-allowed border border-gray-300 bg-gray-100 text-gray-500"
                                    />
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
                                    <Button type="button" variant="outline" size="sm" onClick={addItem} className="mt-2 bg-transparent">
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

                                {/* Creative Urgency Selection - Card Style */}
                                <div>
                                    <Label className="text-base font-medium">Tingkat Urgensi</Label>
                                    <div className="mt-3 space-y-3">
                                        {urgencyOptions.map((option) => {
                                            const Icon = option.icon;
                                            const isSelected = formData.urgency === option.value;

                                            return (
                                                <div
                                                    key={option.value}
                                                    onClick={() => setFormData({ ...formData, urgency: option.value })}
                                                    className={cn(
                                                        'relative cursor-pointer rounded-lg border-2 p-4 transition-all duration-200 hover:shadow-md',
                                                        isSelected ? option.selectedColor : option.color,
                                                    )}
                                                >
                                                    <div className="flex items-center space-x-3">
                                                        <div className={cn('rounded-full p-2', isSelected ? 'bg-white/50' : 'bg-white/30')}>
                                                            <Icon className={cn('h-5 w-5', option.iconColor)} />
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex items-center justify-between">
                                                                <h3 className="font-semibold">{option.label}</h3>
                                                                {isSelected && <div className="h-2 w-2 rounded-full bg-current"></div>}
                                                            </div>
                                                            <p className="text-sm opacity-75">{option.description}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
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
