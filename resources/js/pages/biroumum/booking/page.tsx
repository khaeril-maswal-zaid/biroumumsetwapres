'use client';

import { BottomNavigation } from '@/components/biroumum/bottom-navigation';
import { PageHeader } from '@/components/biroumum/page-header';
import { RoomSelection } from '@/components/biroumum/room-selection';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { type SharedData } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Head, router, usePage } from '@inertiajs/react';
import { Calendar, CheckCircle2, Users } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
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

type FormData = z.infer<typeof schema>;

export default function RoomBooking() {
    const { auth } = usePage<SharedData>().props;

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
        reset,
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            room_code: '',
            room_name: '',
            date: '',
            startTime: '',
            endTime: '',
            purpose: '',
            contact: '',
        },
    });

    const formData = watch();

    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const handleConfirm = () => {
        setShowSuccessDialog(false);
        router.visit(route('history'));
    };

    const onSubmit = (data: FormData) => {
        router.post(route('ruangrapat.store'), data, {
            onSuccess: () => {
                reset();
                setShowSuccessDialog(true);
            },
        });
    };

    const today = new Date().toISOString().split('T')[0];

    return (
        <>
            <Head title="Pemesanan Ruangan Rapat" />
            <div className="mx-auto min-h-screen w-full max-w-md bg-gray-50">
                <div className="pb-20">
                    <div className="space-y-6 p-4">
                        <PageHeader title="Pemesanan Ruang Rapat" backUrl="/" />

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Users className="h-5 w-5" />
                                    <span>Form Pemesanan</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                    <div className="space-y-4">
                                        <h3 className="border-b pb-2 text-lg font-medium text-gray-900">Informasi Pemesan</h3>

                                        <div>
                                            <Label htmlFor="name">Nama pemesan</Label>
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
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="flex items-center gap-2 border-b pb-2 text-lg font-medium text-gray-900">
                                            <Calendar className="h-5 w-5" />
                                            Pilih Tanggal & Waktu
                                        </h3>

                                        <div>
                                            <Label htmlFor="date">Tanggal penggunaan ruangan</Label>
                                            <Input type="date" min={today} {...register('date')} />
                                            {errors.date && <p className="text-sm text-red-500">{errors.date.message}</p>}
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="startTime">Jam Mulai</Label>
                                                <Input type="time" {...register('startTime')} />
                                                {errors.startTime && <p className="text-sm text-red-500">{errors.startTime.message}</p>}
                                            </div>
                                            <div>
                                                <Label htmlFor="endTime">Jam Selesai</Label>
                                                <Input type="time" {...register('endTime')} min={formData.startTime} />
                                                {errors.endTime && <p className="text-sm text-red-500">{errors.endTime.message}</p>}
                                            </div>
                                        </div>

                                        {formData.startTime && formData.endTime && formData.startTime >= formData.endTime && (
                                            <div className="rounded border border-red-200 bg-red-50 p-2 text-sm text-red-600">
                                                ⚠️ Jam selesai harus lebih besar dari jam mulai
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="border-b pb-2 text-lg font-medium text-gray-900">Pilih Ruangan</h3>
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

                                        {errors.room_code && <p className="text-sm text-red-500">{errors.room_code.message}</p>}
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="border-b pb-2 text-lg font-medium text-gray-900">Informasi Tambahan</h3>

                                        <div>
                                            <Label htmlFor="purpose">Kegiatan</Label>
                                            <Textarea id="purpose" {...register('purpose')} />
                                            {errors.purpose && <p className="text-sm text-red-500">{errors.purpose.message}</p>}
                                        </div>

                                        <div>
                                            <Label htmlFor="contact">No Handphone</Label>
                                            <Input id="contact" {...register('contact')} />
                                            {errors.contact && <p className="text-sm text-red-500">{errors.contact.message}</p>}
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full"
                                        // disabled={!formData.room || !formData.contact || !formData.purpose || formData.startTime >= formData.endTime}
                                    >
                                        Ajukan Pemesanan
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
                                <DialogTitle className="text-xl font-semibold text-green-700">Data Berhasil Disimpan</DialogTitle>
                            </div>
                        </DialogHeader>
                        <div className="text-center text-sm text-muted-foreground">
                            Klik tombol "Ok" untuk melihat aktivitas dan detail pemesanan.
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
