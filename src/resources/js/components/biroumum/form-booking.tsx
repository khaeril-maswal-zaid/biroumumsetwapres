// Ganti seluruh FormBooking (file: form-booking.tsx) dengan versi ini
'use client';

import { RoomSelection } from '@/components/biroumum/room-selection';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { Building2, Calendar, CheckCircle2, Monitor, Users, Video } from 'lucide-react';
import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
    room_code: z.string().min(1, 'Ruangan wajib dipilih'),
    room_name: z.string().min(1, 'Nama ruangan wajib diisi'),
    date: z.string().min(1, 'Tanggal wajib diisi'),
    startTime: z.string().min(1, 'Jam mulai wajib diisi'),
    endTime: z.string().min(1, 'Jam selesai wajib diisi'),
    purpose: z.string().min(1, 'Kegiatan wajib diisi'),
    contact: z.string().min(1, 'Kontak wajib diisi'),

    jenisRapat: z.string().nullable(),
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
    const isHybrid = watch('isHybrid') ?? false;
    const needItSupport = watch('needItSupport') ?? false;
    const jenisRapat = (watch('jenisRapat') as JenisRapat) ?? 'internal';

    // Register fields only — DO NOT overwrite values coming from parent
    useEffect(() => {
        register('needItSupport');
        register('isHybrid');
        register('jenisRapat');
        register('room_code');
        register('room_name');
    }, [register]);

    const today = new Date().toISOString().split('T')[0];

    const jenisRapatOptions = [
        {
            value: 'internal',
            label: 'Rapat Internal',
            description: 'Rapat dengan peserta dari internal Setwapres',
            icon: Building2,
            color: 'bg-sky-50 border-sky-200 hover:border-sky-400',
            activeColor: 'bg-sky-100 border-sky-500 ring-2 ring-sky-200',
            iconColor: 'text-sky-600',
            badgeColor: 'bg-sky-100 text-sky-700',
        },
        {
            value: 'external',
            label: 'Rapat External',
            description: 'Rapat dengan peserta dari luar Setwapres',
            icon: Users,
            color: 'bg-amber-50 border-amber-200 hover:border-amber-400',
            activeColor: 'bg-amber-100 border-amber-500 ring-2 ring-amber-200',
            iconColor: 'text-amber-600',
            badgeColor: 'bg-amber-100 text-amber-700',
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

                <div className="space-y-3">
                    <Label>
                        Jenis Rapat <span className="text-red-500">*</span>
                    </Label>
                    <div className="mt-1 grid grid-cols-1 gap-3">
                        {jenisRapatOptions.map((option) => {
                            const Icon = option.icon;
                            const isSelected = jenisRapat === option.value;
                            return (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => {
                                        // set directly into RHF (no local state)
                                        setValue('jenisRapat', option.value);
                                    }}
                                    className={cn(
                                        'relative rounded-xl border-2 p-3 text-left transition-all duration-200',
                                        isSelected ? option.activeColor : option.color,
                                    )}
                                >
                                    {isSelected && (
                                        <div className="absolute top-2 right-2">
                                            <CheckCircle2 className="h-5 w-5 text-teal-600" />
                                        </div>
                                    )}
                                    <div className="flex items-start gap-3">
                                        <div className={cn('rounded-lg p-2', isSelected ? 'bg-white' : 'bg-white/80')}>
                                            <Icon className={cn('h-5 w-5', option.iconColor)} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900">{option.label}</p>
                                            <p className="mt-0.5 text-xs text-gray-500">{option.description}</p>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
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

                {/* Rapat Hybrid (fully RHF-controlled) */}
                <button
                    type="button"
                    onClick={() => setValue('isHybrid', !isHybrid)}
                    className={cn(
                        'flex w-full items-center gap-4 rounded-xl border-2 px-4 py-2.5 text-left transition-all duration-200',
                        isHybrid
                            ? 'border-violet-400 bg-linear-to-r from-violet-50 to-purple-50 ring-2 ring-violet-200'
                            : 'border-gray-200 bg-white hover:border-violet-300 hover:bg-violet-50/50',
                    )}
                >
                    <div
                        className={cn(
                            'flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition-all duration-200',
                            isHybrid ? 'border-violet-600 bg-violet-600' : 'border-gray-300 bg-white',
                        )}
                    >
                        {isHybrid && (
                            <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        )}
                    </div>

                    <div className="flex flex-1 items-center gap-3">
                        <div className={cn('rounded-lg p-2.5 transition-colors duration-200', isHybrid ? 'bg-violet-100' : 'bg-gray-100')}>
                            <Video className={cn('h-5 w-5 transition-colors duration-200', isHybrid ? 'text-violet-600' : 'text-gray-400')} />
                        </div>
                        <div>
                            <p className={cn('text-sm font-semibold transition-colors duration-200', isHybrid ? 'text-violet-900' : 'text-gray-700')}>
                                Rapat Hybrid
                            </p>
                            <p className="mt-0.5 text-xs text-gray-500">Peserta dapat bergabung secara online</p>
                        </div>
                    </div>

                    {isHybrid && <span className="rounded-full bg-violet-100 px-2.5 py-1 text-xs font-semibold text-violet-700">Aktif</span>}
                </button>

                {/* Dukungan TI (fully RHF-controlled) */}
                <button
                    type="button"
                    onClick={() => setValue('needItSupport', !needItSupport)}
                    className={cn(
                        'flex w-full items-center gap-4 rounded-xl border-2 px-4 py-2.5 text-left transition-all duration-200',
                        needItSupport
                            ? 'border-teal-400 bg-linear-to-r from-teal-50 to-purple-50 ring-2 ring-teal-200'
                            : 'border-gray-200 bg-white hover:border-teal-300 hover:bg-teal-50/50',
                    )}
                >
                    <div
                        className={cn(
                            'flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition-all duration-200',
                            needItSupport ? 'border-teal-600 bg-teal-600' : 'border-gray-300 bg-white',
                        )}
                    >
                        {needItSupport && (
                            <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        )}
                    </div>

                    <div className="flex flex-1 items-center gap-3">
                        <div className={cn('rounded-lg p-2.5 transition-colors duration-200', needItSupport ? 'bg-teal-100' : 'bg-gray-100')}>
                            <Monitor className={cn('h-5 w-5 transition-colors duration-200', needItSupport ? 'text-teal-600' : 'text-gray-400')} />
                        </div>
                        <div>
                            <p
                                className={cn(
                                    'text-sm font-semibold transition-colors duration-200',
                                    needItSupport ? 'text-teal-900' : 'text-gray-700',
                                )}
                            >
                                Dukungan TI
                            </p>
                            <p className="mt-0.5 text-xs text-gray-500">Tim IT menyiapkan sesi sebelum rapat dimulai.</p>
                        </div>
                    </div>

                    {needItSupport && <span className="rounded-full bg-teal-100 px-2.5 py-1 text-xs font-semibold text-teal-700">Aktif</span>}
                </button>
            </div>
        </>
    );
}
