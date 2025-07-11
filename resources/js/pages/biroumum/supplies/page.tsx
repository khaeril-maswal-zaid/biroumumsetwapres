'use client';

import { BottomNavigation } from '@/components/biroumum/bottom-navigation';
import { PageHeader } from '@/components/biroumum/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import type { SharedData } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Head, router, usePage } from '@inertiajs/react';
import { Calendar, CheckCircle2, Clock, PenTool, Zap } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ChevronsUpDown } from 'lucide-react';

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

// Zod Schema
const FormSchema = z.object({
    items: z
        .array(
            z.object({
                id: z.string().min(1, 'Nama barang wajib diisi'),
                name: z.string().min(3, 'Nama barang wajib diisi'),
                quantity: z.string().min(3, 'Jumlah wajib diisi'),
                unit: z.string().min(3, 'Satuan wajib dipilih'),
            }),
        )
        .min(1),
    justification: z.string().min(1, 'Justifikasi tidak boleh kosong'),
    urgency: z.string().min(1, 'Pilih tingkat urgensi'),
    contact: z.string().min(1, 'Narahubung wajib diisi'),
});

export default function SuppliesRequest({ availableATK }: any) {
    const { auth } = usePage<SharedData>().props;

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
        setValue,
        watch,
    } = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            items: [{ id: '', name: '', quantity: '', unit: '' }],
            justification: '',
            urgency: '',
            contact: '',
        },
    });

    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const handleConfirm = () => {
        setShowSuccessDialog(false);
        router.visit(route('history'));
    };

    const onSubmit = (data: z.infer<typeof FormSchema>) => {
        router.post(
            route('permintaanatk.store'),
            { ...data },
            {
                onError: (errors) => {
                    console.log(errors);
                },
                onSuccess: () => {
                    setShowSuccessDialog(true);
                    reset();
                },
            },
        );
    };

    const [formData, setFormData] = useState({
        name: '',
        devisi: '',
        items: [{ itemId: '', quantity: '', unit: '' }],
        justification: '',
        urgency: '',
        contact: '',
    });

    const [openComboboxes, setOpenComboboxes] = useState<{ [key: number]: boolean }>({});

    const addItem = () => {
        setFormData({
            ...formData,
            items: [...formData.items, { itemId: '', quantity: '', unit: '' }],
        });
    };

    const removeItem = (index: number) => {
        const newItems = formData.items.filter((_, i) => i !== index);
        setFormData({ ...formData, items: newItems });
    };

    const updateItem = (index: number, field: string, value: string) => {
        const newItems = formData.items.map((item, i) => {
            if (i === index) {
                if (field === 'itemId') {
                    // When item is selected, auto-fill the unit
                    const selectedATK = availableATK.find((atk: any) => atk.id === value);
                    return {
                        ...item,
                        [field]: value,
                        unit: selectedATK?.unit || '',
                    };
                }
                return { ...item, [field]: value };
            }
            return item;
        });
        setFormData({ ...formData, items: newItems });
    };

    const getSelectedATK = (itemId: string) => {
        return availableATK.find((atk: any) => atk.id === itemId);
    };

    const getAvailableATK = (currentIndex: number) => {
        // Filter out already selected items (except current item)
        const selectedIds = formData.items.map((item, index) => (index !== currentIndex ? item.itemId : null)).filter(Boolean);

        return availableATK.filter((atk: any) => !selectedIds.includes(atk.id));
    };

    const toggleCombobox = (index: number, isOpen: boolean) => {
        setOpenComboboxes((prev) => ({
            ...prev,
            [index]: isOpen,
        }));
    };

    const selectedUrgency = watch('urgency');

    return (
        <>
            <Head title="Permintaan Alat Kantor" />
            <div className="mx-auto min-h-screen w-full max-w-md bg-gray-50">
                <div className="pb-20 md:pb-0">
                    <div className="space-y-6 p-4">
                        <PageHeader title="Permintaan Alat Tulis Kantor" backUrl="/" />

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <PenTool className="h-5 w-5" />
                                    <span>Form Permintaan ATK</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

                                    {/* Items */}
                                    <div>
                                        <Label>Daftar Barang</Label>
                                        {formData.items.map((item, index) => {
                                            const availableOptions = getAvailableATK(index);
                                            const selectedATK = getSelectedATK(item.itemId);

                                            return (
                                                <div key={index} className="mt-2 space-y-2">
                                                    <div className="grid grid-cols-12 gap-2">
                                                        <div className="col-span-6">
                                                            <Popover
                                                                open={openComboboxes[index] || false}
                                                                onOpenChange={(isOpen) => toggleCombobox(index, isOpen)}
                                                            >
                                                                <PopoverTrigger asChild>
                                                                    <Button
                                                                        variant="outline"
                                                                        role="combobox"
                                                                        aria-expanded={openComboboxes[index] || false}
                                                                        className="w-full justify-between bg-transparent"
                                                                    >
                                                                        {selectedATK ? selectedATK.name : 'Pilih ATK...'}
                                                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                                    </Button>
                                                                </PopoverTrigger>
                                                                <PopoverContent className="w-full p-0" align="start">
                                                                    <Command>
                                                                        <CommandInput placeholder="Cari ATK..." />
                                                                        <CommandList>
                                                                            <CommandEmpty>Tidak ada ATK yang ditemukan.</CommandEmpty>
                                                                            <CommandGroup>
                                                                                {availableOptions.map((atk: any) => (
                                                                                    <CommandItem
                                                                                        key={atk.id}
                                                                                        value={atk.name}
                                                                                        onSelect={() => {
                                                                                            updateItem(index, 'itemId', atk.id);
                                                                                            toggleCombobox(index, false);
                                                                                        }}
                                                                                    >
                                                                                        <Check
                                                                                            className={cn(
                                                                                                'mr-2 h-4 w-4',
                                                                                                item.itemId === atk.id ? 'opacity-100' : 'opacity-0',
                                                                                            )}
                                                                                        />
                                                                                        <div className="flex flex-col">
                                                                                            <span>{atk.name}</span>
                                                                                            <span className="text-xs text-gray-500">
                                                                                                Satuan: {atk.unit}
                                                                                            </span>
                                                                                        </div>
                                                                                    </CommandItem>
                                                                                ))}
                                                                            </CommandGroup>
                                                                        </CommandList>
                                                                    </Command>
                                                                </PopoverContent>
                                                            </Popover>
                                                        </div>
                                                        <div className="col-span-3">
                                                            <Input
                                                                type="number"
                                                                placeholder="Jumlah"
                                                                value={item.quantity}
                                                                onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                                                                min="1"
                                                                required
                                                                disabled={!item.itemId}
                                                            />
                                                        </div>
                                                        <div className="col-span-2">
                                                            <Input value={item.unit} placeholder="Satuan" disabled className="bg-gray-50" />
                                                        </div>
                                                        <div className="col-span-1">
                                                            {formData.items.length > 1 && (
                                                                <Button
                                                                    type="button"
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => removeItem(index)}
                                                                    className="h-full"
                                                                >
                                                                    ×
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}

                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={addItem}
                                            className="mt-2 bg-transparent"
                                            disabled={formData.items.length >= availableATK.length}
                                        >
                                            + Tambah Barang
                                        </Button>

                                        {formData.items.length >= availableATK.length && (
                                            <p className="mt-1 text-sm text-gray-500">Semua ATK yang tersedia sudah dipilih</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="justification">Justifikasi Kebutuhan</Label>
                                        <Textarea
                                            id="justification"
                                            {...register('justification')}
                                            placeholder="Jelaskan alasan kebutuhan barang-barang tersebut..."
                                            className={cn(errors.justification && 'border-red-500')}
                                        />
                                    </div>

                                    {/* Urgency */}
                                    <div>
                                        <Label className="text-base font-medium">Tingkat Urgensi</Label>
                                        <div className="mt-3 space-y-3">
                                            {urgencyOptions.map((option) => {
                                                const Icon = option.icon;
                                                const isSelected = selectedUrgency === option.value;

                                                return (
                                                    <div
                                                        key={option.value}
                                                        onClick={() => setValue('urgency', option.value)}
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
                                            {errors.urgency && <p className="text-sm text-red-600">Pilih tingkat urgensi</p>}
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="contact">Narahubung</Label>
                                        <Input
                                            id="contact"
                                            {...register('contact')}
                                            placeholder="Nama dan nomor telepon"
                                            className={cn(errors.contact && 'border-red-500')}
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

                <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader className="text-center">
                            <div className="flex flex-col items-center justify-center">
                                <CheckCircle2 className="mb-3.5 h-10 w-10 text-green-600" />
                                <DialogTitle className="text-xl font-semibold text-green-700">Permintaan ATK berhasil diajukan!</DialogTitle>
                            </div>
                        </DialogHeader>
                        <div className="text-center text-sm text-muted-foreground">
                            Klik tombol "Ok" untuk melihat aktivitas dan detail permintaan.
                        </div>
                        <DialogFooter className="mt-4 flex justify-center">
                            <Button onClick={handleConfirm} className="w-full sm:w-auto">
                                OK
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
}
