import { StatusBadge } from '@/components/badges/StatusBadge';
import { FormBooking } from '@/components/biroumum/form-booking';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Head, Link, router } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowLeft,
    Building,
    Calendar,
    CheckCircle,
    Clock,
    Cookie,
    Edit3,
    MessageSquare,
    Monitor,
    Presentation,
    Users,
    Utensils,
    Video,
    X,
    XCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { z } from 'zod';

const schema = z.object({
    room_code: z.string().min(1, 'Ruangan wajib dipilih'),
    room_name: z.string().min(1, 'Nama ruangan wajib diisi'),
    date: z.string().min(1, 'Tanggal wajib diisi'),
    startTime: z.string().min(1, 'Jam mulai wajib diisi'),
    // unit_kerja: z.string().min(1, 'Unit Kerja wajib diisi'),
    endTime: z.string().min(1, 'Jam selesai wajib diisi'),
    purpose: z.string().min(1, 'Kegiatan wajib diisi'),
    contact: z.string().min(1, 'Kontak wajib diisi'),
    jenisRapat: z.string().nullable(),
    isHybrid: z.boolean(),
    needItSupport: z.boolean(),
});

type FormData = z.infer<typeof schema>;

const formatTanggalIna = (tanggal: string) => {
    return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(new Date(tanggal));
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function BookingDetailsPage({ selectedBooking }: any) {
    const { toast } = useToast();

    const [actionType, setActionType] = useState<'approved' | 'rejected' | null>(null);
    const [adminMessage, setAdminMessage] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const handleActionClick = (action: 'approved' | 'rejected') => {
        setActionType(action);
        setAdminMessage('');
    };

    const handleSubmitStatus = async (bookingCode: string) => {
        setIsProcessing(true);

        router.patch(
            route('ruangrapat.status', bookingCode),
            {
                action: actionType,
                message: adminMessage,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast({
                        title: 'Berhasil',
                        description: 'Status pemesanan berhasil diubah.',
                    });
                    setIsProcessing(false);
                    setAdminMessage('');
                    setActionType(null);
                },
                onError: (errors) => {
                    toast({
                        title: 'Validasi gagal',
                        description: Object.values(errors)[0],
                    });
                    setIsProcessing(false);
                },
            },
        );
    };

    //--------------------------------------
    const [showRescheduleDialog, setShowRescheduleDialog] = useState(false);

    //--------------------------------------
    const methods = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            room_code: '',
            room_name: '',
            date: '',
            startTime: '',
            endTime: '',
            purpose: '',
            contact: '',

            jenisRapat: 'internal',
            isHybrid: false,
            needItSupport: false,
        },
    });

    const { handleSubmit, reset } = methods;

    const onSubmit = (data: FormData) => {
        router.put(route('ruangrapat.update', selectedBooking.kode_booking), data, {
            onSuccess: () => {
                reset();
                toast({
                    title: 'Berhasil',
                    description: 'Pemesanan berhasil diupdate.',
                });
                setShowRescheduleDialog(false);
            },
            onError: (errors) => {
                toast({
                    title: 'Validasi gagal',
                    description: Object.values(errors)[0],
                    variant: 'destructive',
                });
                setShowRescheduleDialog(false);
            },
        });
    };

    //--------------------------------------------------------
    // helper di BookingDetailsPage (atau util)
    function mapBookingToForm(data: any): FormData {
        const toDate = (d: any) => {
            if (!d) return '';
            if (typeof d === 'string') {
                // coba ambil bagian tanggal (handles '2025-09-30T00:00:00Z' atau '2025-09-30 00:00:00')
                const datePart = d.split('T')[0].split(' ')[0];
                if (/^\d{4}-\d{2}-\d{2}$/.test(datePart)) return datePart;
            }
            const parsed = new Date(d);
            if (!isNaN(parsed.getTime())) return parsed.toISOString().split('T')[0];
            return '';
        };

        const toTime = (t: any) => {
            if (!t) return '';
            if (typeof t === 'string') {
                const m = t.match(/(\d{2}:\d{2})/);
                if (m) return m[1];
                // fallback: if '09:00:00' -> slice
                if (t.length >= 5 && t.includes(':')) return t.slice(0, 5);
            }
            return '';
        };

        return {
            room_code: data?.ruangans?.kode_ruangan ?? '',
            room_name: data?.ruangans?.nama_ruangan ?? '',
            date: toDate(data?.tanggal_penggunaan),
            startTime: toTime(data?.jam_mulai),
            endTime: toTime(data?.jam_selesai),
            purpose: data?.deskripsi ?? '',
            contact: data?.no_hp ?? '',

            jenisRapat: data?.jenis_rapat ?? 'internal',
            isHybrid: data?.is_hybrid == '1',
            needItSupport: data?.is_ti_support == '1',
        };
    }

    const handleReschedule = () => {
        if (selectedBooking) {
            methods.reset(mapBookingToForm(selectedBooking)); // reset di parent
        }
        setShowRescheduleDialog(true);
    };

    // jalankan useEffect untuk jaga-jaga:
    useEffect(() => {
        if (showRescheduleDialog && selectedBooking) {
            methods.reset(mapBookingToForm(selectedBooking));
        }
    }, [showRescheduleDialog, selectedBooking]);

    const kebutuhanDanDukungan = [
        {
            label: 'Snack/ Makanan Ringan',
            icon: Cookie,
            isCheck: selectedBooking?.is_makanan_ringan,
        },
        {
            label: 'Makan Siang',
            icon: Utensils,
            isCheck: selectedBooking?.is_makanan_berat,
        },
        {
            label: 'Rapat Hybrid',
            icon: Video,
            isCheck: selectedBooking?.is_hybrid,
        },
        {
            label: 'Dukungan IT',
            icon: Monitor,
            isCheck: selectedBooking?.is_ti_support,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto bg-linear-to-br from-white to-blue-100 p-4">
                <Link href={route('ruangrapat.index')}>
                    <Button
                        variant="default"
                        className="mb-1 flex items-center space-x-2 border bg-accent text-accent-foreground hover:border-gray-300 hover:bg-gray-200"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span>Kembali</span>
                    </Button>
                </Link>

                <Card className="max-w-3xl">
                    <CardHeader>
                        <CardTitle className="mb-2 flex items-center gap-1">
                            <Calendar className="inline-block h-5 w-5" />
                            <span className="py-auto">Detail Pemesanan Ruang Rapat</span>
                        </CardTitle>
                        <CardDescription>Tinjau informasi pemesanan dan berikan keputusan dengan pesan untuk pengaju.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {selectedBooking && (
                            <div className="space-y-6">
                                {/* Status and Room Info */}
                                <div className="flex flex-col gap-4 rounded-lg bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <div className="mb-2 flex items-center gap-1">
                                            <Calendar className="h-4 w-4 text-gray-500" />
                                            <span className="text-xs text-gray-600">{formatTanggalIna(selectedBooking.created_at)}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span className="font-mono text-sm font-medium text-gray-700">
                                                Kode Pemesanan: {selectedBooking.kode_booking}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <StatusBadge status={selectedBooking.status} />
                                    </div>
                                </div>

                                {selectedBooking.status == 'booked' && (
                                    <div className="flex justify-end">
                                        <Button
                                            variant="outline"
                                            className="flex items-center gap-2 border-blue-200 bg-transparent text-blue-700 hover:bg-blue-50"
                                            onClick={handleReschedule}
                                        >
                                            <Edit3 className="h-4 w-4" />
                                            Reschedule
                                        </Button>
                                    </div>
                                )}

                                {/* Booking Details */}
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3">
                                            <Users className="my-auto h-5 w-5 text-blue-600" />
                                            <div>
                                                <p className="font-medium text-gray-900">{selectedBooking?.pemesan?.pegawai?.name}</p>
                                                <p className="text-xs text-gray-600">{selectedBooking?.pemesan?.pegawai?.biro?.nama_biro}</p>
                                                <p className="text-xs text-gray-500">{selectedBooking.no_hp}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <Calendar className="h-5 w-5 text-green-600" />
                                            <div>
                                                <p className="font-medium text-gray-900">Tanggal kegiatan</p>
                                                <p className="text-sm text-gray-600">{formatTanggalIna(selectedBooking.tanggal_penggunaan)}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <Clock className="h-5 w-5 text-orange-600" />
                                            <div>
                                                <p className="font-medium text-gray-900">Waktu kegiatan</p>
                                                <p className="text-sm text-gray-600">
                                                    {selectedBooking.jam_mulai.slice(0, 5)} - {selectedBooking.jam_selesai.slice(0, 5)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <Building className="h-5 w-5 text-purple-600" />
                                            <div>
                                                <p className="font-medium text-gray-900">Info Ruangan</p>
                                                <p className="text-xs text-gray-600">{selectedBooking.ruangans.nama_ruangan}</p>
                                                <p className="text-xs text-gray-600">{selectedBooking.ruangans.lokasi}</p>
                                                <p className="text-xs text-gray-600">Kapasitas {selectedBooking.ruangans.kapasitas} Orang</p>
                                            </div>
                                        </div>

                                        <div>
                                            <p className="mb-2 font-medium text-gray-900">Keperluan/ Kegiatan</p>
                                            <p className="rounded-md bg-gray-50 p-3 text-sm text-gray-700">{selectedBooking.deskripsi}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <Presentation className="h-5 w-5 text-green-600" />
                                            <div>
                                                <p className="font-medium text-gray-900">Jenis Rapat</p>
                                                <p className="text-sm text-gray-600">{selectedBooking.jenis_rapat}</p>
                                            </div>
                                        </div>

                                        {kebutuhanDanDukungan.map((need: any, index: any) => {
                                            const Icon = need.icon;

                                            return (
                                                <div
                                                    className="flex w-full items-center gap-4 rounded-xl bg-linear-to-r from-violet-50 to-purple-50 px-4 py-2.5 text-left transition-all duration-200"
                                                    key={index}
                                                >
                                                    {/* Custom Checkbox */}
                                                    {need.isCheck == 1 ? (
                                                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 border-violet-600 bg-violet-600 transition-all duration-200">
                                                            <svg
                                                                className="h-4 w-4 text-white"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                stroke="currentColor"
                                                                strokeWidth={3}
                                                            >
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        </div>
                                                    ) : (
                                                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white transition-all duration-200">
                                                            <XCircle className="h-6 w-6 text-red-500" />
                                                        </div>
                                                    )}

                                                    {/* Icon & Label */}
                                                    <div className="flex flex-1 items-center gap-3">
                                                        <div className="rounded-lg bg-violet-100 p-2.5 transition-colors duration-200">
                                                            <Icon
                                                                className={`h-5 w-5 ${need.isCheck == 1 ? `text-violet-900` : `text-gray-500`} transition-colors duration-200`}
                                                            />
                                                        </div>
                                                        <div>
                                                            <p
                                                                className={`text-sm font-semibold ${need.isCheck == 1 ? `text-violet-900` : `text-gray-500`} transition-colors duration-200`}
                                                            >
                                                                {need.label}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Admin Message Display for Disetujui/Rejected */}
                                {selectedBooking.keterangan &&
                                    selectedBooking.status !== 'pending' &&
                                    (() => {
                                        // Mapping warna berdasarkan status
                                        const colorMap: any = {
                                            booked: {
                                                border: 'border-green-200',
                                                bg: 'bg-green-50',
                                                icon: 'text-green-600',
                                                title: 'text-green-900',
                                                text: 'text-green-800',
                                            },
                                            rejected: {
                                                border: 'border-red-200',
                                                bg: 'bg-red-50',
                                                icon: 'text-red-600',
                                                title: 'text-red-900',
                                                text: 'text-red-800',
                                            },
                                        };

                                        const color = colorMap[selectedBooking.status] ?? colorMap['in_progress'];

                                        return (
                                            <div className={`rounded-lg border ${color.border} ${color.bg} p-4`}>
                                                <div className="mb-2 flex items-center gap-2">
                                                    <MessageSquare className={`h-4 w-4 ${color.icon}`} />
                                                    <h4 className={`font-medium ${color.title}`}>Pesan dari Admin</h4>
                                                </div>
                                                <p className={`text-sm ${color.text}`}>{selectedBooking.keterangan}</p>
                                            </div>
                                        );
                                    })()}

                                <Separator />

                                {/* Action Section */}
                                {selectedBooking.status != 'rejected' && (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <MessageSquare className="h-5 w-5 text-blue-600" />
                                            <h4 className="font-medium text-gray-900">Persetujuan:</h4>
                                        </div>

                                        {!actionType && (
                                            <div className="flex gap-3">
                                                <Button
                                                    variant="outline"
                                                    className="flex-1 border-red-200 bg-transparent text-red-700 hover:bg-red-50"
                                                    onClick={() => handleActionClick('rejected')}
                                                >
                                                    <X className="mr-2 h-4 w-4" />
                                                    Tolak Pemesanan
                                                </Button>
                                                {/* <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={() => handleActionClick('approved')}>
                                                <CheckCircle className="mr-2 h-4 w-4" />
                                                Setujui Pemesanan
                                            </Button> */}
                                            </div>
                                        )}

                                        {actionType && (
                                            <div className="space-y-4 rounded-lg border bg-gray-50 p-4">
                                                <div className="flex items-center gap-2">
                                                    {actionType === 'approved' ? (
                                                        <CheckCircle className="h-5 w-5 text-green-600" />
                                                    ) : (
                                                        <AlertCircle className="h-5 w-5 text-red-600" />
                                                    )}
                                                    <h5 className="font-medium">
                                                        {actionType === 'approved' ? 'Menyetujui Pemesanan' : 'Menolak Pemesanan'}
                                                    </h5>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="admin-message">
                                                        Pesan untuk Pengaju
                                                        {actionType === 'rejected' && <span className="text-red-500">*</span>}
                                                    </Label>
                                                    <Textarea
                                                        id="admin-message"
                                                        placeholder={
                                                            actionType === 'approved'
                                                                ? 'Tambahkan catatan atau instruksi khusus (opsional)...'
                                                                : 'Jelaskan alasan penolakan pemesanan...'
                                                        }
                                                        value={adminMessage}
                                                        onChange={(e) => setAdminMessage(e.target.value)}
                                                        rows={3}
                                                        className="mt-1 resize-none"
                                                    />
                                                    {actionType === 'rejected' && !adminMessage.trim() && (
                                                        <p className="text-sm text-red-600">Pesan wajib diisi untuk penolakan</p>
                                                    )}
                                                </div>

                                                <div className="flex gap-2 pt-2">
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => {
                                                            setActionType(null);
                                                            setAdminMessage('');
                                                        }}
                                                        disabled={isProcessing}
                                                    >
                                                        Batal
                                                    </Button>
                                                    <Button
                                                        onClick={() => {
                                                            if (actionType === 'approved') {
                                                                handleSubmitStatus(selectedBooking.kode_booking);
                                                            } else {
                                                                handleSubmitStatus(selectedBooking.kode_booking);
                                                            }
                                                        }}
                                                        disabled={isProcessing || (actionType === 'rejected' && !adminMessage.trim())}
                                                        className={
                                                            actionType === 'approved'
                                                                ? 'bg-green-600 hover:bg-green-700'
                                                                : 'bg-red-600 hover:bg-red-700'
                                                        }
                                                    >
                                                        {isProcessing
                                                            ? 'Memproses...'
                                                            : actionType === 'approved'
                                                              ? 'Konfirmasi Setuju'
                                                              : 'Konfirmasi Tolak'}
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Dialog open={showRescheduleDialog} onOpenChange={setShowRescheduleDialog}>
                    <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <Edit3 className="h-5 w-5 text-blue-600" />
                                Reschedule Pemesanan
                            </DialogTitle>
                        </DialogHeader>

                        <div className="space-y-4">
                            <FormProvider {...methods}>
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                    <FormBooking />
                                    <Button type="submit" className="w-full">
                                        Update Pemesanan
                                    </Button>
                                </form>
                            </FormProvider>
                        </div>

                        <DialogFooter className="flex gap-2">
                            <Button variant="outline" onClick={() => setShowRescheduleDialog(false)}>
                                Batal
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
