'use client';

import { StatusBadge } from '@/components/badges/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import type { BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import {
    AlertCircle,
    AlertOctagon,
    AlertTriangle,
    ArrowLeft,
    Calendar,
    CheckCircle,
    Clock,
    ImageIcon,
    MapPin,
    MessageSquare,
    Play,
    Settings,
    Trash2,
    Users,
    Wrench,
    X,
} from 'lucide-react';
import { useEffect, useState } from 'react';

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

export default function BookingDetailsPage({ selectedDamage }: any) {
    const { toast } = useToast();

    const [selectedMedia, setSelectedMedia] = useState<{ path: string; isVideo: boolean } | null>(null);
    const [isMediaViewerOpen, setIsMediaViewerOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [adminMessage, setAdminMessage] = useState<string>('');
    const [actionType, setActionType] = useState<'cancelled' | 'confirmed' | 'process' | null>(null);
    const [isUpdateProcessOpen, setIsUpdateProcessOpen] = useState(false);
    const [processDate, setProcessDate] = useState<string>('');
    const [processText, setProcessText] = useState<string>('');
    const [processLogs, setProcessLogs] = useState(selectedDamage?.log_progres);
    const [selectedUrgency, setSelectedUrgency] = useState<'tinggi' | 'rendah' | null>(null);

    const handleActionClick = (action: 'cancelled' | 'confirmed' | 'process') => {
        if (action === 'process' && selectedDamage.status === 'process') {
            setIsUpdateProcessOpen(true);
            return;
        }
        setActionType(action);
        setAdminMessage('');
    };

    const handleViewMedia = (path: string, index: number) => {
        const isVideo = path.includes('video/');
        setSelectedMedia({ path, isVideo });
        setIsMediaViewerOpen(true);
    };

    const handleSubmit = (raportCode: string) => {
        setIsProcessing(true);

        const trimmedMessage = adminMessage.trim();

        const payload: Record<string, any> = {
            action: actionType,
        };

        // Hanya kirim jika tidak kosong
        if (trimmedMessage !== '') {
            payload.message = trimmedMessage;
        }

        router.patch(route('kerusakangedung.status', raportCode), payload, {
            preserveScroll: true,
            onSuccess: () => {
                setIsProcessing(false);
                setAdminMessage('');
                setActionType(null);
                toast({ title: 'Berhasil', description: 'Status kerusakan berhasil diperbarui' });
            },
            onError: (errors) => {
                toast({ title: 'Gagal', description: Object.values(errors)[0], variant: 'destructive' });
                setIsProcessing(false);
            },
        });
    };

    const handleLogProcessSubmit = () => {
        setIsProcessing(true);

        router.post(
            route('logproses.store'),
            {
                itemLaporanKerusakan: selectedDamage.item,
                kodePelaporan: selectedDamage.kode_pelaporan,
                dateUpdateLog: processDate,
                textUpdateLog: processText,
            },
            {
                onSuccess: () => {
                    toast({ title: 'Berhasil', description: 'Log proses berhasil ditambahkan' });
                    setIsProcessing(false);
                    setIsUpdateProcessOpen(false);
                    setProcessDate('');
                    setProcessText('');
                },
                onError: (errors: object) => {
                    toast({ title: 'Gagal', description: Object.values(errors)[0], variant: 'destructive' });
                    setIsProcessing(false);
                },
            },
        );
    };

    const handleLogProcessDelete = (LogProcess: string | number) => {
        router.delete(route('logproses.destroy', LogProcess), {
            onSuccess: () => {
                toast({ title: 'Berhasil', description: 'Log proses berhasil dihapus' });
            },
            onError: (errors: object) => {
                toast({ title: 'Gagal', description: Object.values(errors)[0], variant: 'destructive' });
            },
        });
    };

    const handleSubmitUrgency = () => {
        if (!selectedUrgency) {
            alert('Silakan pilih tingkat urgensi');
            return;
        }

        setIsProcessing(true);

        router.patch(
            route('kerusakangedung.urgensi', selectedDamage.kode_pelaporan),
            {
                urgensi: selectedUrgency,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    // keep the selection visible after success (UI will reflect saved urgency)
                    setIsProcessing(false);
                    toast({ title: 'Berhasil', description: 'Urgensi kerusakan berhasil diperbarui' });
                },
                onError: (errors) => {
                    toast({
                        title: 'Validasi gagal',
                        description: Object.values(errors)[0],
                        variant: 'destructive',
                    });

                    setIsProcessing(false);
                    toast({ title: 'Gagal', description: 'Urgensi kerusakan gagal diperbarui', variant: 'destructive' });
                },
            },
        );
    };

    const getLogTypeStyle = (type: string, index: number) => {
        const isEven = index % 2 === 0;

        return {
            icon: Clock, // Single consistent icon for all log entries
            color: isEven ? 'text-blue-600' : 'text-indigo-600',
            bg: isEven ? 'bg-blue-50' : 'bg-indigo-100',
            border: isEven ? 'border-blue-200' : 'border-indigo-200',
        };
    };

    useEffect(() => {
        setProcessLogs(selectedDamage?.log_progres ?? []);
    }, [selectedDamage?.log_progres]);

    // sync selected urgency from server when selectedDamage changes
    useEffect(() => {
        setSelectedUrgency(selectedDamage?.urgensi ?? null);
    }, [selectedDamage?.urgensi]);

    const activeUrgency = selectedUrgency ?? selectedDamage?.urgensi ?? null;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Detal Laporan Kerusakan Gedung" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl bg-linear-to-br from-white to-blue-100 p-4">
                <Link href={route('kerusakangedung.index')}>
                    <Button
                        variant="ghost"
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
                            <span className="py-auto"> Detail Laporan Kerusakan</span>
                        </CardTitle>
                        <CardDescription>Tinjau informasi laporan kerusakan dan berikan tindakan dengan pesan untuk pelapor.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            <div className="flex flex-col gap-4 rounded-lg bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <div className="mb-2 flex items-center gap-1">
                                        <Calendar className="h-4 w-4 text-gray-500" />
                                        <span className="text-xs text-gray-600">{formatTanggalIna(selectedDamage.created_at)}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span className="font-mono text-sm font-medium text-gray-700">
                                            Kode Laporan: {selectedDamage.kode_pelaporan}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <StatusBadge status={selectedDamage.status} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <Users className="my-auto h-5 w-5 text-blue-600" />
                                        <div>
                                            <p className="font-medium text-gray-900">{selectedDamage?.pelapor?.pegawai?.name}</p>
                                            <p className="text-xs text-gray-600">{selectedDamage?.pelapor?.pegawai?.biro?.nama_biro}</p>
                                            <p className="text-xs text-gray-500">{selectedDamage.no_hp}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <MapPin className="mt-0.5 h-5 w-5 text-green-600" />
                                        <div>
                                            <p className="font-medium text-gray-900">Lokasi</p>
                                            <p className="text-sm text-gray-600">{selectedDamage.lokasi}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="mb-2 font-medium text-gray-900">Keterangan</p>
                                        <p className="rounded-md bg-gray-50 p-3 text-sm text-gray-700">{selectedDamage.deskripsi}</p>
                                    </div>

                                    {/* <div className="flex items-center gap-3">
                                        <AlertCircle className="h-5 w-5 text-orange-600" />
                                        <div>
                                            <p className="font-medium text-gray-900">Tingkat Urgensi</p>
                                            {getUrgencyBadge(selectedDamage.urgensi)}
                                        </div>
                                    </div> */}
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <Wrench className="h-5 w-5 text-purple-600" />
                                        <div>
                                            <p className="font-medium text-gray-900">Nama Item Rusak</p>
                                            <p className="text-sm text-gray-600">{selectedDamage.item}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <AlertTriangle className="h-5 w-5 text-purple-600" />
                                        <div>
                                            <p className="font-medium text-gray-900">Kategori Kerusakan</p>
                                            <p className="text-sm text-gray-600">{selectedDamage?.kategori.name}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Foto / Video */}
                            {selectedDamage.picture.length > 0 && (
                                <>
                                    <p className="mb-3 font-medium text-gray-900">Foto / Video Kerusakan ({selectedDamage.picture.length})</p>
                                    <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                                        {selectedDamage.picture.map((media: string, index: number) => {
                                            const isVideo = media.includes('video/');
                                            return (
                                                <div
                                                    key={index}
                                                    className="relative aspect-video cursor-pointer overflow-hidden rounded-lg border transition-colors hover:border-blue-300"
                                                    onClick={() => handleViewMedia(media, index)}
                                                >
                                                    {isVideo ? (
                                                        <video
                                                            src={`/storage/${media}`}
                                                            className="h-full w-full object-cover"
                                                            muted
                                                            preload="metadata"
                                                        />
                                                    ) : (
                                                        <img
                                                            src={`/storage/${media}?height=300&width=400&query=damage report media ${index + 1}`}
                                                            alt={`Media kerusakan ${index + 1}`}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    )}
                                                    <div className="bg-opacity-0 hover:bg-opacity-10 absolute inset-0 flex items-center justify-center transition-all">
                                                        {isVideo ? (
                                                            <Play className="h-6 w-6 text-white opacity-100" />
                                                        ) : (
                                                            <ImageIcon className="h-6 w-6 text-white opacity-0 transition-opacity hover:opacity-100" />
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </>
                            )}

                            {selectedDamage.keterangan &&
                                selectedDamage.status === 'confirmed' &&
                                (() => {
                                    const colorMap: any = {
                                        confirmed: {
                                            border: 'border-green-200',
                                            bg: 'bg-green-50',
                                            icon: 'text-green-600',
                                            title: 'text-green-900',
                                            text: 'text-green-800',
                                        },
                                        cancelled: {
                                            border: 'border-red-200',
                                            bg: 'bg-red-50',
                                            icon: 'text-red-600',
                                            title: 'text-red-900',
                                            text: 'text-red-800',
                                        },
                                    };

                                    const color = colorMap[selectedDamage.status] ?? colorMap['confirmed'];

                                    return (
                                        <div className={`rounded-lg border ${color.border} ${color.bg} p-4`}>
                                            <div className="mb-2 flex items-center gap-2">
                                                <MessageSquare className={`h-4 w-4 ${color.icon}`} />
                                                <h4 className={`font-medium ${color.title}`}>Pesan dari Admin</h4>
                                            </div>
                                            <p className={`text-sm ${color.text}`}>{selectedDamage.keterangan}</p>
                                        </div>
                                    );
                                })()}

                            <Separator />

                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                                    <h4 className="font-semibold text-gray-900">Tentukan Tingkat Urgensi Kerusakan</h4>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    {/* Prioritas Tinggi */}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (selectedDamage?.urgensi) return;
                                            setSelectedUrgency('tinggi');
                                        }}
                                        disabled={!!selectedDamage?.urgensi}
                                        className={cn(
                                            'rounded-lg border-2 p-4 text-left transition-all duration-200',
                                            activeUrgency === 'tinggi'
                                                ? 'border-red-500 bg-linear-to-r from-red-50 to-rose-50 ring-2 ring-red-200'
                                                : 'border-gray-200 bg-white hover:border-red-300 hover:bg-red-50/30',
                                            selectedDamage?.urgensi && activeUrgency !== 'tinggi' && 'opacity-60',
                                            selectedDamage?.urgensi && 'cursor-not-allowed',
                                        )}
                                    >
                                        <div className="flex flex-col gap-1">
                                            {/* Radio Button & Title */}
                                            <div className="flex items-start gap-3">
                                                <div
                                                    className={cn(
                                                        'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200',
                                                        activeUrgency === 'tinggi'
                                                            ? 'border-red-600 bg-red-600'
                                                            : 'border-gray-300 bg-white hover:border-red-400',
                                                    )}
                                                >
                                                    {activeUrgency === 'tinggi' && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <AlertOctagon
                                                            className={cn(
                                                                'h-4 w-4 transition-colors duration-200',
                                                                activeUrgency === 'tinggi' ? 'text-red-600' : 'text-red-400',
                                                            )}
                                                        />
                                                        <p className="font-semibold text-gray-900">Prioritas Tinggi</p>
                                                    </div>
                                                </div>
                                                {activeUrgency === 'tinggi' && (
                                                    <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-semibold whitespace-nowrap text-red-700">
                                                        Dipilih
                                                    </span>
                                                )}
                                            </div>

                                            {/* Description */}
                                            <p className="text-xs text-gray-600">Urgensi: Tindakan segera diperlukan</p>
                                        </div>
                                    </button>

                                    {/* Prioritas Rendah */}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (selectedDamage?.urgensi) return;
                                            setSelectedUrgency('rendah');
                                        }}
                                        disabled={!!selectedDamage?.urgensi}
                                        className={cn(
                                            'rounded-lg border-2 px-4 py-2.5 text-left transition-all duration-200',
                                            activeUrgency === 'rendah'
                                                ? 'border-green-500 bg-linear-to-r from-green-50 to-emerald-50 ring-2 ring-green-200'
                                                : 'border-gray-200 bg-white hover:border-green-300 hover:bg-green-50/30',
                                            selectedDamage?.urgensi && activeUrgency !== 'rendah' && 'opacity-60',
                                            selectedDamage?.urgensi && 'cursor-not-allowed',
                                        )}
                                    >
                                        <div className="flex flex-col gap-1">
                                            {/* Radio Button & Title */}
                                            <div className="flex items-start gap-3">
                                                <div
                                                    className={cn(
                                                        'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200',
                                                        activeUrgency === 'rendah'
                                                            ? 'border-green-600 bg-green-600'
                                                            : 'border-gray-300 bg-white hover:border-green-400',
                                                    )}
                                                >
                                                    {activeUrgency === 'rendah' && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <AlertCircle
                                                            className={cn(
                                                                'h-4 w-4 transition-colors duration-200',
                                                                activeUrgency === 'rendah' ? 'text-green-600' : 'text-green-400',
                                                            )}
                                                        />
                                                        <p className="font-semibold text-gray-900">Prioritas Rendah</p>
                                                    </div>
                                                </div>
                                                {activeUrgency === 'rendah' && (
                                                    <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-semibold whitespace-nowrap text-green-700">
                                                        Dipilih
                                                    </span>
                                                )}
                                            </div>

                                            {/* Description */}
                                            <p className="text-xs text-gray-600">Urgensi: Tidak mendesak</p>
                                        </div>
                                    </button>
                                </div>

                                {/* Submit Button (only show when not already submitted on server) */}
                                {selectedUrgency && !selectedDamage?.urgensi && (
                                    <div className="flex gap-2 border-t pt-4">
                                        <button
                                            type="button"
                                            onClick={() => setSelectedUrgency(null)}
                                            className="flex-1 rounded-lg border-2 border-gray-300 px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50"
                                        >
                                            Batal
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleSubmitUrgency}
                                            disabled={isProcessing}
                                            className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:bg-gray-400"
                                        >
                                            {isProcessing ? 'Menyimpan...' : 'Simpan Urgensi'}
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Tindakan Admin */}
                            {(selectedDamage.status === 'pending' || selectedDamage.status === 'process') && selectedDamage.urgensi && (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <MessageSquare className="h-5 w-5 text-green-600" />
                                        <h4 className="font-medium text-gray-900">Tindakan Admin</h4>
                                    </div>

                                    {!actionType && (
                                        <div className="flex gap-2">
                                            {selectedDamage.status === 'pending' && (
                                                <>
                                                    <Button
                                                        variant="outline"
                                                        className="flex-1 border-red-200 bg-transparent text-red-700 hover:bg-red-50"
                                                        onClick={() => handleActionClick('cancelled')}
                                                    >
                                                        <X className="mr-2 h-4 w-4" />
                                                        Ditolak
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        className="flex-1 border-blue-200 bg-transparent text-blue-700 hover:bg-blue-50"
                                                        onClick={() => handleActionClick('process')}
                                                    >
                                                        <CheckCircle className="mr-2 h-4 w-4" />
                                                        Disetujui
                                                    </Button>
                                                </>
                                            )}
                                            {selectedDamage.status === 'process' && (
                                                <>
                                                    <Button
                                                        variant="outline"
                                                        className="flex-1 border-blue-200 bg-transparent text-blue-700 hover:bg-blue-50"
                                                        onClick={() => handleActionClick('process')}
                                                    >
                                                        <Settings className="mr-2 h-4 w-4" />
                                                        Update Proses
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        className="flex-1 border-green-200 bg-transparent text-green-700 hover:bg-green-50"
                                                        onClick={() => handleActionClick('confirmed')}
                                                    >
                                                        <CheckCircle className="mr-2 h-4 w-4" />
                                                        Selesai
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    )}

                                    {actionType && (
                                        <div className="space-y-4 rounded-lg border bg-gray-50 p-4">
                                            <div className="flex items-center gap-2">
                                                {actionType === 'confirmed' && selectedDamage.status === 'pending' && (
                                                    <X className="h-5 w-5 text-red-600" />
                                                )}
                                                {actionType === 'confirmed' && selectedDamage.status === 'process' && (
                                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                                )}
                                                {actionType === 'process' && <CheckCircle className="h-5 w-5 text-blue-600" />}
                                                <h5 className="font-medium">
                                                    {actionType === 'cancelled' && selectedDamage.status === 'pending' && 'Konfirmasi Penolakan'}
                                                    {actionType === 'confirmed' && selectedDamage.status === 'process' && 'Konfirmasi Selesai'}
                                                    {actionType === 'process' && 'Konfirmasi Penyetujuan'}
                                                </h5>
                                            </div>

                                            {actionType && actionType != 'confirmed' && (
                                                <div className="space-y-2">
                                                    <Label htmlFor="admin-message">
                                                        Pesan untuk Pelapor{' '}
                                                        {actionType === 'confirmed' && selectedDamage.status === 'pending' && (
                                                            <span className="text-red-500">*</span>
                                                        )}
                                                    </Label>
                                                    <Textarea
                                                        id="admin-message"
                                                        placeholder={
                                                            actionType === 'confirmed' && selectedDamage.status === 'pending'
                                                                ? 'Jelaskan alasan penolakan laporan kerusakan...'
                                                                : actionType === 'confirmed' && selectedDamage.status === 'process'
                                                                  ? 'Konfirmasi bahwa perbaikan telah selesai dan berikan informasi terkait...'
                                                                  : 'Berikan informasi terkait persetujuan dan langkah selanjutnya...'
                                                        }
                                                        value={adminMessage}
                                                        onChange={(e) => setAdminMessage(e.target.value)}
                                                        rows={3}
                                                        className="mt-1 resize-none"
                                                    />

                                                    {actionType === 'confirmed' && selectedDamage.status === 'pending' && !adminMessage.trim() && (
                                                        <p className="text-sm text-red-600">Pesan wajib diisi untuk penolakan</p>
                                                    )}
                                                </div>
                                            )}

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
                                                        handleSubmit(selectedDamage.kode_pelaporan);
                                                    }}
                                                    disabled={
                                                        isProcessing ||
                                                        (actionType === 'cancelled' && selectedDamage.status === 'pending' && !adminMessage.trim())
                                                    }
                                                    className={
                                                        actionType === 'cancelled' && selectedDamage.status === 'pending'
                                                            ? 'bg-red-600 hover:bg-red-700'
                                                            : actionType === 'process'
                                                              ? 'bg-blue-600 hover:bg-blue-700'
                                                              : 'bg-green-600 hover:bg-green-700'
                                                    }
                                                >
                                                    {isProcessing
                                                        ? 'Memproses...'
                                                        : actionType === 'cancelled' && selectedDamage.status === 'pending'
                                                          ? 'Konfirmasi Penolakan'
                                                          : actionType === 'confirmed' && selectedDamage.status === 'process'
                                                            ? 'Konfirmasi Selesai'
                                                            : 'Konfirmasi Penyetujuan'}
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {selectedDamage.status != 'pending' && selectedDamage.urgensi && (
                                <div className="lg:col-span-1">
                                    <Card className="sticky top-4">
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2 text-lg">
                                                <Clock className="h-5 w-5 text-blue-600" />
                                                Log Aktivitas Proses
                                            </CardTitle>
                                            <CardDescription>Riwayat update dan progres penanganan laporan kerusakan</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            {processLogs.length === 0 ? (
                                                <div className="flex flex-col items-center justify-center py-8 text-center">
                                                    <Clock className="mb-3 h-12 w-12 text-gray-300" />
                                                    <p className="text-sm text-gray-500">Belum ada log aktivitas</p>
                                                </div>
                                            ) : (
                                                <div className="space-y-4">
                                                    {processLogs.map((log: any, index: any) => {
                                                        const style = getLogTypeStyle(log.type, index);
                                                        const IconComponent = style.icon;
                                                        const isLatest = index === processLogs.length - 1;

                                                        return (
                                                            <div key={log.id} className="relative">
                                                                {index !== processLogs.length - 1 && (
                                                                    <div className="absolute top-8 left-4 h-full w-0.5 bg-gray-200" />
                                                                )}

                                                                <div
                                                                    className={`relative rounded-lg border p-3 transition-all hover:shadow-sm ${style.border} ${style.bg} ${
                                                                        isLatest ? 'ring-2 ring-blue-100' : ''
                                                                    }`}
                                                                >
                                                                    <div className="flex items-start gap-3">
                                                                        <div
                                                                            className={`flex h-8 w-8 items-center justify-center rounded-full border-2 bg-white ${style.border}`}
                                                                        >
                                                                            <IconComponent className={`h-4 w-4 ${style.color}`} />
                                                                        </div>

                                                                        {/* Konten teks */}
                                                                        <div className="min-w-0 flex-1">
                                                                            <div className="mb-1 flex items-center gap-2">
                                                                                <span className="text-xs font-medium text-gray-600">
                                                                                    {formatTanggalIna(log.tanggal)}
                                                                                </span>
                                                                            </div>
                                                                            <p className="text-sm leading-relaxed text-gray-700">{log.title}</p>
                                                                        </div>

                                                                        {/* Tombol hapus di kanan */}
                                                                        {selectedDamage.status === 'process' && (
                                                                            <button
                                                                                onClick={() => handleLogProcessDelete(log.id)}
                                                                                className="my-auto ml-2 text-red-400 transition-colors hover:text-red-800"
                                                                            >
                                                                                <Trash2 className="h-4 w-4" />
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Dialog open={isUpdateProcessOpen} onOpenChange={setIsUpdateProcessOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Update Proses</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="process-date">Tanggal Update</Label>
                            <Input
                                id="process-date"
                                type="date"
                                value={processDate}
                                onChange={(e) => setProcessDate(e.target.value)}
                                className="w-full"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="process-text">Keterangan Update</Label>
                            <Textarea
                                id="process-text"
                                placeholder="Berikan update terkait proses perbaikan yang sedang berlangsung..."
                                value={processText}
                                onChange={(e) => setProcessText(e.target.value)}
                                rows={3}
                                className="resize-none"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsUpdateProcessOpen(false);
                                setProcessDate('');
                                setProcessText('');
                            }}
                            disabled={isProcessing}
                        >
                            Batal
                        </Button>
                        <Button
                            onClick={handleLogProcessSubmit}
                            disabled={isProcessing || !processDate || !processText.trim()}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            {isProcessing ? 'Memproses...' : 'Update Proses'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isMediaViewerOpen} onOpenChange={setIsMediaViewerOpen}>
                <DialogContent className="overflow-hidden p-0 sm:max-w-3xl">
                    <DialogHeader className="p-4 pb-2">
                        <DialogTitle>Foto / Video Kerusakan</DialogTitle>
                    </DialogHeader>

                    {selectedMedia && (
                        <div className="relative flex items-center justify-center bg-black/5 p-4">
                            {selectedMedia.isVideo ? (
                                <video src={`/storage/${selectedMedia.path}`} controls className="max-h-[70vh] w-auto rounded-md" />
                            ) : (
                                <img
                                    src={`/storage/${selectedMedia.path}`}
                                    alt="Media kerusakan"
                                    className="max-h-[70vh] w-auto rounded-md object-contain"
                                />
                            )}
                        </div>
                    )}

                    <DialogFooter className="p-4 pt-2">
                        <Button variant="outline" onClick={() => setIsMediaViewerOpen(false)}>
                            Tutup
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
