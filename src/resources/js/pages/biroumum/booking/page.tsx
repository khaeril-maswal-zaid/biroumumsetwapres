'use client';

import { BottomNavigation } from '@/components/biroumum/bottom-navigation';
import { FormBooking } from '@/components/biroumum/form-booking';
import { PageHeader } from '@/components/biroumum/page-header';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Toaster } from '@/components/ui/toaster';
import { zodResolver } from '@hookform/resolvers/zod';
import { Head, router } from '@inertiajs/react';
import { AlertCircleIcon, CheckCircle2, Users } from 'lucide-react';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z
    .object({
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
    })
    .refine((data) => data.endTime > data.startTime, {
        message: 'Jam selesai harus lebih besar dari jam mulai',
        path: ['endTime'],
    });
type FormData = z.infer<typeof schema>;

export default function RoomBooking() {
    const methods = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            room_code: '',
            room_name: '',
            date: '',
            startTime: '',
            endTime: '',
            jumlahPeserta: '',
            purpose: '',
            contact: '',

            jenisRapat: 'internal',
            makanRingan: false,
            makanSiang: false,
            needItSupport: false,
            isHybrid: false,
        },
    });

    const { handleSubmit, reset } = methods;

    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [errorServer, setErrorServer] = useState<null | Record<string, string[]>>(null);

    const handleConfirm = () => {
        setShowSuccessDialog(false);
        router.visit(route('history'));
    };

    const onSubmit = (data: FormData) => {
        router.post(route('ruangrapat.store'), data, {
            onSuccess: () => {
                reset();
                setShowSuccessDialog(true);
                setErrorServer(null);
            },
            onError: (err) => {
                setErrorServer(err);
            },
        });
    };

    return (
        <>
            <Head title="Pemesanan Ruangan Rapat" />
            <div className="mx-auto min-h-screen w-full max-w-md bg-gray-50">
                <div className="pb-20">
                    <div className="space-y-6 p-4">
                        <PageHeader title="Pemesanan Ruang Rapat" backUrl="/" />

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
                                    <Users className="h-5 w-5" />
                                    <span>Form Pemesanan</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <FormProvider {...methods}>
                                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                        <FormBooking />
                                        <Button type="submit" className="w-full">
                                            Ajukan Pemesanan
                                        </Button>
                                    </form>
                                </FormProvider>
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

            <Toaster />
        </>
    );
}
