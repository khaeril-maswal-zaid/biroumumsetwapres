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
import { zodResolver } from '@hookform/resolvers/zod';
import { Head, router, usePage } from '@inertiajs/react';
import { Calendar, Clock, PenTool, Zap } from 'lucide-react';
import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import * as z from 'zod';

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
                name: z.string().min(1, 'Nama barang wajib diisi'),
                quantity: z.string().min(1, 'Jumlah wajib diisi'),
                unit: z.string().min(1, 'Satuan wajib dipilih'),
            }),
        )
        .min(1),
    justification: z.string().min(1, 'Justifikasi tidak boleh kosong'),
    urgency: z.string().min(1, 'Pilih tingkat urgensi'),
    contact: z.string().min(1, 'Narahubung wajib diisi'),
});

export default function SuppliesRequest() {
    const { auth } = usePage<SharedData>().props;
    const [showSuccess, setShowSuccess] = useState(false);

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
            items: [{ name: '', quantity: '', unit: '' }],
            justification: '',
            urgency: '',
            contact: '',
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'items',
    });

    const onSubmit = (data: z.infer<typeof FormSchema>) => {
        console.log(data);

        router.post(
            route('permintaanatk.store'),
            { ...data },
            {
                onError: (errors) => {
                    console.log(errors);
                },

                onSuccess: () => {
                    setShowSuccess(true);
                    reset();
                },
            },
        );
    };

    const selectedUrgency = watch('urgency');

    return (
        <>
            <Head title="Permintaan Alat Kantor" />
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
                                        {fields.map((field, index) => (
                                            <div key={field.id} className="mt-2 grid grid-cols-12 gap-2">
                                                <div className="col-span-5">
                                                    <Input
                                                        placeholder="Nama barang"
                                                        {...register(`items.${index}.name`)}
                                                        className={cn(errors.items?.[index]?.name && 'border-red-500')}
                                                    />
                                                </div>
                                                <div className="col-span-3">
                                                    <Input
                                                        type="number"
                                                        placeholder="Jumlah"
                                                        {...register(`items.${index}.quantity`)}
                                                        className={cn(errors.items?.[index]?.quantity && 'border-red-500')}
                                                    />
                                                </div>
                                                <div className="col-span-3">
                                                    <Select
                                                        onValueChange={(value) => setValue(`items.${index}.unit`, value)}
                                                        value={watch(`items.${index}.unit`)}
                                                    >
                                                        <SelectTrigger className={cn(errors.items?.[index]?.unit && 'border-red-500')}>
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
                                                    {fields.length > 1 && (
                                                        <Button type="button" variant="outline" size="sm" onClick={() => remove(index)}>
                                                            ×
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => append({ name: '', quantity: '', unit: '' })}
                                            className="mt-2 bg-transparent"
                                        >
                                            + Tambah Barang
                                        </Button>
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
            </div>
        </>
    );
}
