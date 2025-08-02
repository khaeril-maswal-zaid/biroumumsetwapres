'use client';

import { BottomNavigation } from '@/components/biroumum/bottom-navigation';
import { PageHeader } from '@/components/biroumum/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import type { SharedData } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Head, router, usePage } from '@inertiajs/react';
import { AlertCircle, AlertOctagon, AlertTriangle, CheckCircle2, PenTool } from 'lucide-react';
import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import * as z from 'zod';

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ChevronsUpDown } from 'lucide-react';

// Skema validasi
const FormSchema = z.object({
    items: z
        .array(
            z.object({
                id: z.string().min(1, 'Nama barang wajib diisi'),
                name: z.string().min(1),
                requested: z.coerce.number().min(1, 'Jumlah minimal 1'),
                approved: z.coerce.number(),
                unit: z.string().min(1, 'Satuan wajib dipilih'),
            }),
        )
        .min(1, 'Minimal satu barang harus dipilih'),
    justification: z.string().min(1, 'Keterangan tidak boleh kosong'),
    urgency: z.string().min(1, 'Pilih tingkat urgensi'),
    unit_kerja: z.string().min(1, 'Unit Kerja wajib diisi'),
    contact: z.string().min(1, 'Narahubung wajib diisi'),
});

const urgencyOptions = [
    {
        value: 'normal' as const,
        label: 'Normal',
        description: 'Kebutuhan biasa',
        detail: 'Dapat ditangani dalam 1-2 minggu',
        icon: AlertCircle,
        color: 'bg-green-50 border-green-200 text-green-800',
        selectedColor: 'bg-green-100 border-green-400 shadow-green-100',
        iconColor: 'text-green-600',
        badgeColor: 'bg-green-500',
    },
    {
        value: 'segera' as const,
        label: 'Segera',
        description: 'Kebutuhan cukup penting',
        detail: 'Perlu ditangani dalam 3-5 hari',
        icon: AlertTriangle,
        color: 'bg-yellow-50 border-yellow-200 text-yellow-800',
        selectedColor: 'bg-yellow-100 border-yellow-400 shadow-yellow-100',
        iconColor: 'text-yellow-600',
        badgeColor: 'bg-yellow-500',
    },
    {
        value: 'mendesak' as const,
        label: 'Mendesak',
        description: 'Prioritas sangat tinggi',
        detail: 'Harus segera ditangani hari ini/ besok',
        icon: AlertOctagon,
        color: 'bg-red-50 border-red-200 text-red-800',
        selectedColor: 'bg-red-100 border-red-400 shadow-red-100',
        iconColor: 'text-red-600',
        badgeColor: 'bg-red-500',
    },
];

type FormData = z.infer<typeof FormSchema>;

export default function SuppliesRequest({ availableATK, unitKerja }: any) {
    const { auth } = usePage<SharedData>().props;
    const {
        register,
        handleSubmit,
        control,
        setValue,
        watch,
        reset,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            items: [{ id: '', name: '', requested: 0, approved: 0, unit: '' }],
            justification: '',
            urgency: '',
            contact: '',
            unit_kerja: '',
        },
    });

    const { fields, append, remove, update } = useFieldArray({ control, name: 'items' });
    const items = watch('items');
    const selectedUrgency = watch('urgency');

    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [openComboboxes, setOpenComboboxes] = useState<Record<number, boolean>>({});

    const getAvailableOptions = (index: number) => {
        const selectedIds = items.map((it, i) => (i !== index ? it.id : null)).filter(Boolean);
        return availableATK.filter((atk: any) => !selectedIds.includes(atk.id));
    };

    const onSubmit = (data: FormData) => {
        router.post(route('permintaanatk.store'), data, {
            onError: (e) => console.log(e),
            onSuccess: () => {
                setShowSuccessDialog(true);
                reset();
            },
        });
    };

    return (
        <>
            <Head title="Permintaan Alat Kantor" />
            <div className="mx-auto min-h-screen w-full max-w-md bg-gray-50">
                <div className="space-y-6 p-4 pb-20 md:pb-0">
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
                                {/* Nama & Unit Kerja */}
                                <div>
                                    <Label>Nama Pengaju</Label>
                                    <Input readOnly value={auth.user.name} className="mt-1 cursor-not-allowed bg-gray-100 text-gray-500" />
                                </div>
                                <div>
                                    <Label htmlFor="unitkerja">Unit Kerja</Label>
                                    <Select
                                        onValueChange={(value) => setValue('unit_kerja', value, { shouldValidate: true })}
                                        value={watch('unit_kerja')}
                                    >
                                        <SelectTrigger className="mt-0.5" id="unitkerja">
                                            <SelectValue placeholder="Pilih unit kerja" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Unit Kerja</SelectLabel>
                                                {unitKerja.map((item, index) => (
                                                    <SelectItem key={index} value={item}>
                                                        {item}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    {errors.unit_kerja && <p className="mt-1 text-sm text-red-500">{errors.unit_kerja.message}</p>}
                                </div>

                                {/* Daftar Barang */}
                                <div>
                                    <Label>Daftar Barang</Label>
                                    {fields.map((field, index) => {
                                        const sel = field;

                                        const opts = getAvailableOptions(index);
                                        return (
                                            <div key={field.id} className="mt-1 space-y-2">
                                                <div className="grid grid-cols-12 gap-2">
                                                    {/* Pilih ATK */}
                                                    <div className="col-span-6">
                                                        <Popover
                                                            open={openComboboxes[index]}
                                                            onOpenChange={(o) => setOpenComboboxes({ ...openComboboxes, [index]: o })}
                                                        >
                                                            <PopoverTrigger asChild>
                                                                <Button variant="outline" className="w-full justify-between">
                                                                    {sel.name || 'Pilih ATK...'}
                                                                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                                                                </Button>
                                                            </PopoverTrigger>
                                                            <PopoverContent align="start" className="w-full p-0">
                                                                <Command>
                                                                    <CommandInput placeholder="Cari ATK..." />
                                                                    <CommandList>
                                                                        <CommandEmpty>Tidak ada ATK ditemukan.</CommandEmpty>
                                                                        <CommandGroup>
                                                                            {opts.map((atk: any) => (
                                                                                <CommandItem
                                                                                    key={atk.id}
                                                                                    onSelect={() => {
                                                                                        update(index, {
                                                                                            id: String(atk.id),
                                                                                            name: atk.name,
                                                                                            unit: atk.unit,
                                                                                            requested: field.requested || 1,
                                                                                            approved: 0,
                                                                                        });

                                                                                        setOpenComboboxes({ ...openComboboxes, [index]: false });
                                                                                    }}
                                                                                >
                                                                                    <Check
                                                                                        className={cn(
                                                                                            'mr-2 h-4 w-4',
                                                                                            sel.id === atk.id ? 'opacity-100' : 'opacity-0',
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
                                                        {/* Hidden RHF fields */}
                                                        <input type="hidden" {...register(`items.${index}.id`)} />
                                                        <input type="hidden" {...register(`items.${index}.name`)} />
                                                        <input type="hidden" {...register(`items.${index}.unit`)} />
                                                    </div>

                                                    {/* Jumlah */}
                                                    <div className="col-span-3">
                                                        <Input
                                                            type="number"
                                                            placeholder="Jumlah"
                                                            {...register(`items.${index}.requested` as const)}
                                                            min={1}
                                                            disabled={!sel.id}
                                                        />
                                                    </div>

                                                    {/* Satuan */}
                                                    <div className="col-span-2">
                                                        <Input readOnly value={sel.unit} placeholder="Satuan" />
                                                    </div>

                                                    {/* Hapus item */}
                                                    <div className="col-span-1 flex items-center">
                                                        {fields.length > 1 && (
                                                            <Button variant="outline" size="sm" onClick={() => remove(index)}>
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
                                        onClick={() => append({ id: '', name: '', requested: 0, approved: 0, unit: '' })}
                                        disabled={fields.length >= availableATK.length}
                                        className="mt-2"
                                    >
                                        + Tambah Barang
                                    </Button>
                                    {errors.items && <p className="mt-1 text-sm text-red-600">{errors.items.message}</p>}
                                </div>

                                {/* Justifikasi */}
                                <div>
                                    <Label>Keterangan</Label>
                                    <Textarea
                                        {...register('justification')}
                                        placeholder="Jelaskan alasan kebutuhan..."
                                        className={`mt-1 ${cn(errors.justification && 'border-red-500')}`}
                                    />
                                </div>

                                {/* Urgensi */}
                                <div>
                                    <Label className="text-base font-medium">Tingkat Urgensi</Label>
                                    <div className="mt-3 space-y-3">
                                        {urgencyOptions.map((opt) => {
                                            const isSel = selectedUrgency === opt.value;
                                            const Icon = opt.icon;
                                            return (
                                                <div
                                                    key={opt.value}
                                                    onClick={() => setValue('urgency', opt.value)}
                                                    className={cn(
                                                        'cursor-pointer rounded-lg border-2 p-3 transition-all',
                                                        isSel ? opt.selectedColor : opt.color,
                                                    )}
                                                >
                                                    <div className="flex items-center space-x-3">
                                                        <div className={cn('rounded-full p-2', isSel ? 'bg-white/50' : 'bg-white/30')}>
                                                            <Icon className={cn('h-5 w-5', opt.iconColor)} />
                                                        </div>

                                                        <div className="min-w-0 flex-1">
                                                            <div className="flex items-center justify-between">
                                                                <h3 className="text-sm font-semibold">{opt.label}</h3>
                                                                {isSel && <div className={cn('h-3 w-3 rounded-full', opt.badgeColor)}></div>}
                                                            </div>
                                                            <p className="mb-1 text-xs opacity-80">{opt.description}</p>
                                                            {/* <p className="text-xs font-medium opacity-60">{opt.detail}</p> */}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        {errors.urgency && <p className="text-sm text-red-600">{errors.urgency.message}</p>}
                                    </div>
                                </div>

                                {/* Narahubung */}
                                <div>
                                    <Label>Narahubung</Label>
                                    <Input
                                        {...register('contact')}
                                        placeholder="Nama dan nomor telepon"
                                        className={`mt-1 ${cn(errors.contact && 'border-red-500')}`}
                                    />
                                </div>

                                <Button type="submit" className="w-full">
                                    Ajukan Permintaan
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
                <BottomNavigation />

                <Dialog open={showSuccessDialog} onOpenChange={() => setShowSuccessDialog(false)}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader className="text-center">
                            <CheckCircle2 className="mb-3.5 h-10 w-10 text-green-600" />
                            <DialogTitle className="text-xl font-semibold text-green-700">Permintaan ATK berhasil diajukan!</DialogTitle>
                        </DialogHeader>
                        <div className="text-center text-sm text-muted-foreground">
                            Klik tombol "Ok" untuk melihat aktivitas dan detail permintaan.
                        </div>
                        <DialogFooter className="mt-4 flex justify-center">
                            <Button onClick={() => router.visit(route('history'))} className="w-full sm:w-auto">
                                OK
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
}
