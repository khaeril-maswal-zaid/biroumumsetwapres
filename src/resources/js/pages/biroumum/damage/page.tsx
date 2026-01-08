'use client';

import { BottomNavigation } from '@/components/biroumum/bottom-navigation';
import { KategoriSelector } from '@/components/biroumum/kategori-kerusakan';
import { PageHeader } from '@/components/biroumum/page-header';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { SharedData } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Head, router, usePage } from '@inertiajs/react';
import { AlertCircle, AlertCircleIcon, AlertOctagon, AlertTriangle, CheckCircle2, ImagePlus, Trash2, Wrench } from 'lucide-react';
import type React from 'react';
import { useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
// import { cn } from '@/lib/utils';

type KategoriKerusakan = {
    kode_kerusakan: string;
    name: string;
};

const schema = z.object({
    location: z
        .string({
            required_error: 'Lokasi wajib diisi',
            invalid_type_error: 'Lokasi harus berupa teks',
        })
        .min(3, 'Lokasi minimal 3 karakter'),

    damageType: z
        .string({
            required_error: 'Nama item wajib diisi',
            invalid_type_error: 'Nama item harus berupa teks',
        })
        .min(3, 'Nama item minimal 3 karakter'),

    kategori: z
        .string({
            required_error: 'Kategori wajib diisi',
            invalid_type_error: 'Kategori harus berupa teks',
        })
        .min(3, 'Kategori minimal 3 karakter'),

    description: z
        .string({
            required_error: 'Keterangan wajib diisi',
            invalid_type_error: 'Keterangan harus berupa teks',
        })
        .min(5, 'Keterangan minimal 5 karakter'),

    contact: z
        .string({
            required_error: 'Nomor HP wajib diisi',
            invalid_type_error: 'Nomor HP harus berupa teks',
        })
        .min(10, 'Nomor HP minimal 10 digit')
        .regex(/^08\d{8,12}$/, 'Nomor HP harus diawali 08 dan berisi 10–14 digit'),
});

type FormData = z.infer<typeof schema>;

export default function DamageReport({ kategoriKerusakan, unitKerja }: any) {
    const { auth } = usePage<SharedData>().props;
    const [photos, setPhotos] = useState<File[]>([]);
    const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [errorServer, setErrorServer] = useState<null | Record<string, string[]>>(null);

    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        formState: { errors },
        reset,
    } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const handleConfirm = () => {
        setShowSuccessDialog(false);
        router.visit(route('history'));
    };

    const onSubmit = (data: FormData) => {
        console.log(data);

        router.post(
            route('kerusakangedung.store'),
            { ...data, photos },
            {
                onError: (errors) => {
                    setErrorServer(errors);
                },
                onSuccess: () => {
                    setShowSuccessDialog(true);
                    reset();
                    setPhotos([]);
                    setPhotoPreviews([]);
                    setErrorServer(null); // reset error
                },
            },
        );
    };

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            if (photos.length >= 2) {
                alert('Maksimal 2 file yang dapat diunggah');
                return;
            }
            const file = e.target.files[0];

            const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/heic'];
            const validVideoTypes = ['video/mp4', 'video/mov', 'video/avi', 'video/mkv', 'video/webm'];
            const validTypes = [...validImageTypes, ...validVideoTypes];
            const maxSize = 20 * 1024 * 1024; // 20MB

            if (!validTypes.includes(file.type)) {
                alert('Format file tidak didukung. Gunakan JPG, PNG, HEIC untuk foto atau MP4, MOV untuk video');
                return;
            }

            if (file.size > maxSize) {
                alert('Ukuran file terlalu besar. Maksimal 20MB');
                return;
            }

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

                        {errorServer && (
                            <Alert variant="destructive" className="mb-4 bg-white text-red-700">
                                <AlertCircleIcon />
                                <AlertTitle>Gagal kirim laporan !</AlertTitle>
                                <AlertDescription className="text-red-700">
                                    <ul>
                                        {Object.values(errorServer)
                                            .flat()
                                            .map((item, index) => (
                                                <li key={index}>{item}</li>
                                            ))}
                                    </ul>
                                </AlertDescription>
                            </Alert>
                        )}

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
                                        <Label htmlFor="name">Nama Pengaju</Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            readOnly
                                            value={auth?.user.name}
                                            className="mt-1 cursor-not-allowed border border-gray-300 bg-gray-100 text-gray-500"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="name">Unit Kerja</Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            readOnly
                                            value={auth?.user?.biro?.nama_biro ?? '-'}
                                            className="mt-1 cursor-not-allowed border border-gray-300 bg-gray-100 text-gray-500"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="location">
                                            Lokasi Kerusakan <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="location"
                                            {...register('location')}
                                            className={`mt-1 ${errors.location && 'border-red-500'}`}
                                            placeholder="Exp: Gedung 1 Lt.5 Ruangan IT"
                                        />
                                        {errors.location && <p className="mt-1 text-sm text-red-500">{errors.location.message}</p>}
                                    </div>
                                    <div>
                                        <Label htmlFor="damageType">
                                            Nama Item Rusak <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="damageType"
                                            {...register('damageType')}
                                            className={`mt-1 ${errors.damageType && 'border-red-500'}`}
                                        />
                                        {errors.damageType && <p className="mt-1 text-sm text-red-500">{errors.damageType.message}</p>}
                                    </div>

                                    <div className="w-full">
                                        <Label htmlFor="kategori">
                                            Kategori Kerusakan <span className="text-red-500">*</span>
                                        </Label>
                                        <Controller
                                            control={control}
                                            name="kategori"
                                            render={({ field }) => (
                                                <div className="mt-2">
                                                    <KategoriSelector
                                                        kategoriList={kategoriKerusakan}
                                                        selectedValue={field.value || ''}
                                                        onSelect={field.onChange}
                                                    />
                                                </div>
                                            )}
                                        />
                                        {errors.kategori && <p className="mt-1 text-sm text-red-500">{errors.kategori.message}</p>}
                                    </div>

                                    <div>
                                        <Label htmlFor="description">
                                            Keterangan <span className="text-red-500">*</span>
                                        </Label>
                                        <Textarea
                                            id="description"
                                            {...register('description')}
                                            className={`mt-1 ${errors.description && 'border-red-500'}`}
                                        />
                                        {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>}
                                    </div>

                                    <div>
                                        <Label>Foto/Video Kerusakan</Label>
                                        <p className="mt-1 text-xs text-gray-500">
                                            Maks. <span className="font-medium">2 file</span>, ukuran ≤ 20 MB, format{' '}
                                            <span className="font-medium">JPG, PNG, HEIC (foto) atau MP4, MOV (video)</span>
                                        </p>
                                        <div className="mt-2 grid grid-cols-2 gap-4">
                                            {photoPreviews.map((preview, index) => {
                                                const isVideo = photos[index]?.type.startsWith('video/');
                                                return (
                                                    <div key={index} className="relative">
                                                        <div className="relative aspect-square overflow-hidden rounded-md border">
                                                            {isVideo ? (
                                                                <video src={preview} className="h-full w-full object-cover" controls />
                                                            ) : (
                                                                <img
                                                                    src={preview || '/placeholder.svg'}
                                                                    alt={`Foto kerusakan ${index + 1}`}
                                                                    className="h-full w-full object-cover"
                                                                />
                                                            )}
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
                                                );
                                            })}
                                            {photos.length < 2 && (
                                                <div
                                                    className="flex aspect-square cursor-pointer items-center justify-center rounded-md border border-dashed hover:bg-gray-50"
                                                    onClick={triggerFileInput}
                                                >
                                                    <div className="flex flex-col items-center space-y-2">
                                                        <ImagePlus className="h-8 w-8 text-gray-400" />
                                                        <span className="text-xs text-gray-500">Tambah File</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            className="hidden"
                                            accept="image/*,video/*"
                                            onChange={handlePhotoUpload}
                                        />
                                    </div>

                                    {/* Creative Urgency Selection */}
                                    {/* <div>
                                        <Label className="text-base font-medium">Tingkat Urgensi <span className="text-red-500">*</span></Label>
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
                                                                    'relative cursor-pointer rounded-xl border-2 p-3 transition-all duration-300 hover:shadow-lg',
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
                                                                        <div className="flex items-center justify-between">
                                                                            <h3 className="text-sm font-semibold">{option.label}</h3>
                                                                            {isSelected && (
                                                                                <div className={cn('h-3 w-3 rounded-full', option.badgeColor)}></div>
                                                                            )}
                                                                        </div>
                                                                        <p className="mb-1 text-xs opacity-80">{option.description}</p>
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
                                    </div> */}

                                    <div>
                                        <Label htmlFor="contact">
                                            No Hp <span className="text-red-500">*</span>
                                        </Label>
                                        <Input id="contact" {...register('contact')} className={`mt-1 ${errors.contact && 'border-red-500'}`} />
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

                <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader className="text-center">
                            <div className="flex flex-col items-center justify-center">
                                <CheckCircle2 className="mb-3.5 h-10 w-10 text-green-600" />
                                <DialogTitle className="text-xl font-semibold text-green-700">Laporan kerusakan berhasil dikirim!</DialogTitle>
                            </div>
                        </DialogHeader>
                        <div className="text-center text-sm text-muted-foreground">Klik tombol "Ok" untuk melihat aktivitas dan detail laporan.</div>
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
