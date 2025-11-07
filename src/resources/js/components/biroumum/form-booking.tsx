'use client';

import { RoomSelection } from '@/components/biroumum/room-selection';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { Calendar } from 'lucide-react';
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
});

export type FormData = z.infer<typeof schema>;

export function FormBooking() {
    const { auth } = usePage<SharedData>().props;

    const {
        register,
        setValue,
        watch,
        formState: { errors },
    } = useFormContext<FormData>();

    const formData = watch();
    const today = new Date().toISOString().split('T')[0];

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
                    <Label htmlFor="date">Tanggal Penggunaan Ruangan</Label>
                    <Input className="mt-1" type="date" min={today} {...register('date')} />
                    {errors.date && <p className="mt-1 text-sm text-red-500">{errors.date.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="startTime">Jam Mulai</Label>
                        <Input className="mt-1" type="time" {...register('startTime')} />
                        {errors.startTime && <p className="mt-1 text-sm text-red-500">{errors.startTime.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor="endTime">Jam Selesai</Label>
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
                <h3 className="text-md border-b pb-2 font-medium text-gray-900">Pilih Ruangan</h3>
                {formData.startTime && formData.endTime && formData.startTime <= formData.endTime && (
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

                <div>
                    <Label htmlFor="purpose">Kegiatan</Label>
                    <Textarea className="mt-1" id="purpose" {...register('purpose')} />
                    {errors.purpose && <p className="mt-1 text-sm text-red-500">{errors.purpose.message}</p>}
                </div>

                <div>
                    <Label htmlFor="contact">No Hp</Label>
                    <Input className="mt-1" id="contact" {...register('contact')} />
                    {errors.contact && <p className="mt-1 text-sm text-red-500">{errors.contact.message}</p>}
                </div>
            </div>
        </>
    );
}
