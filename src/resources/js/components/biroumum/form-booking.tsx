// Ganti seluruh FormBooking (file: form-booking.tsx) dengan versi ini
'use client';

import { RoomSelection } from '@/components/biroumum/room-selection';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { Building2, Calendar, CheckCircle2, Cookie, Monitor, Users, Utensils, Video } from 'lucide-react';
import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
    room_code: z.string().min(1, 'Silakan pilih ruangan yang akan digunakan'),
    room_name: z.string().min(1, 'Nama ruangan tidak boleh kosong'),
    date: z.string().min(1, 'Tanggal rapat wajib ditentukan'),
    startTime: z.string().min(1, 'Jam mulai rapat wajib diisi'),
    endTime: z.string().min(1, 'Jam selesai rapat wajib diisi'),

    jumlahPeserta: z.string().min(1, 'Jumlah peserta wajib diisi'),
    purpose: z.string().min(1, 'Mohon jelaskan tujuan atau agenda rapat'),
    contact: z
        .string({
            required_error: 'Nomor HP wajib diisi',
            invalid_type_error: 'Nomor HP harus berupa teks',
        })
        .min(10, 'Nomor HP minimal 10 digit')
        .regex(/^08\d{8,12}$/, 'Nomor HP harus diawali 08 dan berisi 10–14 digit'),

    jenisRapat: z.string().nullable(),
    makanSiang: z.boolean(),
    makanRingan: z.boolean(),
    needItSupport: z.boolean(),
    isHybrid: z.boolean(),
});

export type FormData = z.infer<typeof schema>;
type JenisRapat = 'internal' | 'external' | null;

export function FormBooking() {
    const { auth } = usePage<SharedData>().props;

    const {
        register,
        setValue,
        watch,
        formState: { errors },
    } = useFormContext<FormData>();

    // Read values from RHF (single source of truth)
    const formData = watch();
    const makanRingan = watch('makanRingan') ?? false;
    const makanSiang = watch('makanSiang') ?? false;
    const isHybrid = watch('isHybrid') ?? false;
    const needItSupport = watch('needItSupport') ?? false;
    const jenisRapat = (watch('jenisRapat') as JenisRapat) ?? 'internal';

    // Register fields only — DO NOT overwrite values coming from parent
    useEffect(() => {
        // register('needItSupport');
        // register('isHybrid');
        // register('jenisRapat');
        register('room_code');
        // register('room_name');
    }, [register]);

    const today = new Date().toISOString().split('T')[0];

    const jenisRapatOptions = [
        {
            value: 'internal',
            label: 'Rapat Internal',
            icon: Building2,
        },
        {
            value: 'external',
            label: 'Rapat External',
            icon: Users,
        },
    ];

    const kebutuhanDanDukungan = [
        {
            label: 'Membutuhkan Snack',
            icon: Cookie,
            value: makanRingan,
            valueString: 'makanRingan',
        },
        {
            label: 'Membutuhkan Makan Siang',
            icon: Utensils,
            value: makanSiang,
            valueString: 'makanSiang',
        },
        {
            label: 'Rapat Hybrid',
            icon: Video,
            value: isHybrid,
            valueString: 'isHybrid',
        },
        {
            label: 'Dukungan IT',
            icon: Monitor,
            value: needItSupport,
            valueString: 'needItSupport',
        },
    ];

    return (
        <>
            {/* Informasi Pemesan */}
            <div className="space-y-4">
                <h3 className="text-md mb-2.5 border-b pb-0.5 font-medium text-gray-900">Informasi Pemesan</h3>
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
                    <Label htmlFor="unit">Unit Kerja</Label>
                    <Input
                        id="unit"
                        type="text"
                        readOnly
                        value={auth?.user?.biro?.nama_biro ?? '-'}
                        className="mt-1 cursor-not-allowed border border-gray-300 bg-gray-100 text-gray-500"
                    />
                </div>
            </div>

            {/* Pilih Tanggal & Waktu */}
            <div className="space-y-4">
                <h3 className="text-md text-md mb-2.5 flex items-center gap-2 border-b pb-0.5 font-medium text-gray-900">
                    <Calendar className="h-5 w-5" />
                    Pilih Tanggal & Waktu
                </h3>

                <div>
                    <Label htmlFor="date">
                        Tanggal Penggunaan Ruangan
                        <span className="text-red-500"> *</span>
                    </Label>
                    <Input className="mt-1" type="date" min={today} {...register('date')} />
                    {errors.date && <p className="mt-1 text-sm text-red-500">{errors.date.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="startTime">
                            Jam Mulai <span className="text-red-500">*</span>
                        </Label>
                        <Input className="mt-1" type="time" {...register('startTime')} />
                        {errors.startTime && <p className="mt-1 text-sm text-red-500">{errors.startTime.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor="endTime">
                            Jam Selesai <span className="text-red-500">*</span>
                        </Label>
                        <Input className="mt-1" type="time" {...register('endTime')} min={formData.startTime} />
                        {errors.endTime && <p className="mt-1 text-sm text-red-500">{errors.endTime.message}</p>}
                    </div>
                </div>

                {formData.startTime && formData.endTime && formData.startTime >= formData.endTime && (
                    <div className="rounded border border-red-200 bg-red-50 p-2 text-sm text-red-600">
                        ⚠️ Jam selesai harus lebih besar dari jam mulai
                    </div>
                )}
            </div>

            {/* Pilih Ruangan */}
            <div className="space-y-4">
                <h3 className="text-md border-b pb-2 font-medium text-gray-900">
                    Pilih Ruangan <span className="text-red-500">*</span>
                </h3>
                {formData.startTime && formData.endTime && formData.startTime < formData.endTime && (
                    <RoomSelection
                        selectedRoom={formData.room_code}
                        onRoomChange={(id, name) => {
                            setValue('room_code', id);
                            setValue('room_name', name);
                        }}
                        selectedDate={formData.date}
                        selectedStartTime={formData.startTime}
                        selectedEndTime={formData.endTime}
                    />
                )}
            </div>

            {/* Informasi Tambahan */}
            <div className="space-y-4">
                <h3 className="text-md border-b pb-2 font-medium text-gray-900">Informasi Tambahan</h3>

                <>
                    <div className="space-y-3">
                        <Label>
                            Jenis Rapat <span className="text-red-500">*</span>
                        </Label>
                        <div className="mt-1 grid grid-cols-2 gap-2">
                            {jenisRapatOptions.map((option) => {
                                const Icon = option.icon;
                                const isSelected = jenisRapat === option.value;
                                return (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => {
                                            setValue('jenisRapat', option.value);
                                        }}
                                        className={cn(
                                            'relative rounded-xl border-2 p-2.5 text-left transition-all duration-200',
                                            isSelected
                                                ? 'border-sky-200 border-sky-500 bg-sky-50 bg-sky-100 ring-2 ring-sky-200 hover:border-sky-400'
                                                : '',
                                        )}
                                    >
                                        {isSelected && (
                                            <div className="absolute top-2 right-2">
                                                <CheckCircle2 className="h-5 w-5 text-sky-600" />
                                            </div>
                                        )}
                                        <div className="flex items-start gap-2">
                                            <div className={cn('rounded-lg p-1', isSelected ? 'bg-white' : 'bg-white/80')}>
                                                <Icon className="h-4 w-4 text-sky-600" />
                                            </div>

                                            <p className="pt-0.5 text-sm font-semibold text-gray-900">{option.label}</p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="jumlahPeserta">
                            Jumlah Peserta <span className="text-red-500">*</span>
                        </Label>
                        <Input className="mt-1" id="jumlahPeserta" {...register('jumlahPeserta')} />
                        {errors.jumlahPeserta && <p className="mt-1 text-sm text-red-500">{errors.jumlahPeserta.message}</p>}
                    </div>

                    <div>
                        <Label htmlFor="purpose">
                            Kegiatan <span className="text-red-500">*</span>
                        </Label>
                        <Textarea className="mt-1" id="purpose" {...register('purpose')} />
                        {errors.purpose && <p className="mt-1 text-sm text-red-500">{errors.purpose.message}</p>}
                    </div>

                    <div>
                        <Label htmlFor="contact">
                            No Hp <span className="text-red-500">*</span>
                        </Label>
                        <Input className="mt-1" id="contact" {...register('contact')} />
                        {errors.contact && <p className="mt-1 text-sm text-red-500">{errors.contact.message}</p>}
                    </div>
                </>

                {kebutuhanDanDukungan.map((need: any, index: any) => {
                    const Icon = need.icon;

                    return (
                        <button
                            type="button"
                            key={index}
                            onClick={() => setValue(need.valueString, !need.value)}
                            className={cn(
                                'mb-2 flex w-full items-center gap-4 rounded-xl border-2 px-4 py-1.5 text-left transition-all duration-200',
                                need.value
                                    ? 'border-sky-400 bg-linear-to-r from-sky-50 to-purple-50 ring-2 ring-sky-200'
                                    : 'border-gray-300 bg-gray-50 hover:border-sky-300 hover:bg-sky-50/50',
                            )}
                        >
                            <div
                                className={cn(
                                    'flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition-all duration-200',
                                    need.value ? 'border-sky-600 bg-sky-600' : 'border-gray-300 bg-white',
                                )}
                            >
                                {need.value && (
                                    <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </div>

                            <div className="flex flex-1 items-center gap-3">
                                <div className={cn('rounded-lg p-2.5 transition-colors duration-200', need.value ? 'bg-sky-100' : 'bg-gray-100')}>
                                    <Icon className={cn('h-5 w-5 transition-colors duration-200', need.value ? 'text-sky-600' : 'text-gray-400')} />
                                </div>
                                <div>
                                    <p
                                        className={cn(
                                            'text-sm font-semibold transition-colors duration-200',
                                            need.value ? 'text-sky-900' : 'text-gray-700',
                                        )}
                                    >
                                        {need.label}
                                    </p>

                                    {/* <p className="mt-0.5 text-xs text-gray-500">{need.description}</p> */}
                                </div>
                            </div>

                            {need.value && <span className="rounded-full bg-sky-100 px-2.5 py-1 text-xs font-semibold text-sky-700">Aktif</span>}
                        </button>
                    );
                })}
            </div>
        </>
    );
}
