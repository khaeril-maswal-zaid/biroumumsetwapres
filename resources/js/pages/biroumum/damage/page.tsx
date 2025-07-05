'use client';

import { BottomNavigation } from '@/components/biroumum/bottom-navigation';
import { PageHeader } from '@/components/biroumum/page-header';
import { SuccessAlert } from '@/components/biroumum/success-alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import type { SharedData } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Head, router, usePage } from '@inertiajs/react';
import { AlertCircle, AlertOctagon, AlertTriangle, ImagePlus, Trash2, Wrench } from 'lucide-react';
import type React from 'react';
import { useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
    location: z.string().min(5, 'Lokasi wajib diisi'),
    damageType: z.string().min(3, 'Nama Item wajib diisi'),
    description: z.string().min(5, 'Deskripsi wajib diisi'),
    urgency: z.enum(['rendah', 'sedang', 'tinggi'], {
        required_error: 'Tingkat urgensi wajib dipilih',
    }),
    contact: z
        .string()
        .min(5, 'No Hp wajib diisi')
        .regex(/^(.{5,})$/, 'Format No Hp tidak valid'),
});

type FormData = z.infer<typeof schema>;

export default function DamageReport() {
    const { auth } = usePage<SharedData>().props;
    const [photos, setPhotos] = useState<File[]>([]);
    const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [showSuccess, setShowSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        reset,
    } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const onSubmit = (data: FormData) => {
        router.post(
            route('kerusakangedung.store'),
            { ...data, photos },
            {
                onSuccess: () => {
                    setShowSuccess(true);
                    reset();
                    setPhotos([]);
                    setPhotoPreviews([]);
                },
            },
        );
    };

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            if (photos.length >= 2) {
                alert('Maksimal 2 foto yang dapat diunggah');
                return;
            }
            const file = e.target.files[0];
            setPhotos((prev) => [...prev, file]);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreviews((prev) => [...prev, reader.result as string]);
            };
            reader.readAsDataURL(file);
        }
    };

    const removePhoto = (index: number) => {
        const newPhotos = [...photos];
        const newPreviews = [...photoPreviews];
        newPhotos.splice(index, 1);
        newPreviews.splice(index, 1);
        setPhotos(newPhotos);
        setPhotoPreviews(newPreviews);
    };

    const triggerFileInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const urgencyOptions = [
        {
            value: 'rendah' as const,
            label: 'Prioritas Rendah',
            description: 'Tidak mengganggu aktivitas',
            detail: 'Dapat ditangani dalam 1-2 minggu',
            icon: AlertCircle,
            color: 'bg-green-50 border-green-200 text-green-800',
            selectedColor: 'bg-green-100 border-green-400 shadow-green-100',
            iconColor: 'text-green-600',
            badgeColor: 'bg-green-500',
        },
        {
            value: 'sedang' as const,
            label: 'Prioritas Sedang',
            description: 'Sedikit mengganggu aktivitas',
            detail: 'Perlu ditangani dalam 3-5 hari',
            icon: AlertTriangle,
            color: 'bg-yellow-50 border-yellow-200 text-yellow-800',
            selectedColor: 'bg-yellow-100 border-yellow-400 shadow-yellow-100',
            iconColor: 'text-yellow-600',
            badgeColor: 'bg-yellow-500',
        },
        {
            value: 'tinggi' as const,
            label: 'Prioritas Tinggi',
            description: 'Sangat mengganggu aktivitas',
            detail: 'Harus segera ditangani hari ini/ besok',
            icon: AlertOctagon,
            color: 'bg-red-50 border-red-200 text-red-800',
            selectedColor: 'bg-red-100 border-red-400 shadow-red-100',
            iconColor: 'text-red-600',
            badgeColor: 'bg-red-500',
        },
    ];

    return (
        <>
            <Head title="Laporan Kerusakan Gedung" />
            <div className="mx-auto min-h-screen w-full max-w-md bg-gray-50">
                <div className="pb-20">
                    <div className="space-y-6 p-4">
                        <PageHeader title="Laporan Kerusakan Gedung" backUrl="/" />
                        <SuccessAlert show={showSuccess} message="Laporan kerusakan berhasil dikirim!" />
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Wrench className="h-5 w-5" />
                                    <span>Form Laporan Kerusakan</span>
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
                                    <div>
                                        <Label htmlFor="location">Lokasi Kerusakan</Label>
                                        <Input id="location" {...register('location')} className={errors.location && 'border-red-500'} />
                                        {errors.location && <p className="mt-1 text-sm text-red-500">{errors.location.message}</p>}
                                    </div>
                                    <div>
                                        <Label htmlFor="damageType">Nama Item Rusak</Label>
                                        <Input id="damageType" {...register('damageType')} className={errors.damageType && 'border-red-500'} />
                                        {errors.damageType && <p className="mt-1 text-sm text-red-500">{errors.damageType.message}</p>}
                                    </div>
                                    <div>
                                        <Label htmlFor="description">Deskripsi Kerusakan</Label>
                                        <Textarea id="description" {...register('description')} className={errors.description && 'border-red-500'} />
                                        {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>}
                                    </div>
                                    <div>
                                        <Label>Foto Kerusakan (Maks. 2 foto)</Label>
                                        <div className="mt-2 grid grid-cols-2 gap-4">
                                            {photoPreviews.map((preview, index) => (
                                                <div key={index} className="relative">
                                                    <div className="relative aspect-square overflow-hidden rounded-md border">
                                                        <img
                                                            src={preview || '/placeholder.svg'}
                                                            alt={`Foto kerusakan ${index + 1}`}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="icon"
                                                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                                                        onClick={() => removePhoto(index)}
                                                    >
                                                        <Trash2 className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            ))}
                                            {photos.length < 2 && (
                                                <div
                                                    className="flex aspect-square cursor-pointer items-center justify-center rounded-md border border-dashed hover:bg-gray-50"
                                                    onClick={triggerFileInput}
                                                >
                                                    <div className="flex flex-col items-center space-y-2">
                                                        <ImagePlus className="h-8 w-8 text-gray-400" />
                                                        <span className="text-xs text-gray-500">Tambah Foto</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                                    </div>

                                    {/* Creative Urgency Selection */}
                                    <div>
                                        <Label className="text-base font-medium">Tingkat Urgensi</Label>
                                        <Controller
                                            name="urgency"
                                            control={control}
                                            render={({ field }) => (
                                                <div className="mt-3 space-y-3">
                                                    {urgencyOptions.map((option) => {
                                                        const Icon = option.icon;
                                                        const isSelected = field.value === option.value;

                                                        return (
                                                            <div
                                                                key={option.value}
                                                                onClick={() => field.onChange(option.value)}
                                                                className={cn(
                                                                    'relative cursor-pointer rounded-xl border-2 p-4 transition-all duration-300 hover:shadow-lg',
                                                                    isSelected ? `${option.selectedColor} shadow-lg` : option.color,
                                                                )}
                                                            >
                                                                <div className="flex items-start space-x-4">
                                                                    <div
                                                                        className={cn(
                                                                            'rounded-full p-2.5',
                                                                            isSelected ? 'bg-white/60' : 'bg-white/40',
                                                                        )}
                                                                    >
                                                                        <Icon className={cn('h-6 w-6', option.iconColor)} />
                                                                    </div>
                                                                    <div className="min-w-0 flex-1">
                                                                        <div className="mb-1 flex items-center justify-between">
                                                                            <h3 className="text-sm font-semibold">{option.label}</h3>
                                                                            {isSelected && (
                                                                                <div className={cn('h-3 w-3 rounded-full', option.badgeColor)}></div>
                                                                            )}
                                                                        </div>
                                                                        <p className="mb-1 text-xs opacity-80">{option.description}</p>
                                                                        <p className="text-xs font-medium opacity-60">{option.detail}</p>
                                                                    </div>
                                                                </div>
                                                                {isSelected && (
                                                                    <div className="pointer-events-none absolute inset-0 rounded-xl border-2 border-current opacity-20"></div>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        />
                                        {errors.urgency && <p className="mt-2 text-sm text-red-500">{errors.urgency.message}</p>}
                                    </div>

                                    <div>
                                        <Label htmlFor="contact">No Hp</Label>
                                        <Input id="contact" {...register('contact')} className={errors.contact && 'border-red-500'} />
                                        {errors.contact && <p className="mt-1 text-sm text-red-500">{errors.contact.message}</p>}
                                    </div>
                                    <Button type="submit" className="w-full">
                                        Kirim Laporan
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
