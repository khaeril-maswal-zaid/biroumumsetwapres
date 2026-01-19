'use client';

import { StatusBadge } from '@/components/badges/StatusBadge';
import { BottomNavigation } from '@/components/biroumum/bottom-navigation';
import { PageHeader } from '@/components/biroumum/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Head, router } from '@inertiajs/react';
import {
    AlertCircle,
    AlertTriangle,
    Calendar,
    Car,
    CheckCircle,
    Clock,
    Cookie,
    ImageIcon,
    MapPin,
    MessageSquare,
    Monitor,
    Package,
    Presentation,
    Search,
    User,
    Utensils,
    Video,
    Wrench,
    XCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';

export default function RequestHistory({ requestHistory }: any) {
    useEffect(() => {
        const interval = setInterval(() => {
            router.reload({ only: ['requestHistory'] });
        }, 60 * 1000); // 1 * 60 detik

        return () => clearInterval(interval);
    }, []);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRequest, setSelectedRequest] = useState<any>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleComplete = async (requestCode: string, type: string) => {
        setIsProcessing(true);

        const routesMap: Record<string, string> = {
            supplies: 'permintaanatk.statusconfir',
            damage: 'kerusakangedung.statusconfir',
        };

        const nameRoute = routesMap[type];

        if (nameRoute) {
            router.patch(
                route(nameRoute, requestCode),
                { action: 'confirmed' },
                {
                    onSuccess: () => {
                        setIsProcessing(false);
                        setIsDetailsOpen(false);
                    },
                    onError: (errors) => {
                        console.log('Validation Errors: ', errors);
                    },
                },
            );
        }
    };

    // Filter requests based on search term, type, and status
    const filteredRequests = requestHistory.filter((request: any) => {
        const matchesSearch =
            request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            request.deskripsi.toLowerCase().includes(searchTerm.toLowerCase()) ||
            request.code.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    const handleViewDetails = (request: any) => {
        setSelectedRequest(request);
        setIsDetailsOpen(true);
    };

    const handleViewImage = (imageUrl: string) => {
        setSelectedImage(imageUrl);
        setIsImageViewerOpen(true);
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'booking':
                return <Calendar className="h-4 w-4" />;
            case 'vehicle':
                return <Car className="h-4 w-4" />;
            case 'supplies':
                return <Package className="h-4 w-4" />;
            case 'damage':
                return <Wrench className="h-4 w-4" />;
            default:
                return <Calendar className="h-4 w-4" />;
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        }).format(date);
    };

    const kebutuhanDanDukungan = [
        {
            label: 'Snack/ Makanan Ringan',
            icon: Cookie,
            isCheck: selectedRequest?.is_makanan_ringan,
        },
        {
            label: 'Makan Siang',
            icon: Utensils,
            isCheck: selectedRequest?.is_makanan_berat,
        },
        {
            label: 'Rapat Hybrid',
            icon: Video,
            isCheck: selectedRequest?.is_hybrid,
        },
        {
            label: 'Dukungan IT',
            icon: Monitor,
            isCheck: selectedRequest?.is_ti_support,
        },
    ];

    return (
        <>
            <Head title="Laporan Kerusakan Gedung" />
            <div className="mx-auto min-h-screen w-full max-w-md bg-gray-50">
                <div className="pb-20">
                    <div className="space-y-6 p-4">
                        <PageHeader title="Riwayat Permintaan" backUrl="/" />

                        {/* Filters */}
                        <Card className="gap-3">
                            <CardHeader>
                                <CardTitle>Filter Riwayat</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col gap-4">
                                    <div className="flex w-full max-w-sm items-center space-x-2">
                                        <Input
                                            placeholder="Cari permintaan..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full"
                                        />
                                        <Search className="h-4 w-4 text-gray-400" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Request List */}
                        <div className="space-y-3">
                            {filteredRequests.length === 0 ? (
                                <Card>
                                    <CardContent className="p-8 text-center">
                                        <p className="text-gray-500">Tidak ada riwayat permintaan yang ditemukan</p>
                                    </CardContent>
                                </Card>
                            ) : (
                                filteredRequests.map((request: any) => (
                                    <Card key={request.code} className="gap-0 py-2 transition-shadow hover:shadow-md">
                                        <CardContent className="p-4">
                                            <div className="flex items-start justify-between">
                                                <div className="flex flex-1 items-start space-x-3">
                                                    <div className="mt-1 shrink-0">{getTypeIcon(request.id)}</div>
                                                    <div className="min-w-0 flex-1">
                                                        <div className="mb-1 flex items-center gap-2">
                                                            <span className="font-mono text-xs text-gray-500">{request.code}</span>
                                                            <Badge variant="outline" className="text-xs">
                                                                {request.type}
                                                            </Badge>
                                                        </div>
                                                        <h3 className="truncate font-semibold text-gray-900">{request.title}</h3>
                                                        <p className="line-clamp-1 text-sm text-gray-600">{request?.info}</p>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end gap-2">
                                                    <StatusBadge status={request.status} isRead={request.is_read} />
                                                    <Button variant="ghost" size="sm" onClick={() => handleViewDetails(request)} className="text-xs">
                                                        Detail
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                <BottomNavigation />

                {/* Request Details Dialog */}
                <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                    <DialogContent className="max-h-[90vh] overflow-y-auto px-10 pt-12 sm:max-w-2xl">
                        <DialogHeader className="mb-4">
                            <DialogTitle className="flex items-center gap-2">
                                {selectedRequest && getTypeIcon(selectedRequest.type)}
                                Detail {selectedRequest && selectedRequest.type}
                            </DialogTitle>
                            <DialogDescription>
                                {selectedRequest &&
                                    selectedRequest.id === 'booking' &&
                                    'Detail pemesanan ruang rapat Anda, termasuk waktu, tempat, dan status persetujuan dari admin.'}

                                {selectedRequest &&
                                    selectedRequest.id === 'supplies' &&
                                    'Detail permintaan Alat Tulis Kantor (ATK) Anda, beserta status dan tanggapan dari admin.'}

                                {selectedRequest &&
                                    selectedRequest.id === 'damage' &&
                                    'Detail laporan kerusakan gedung yang Anda sampaikan, termasuk status tindak lanjut oleh petugas.'}

                                {selectedRequest &&
                                    selectedRequest.id === 'vehicle' &&
                                    ' Detail permintaan kendaraan dinas Anda, lengkap dengan jadwal penggunaan dan status persetujuan.'}
                            </DialogDescription>
                        </DialogHeader>

                        {selectedRequest && (
                            <div className="space-y-6">
                                {/* Status and Request Info */}
                                <div className="flex flex-col gap-4 rounded-lg bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <div className="mb-2 flex items-center gap-1">
                                            <Calendar className="h-4 w-4 text-gray-500" />
                                            <span className="text-xs text-gray-600">{formatDate(selectedRequest.created_at)}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span className="font-mono text-sm font-medium text-gray-700">
                                                Kode Permintaan: {selectedRequest.code}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <StatusBadge status={selectedRequest.status} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3">
                                            <User className="my-auto h-5 w-5 text-blue-600" />
                                            <div>
                                                <p className="font-medium text-gray-900">{selectedRequest?.user?.pegawai?.name}</p>
                                                <p className="text-xs text-gray-600">{selectedRequest?.user?.pegawai?.biro?.nama_biro}</p>
                                                <p className="text-xs text-gray-500">{selectedRequest.no_hp}</p>
                                            </div>
                                        </div>

                                        {/* Request Details based on type */}
                                        {selectedRequest.id === 'booking' && (
                                            <>
                                                <div className="flex items-center gap-3">
                                                    <Calendar className="h-5 w-5 text-green-600" />
                                                    <div>
                                                        <p className="font-medium text-gray-900">Tanggal kegiatan</p>
                                                        <p className="text-sm text-gray-600">{selectedRequest.subtitle}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <Clock className="h-5 w-5 text-orange-600" />
                                                    <div>
                                                        <p className="font-medium text-gray-900">Waktu kegiatan</p>
                                                        <p className="text-sm text-gray-600">{selectedRequest.time}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <Calendar className="h-5 w-5 text-purple-600" />
                                                    <div>
                                                        <p className="font-medium text-gray-900">Info Ruangan</p>
                                                        <p className="text-xs text-gray-600">{selectedRequest.ruangans.nama_ruangan}</p>
                                                        <p className="text-xs text-gray-600">{selectedRequest.ruangans.lokasi}</p>
                                                        <p className="text-xs text-gray-600">Kapasitas {selectedRequest.ruangans.kapasitas} Orang</p>
                                                    </div>
                                                </div>

                                                <div>
                                                    <p className="mb-2 font-medium text-gray-900">Keperluan/ Kegiatan</p>
                                                    <p className="rounded-md bg-gray-50 p-3 text-sm text-gray-700">{selectedRequest.deskripsi}</p>
                                                </div>
                                            </>
                                        )}

                                        {selectedRequest.id === 'damage' && (
                                            <>
                                                <div className="flex items-start gap-3">
                                                    <MapPin className="mt-0.5 h-5 w-5 text-green-600" />
                                                    <div>
                                                        <p className="font-medium text-gray-900">Lokasi</p>
                                                        <p className="text-sm text-gray-600">{selectedRequest.info}</p>
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                        {selectedRequest.id === 'supplies' && (
                                            <>
                                                <div className="flex items-center gap-3">
                                                    <Package className="h-5 w-5 text-green-600" />
                                                    <div>
                                                        <p className="font-medium text-gray-900">Total Item</p>
                                                        <p className="text-sm text-gray-600">{selectedRequest.title} jenis barang</p>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    <div className="space-y-4">
                                        {selectedRequest.id === 'booking' && (
                                            <>
                                                <div className="flex items-center gap-3">
                                                    <Presentation className="h-5 w-5 text-green-600" />
                                                    <div>
                                                        <p className="font-medium text-gray-900">Jenis Rapat</p>
                                                        <p className="text-sm text-gray-600">{selectedRequest.jenis_rapat}</p>
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
                                            </>
                                        )}

                                        {selectedRequest.id === 'damage' && (
                                            <>
                                                <div className="flex items-center gap-3">
                                                    <Wrench className="h-5 w-5 text-purple-600" />
                                                    <div>
                                                        <p className="font-medium text-gray-900">Nama Item Rusak</p>
                                                        <p className="text-sm text-gray-600">{selectedRequest.title}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <AlertTriangle className="h-5 w-5 text-purple-600" />
                                                    <div>
                                                        <p className="font-medium text-gray-900">Kategori Kerusakan</p>
                                                        <p className="text-sm text-gray-600">{selectedRequest?.kategori?.name}</p>
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                        {selectedRequest.id != 'booking' && (
                                            <div>
                                                <p className="mb-2 font-medium text-gray-900">Keterangan</p>
                                                <p className="rounded-md bg-gray-50 p-3 text-sm text-gray-700">{selectedRequest.deskripsi}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {selectedRequest.id === 'supplies' && (
                                    <>
                                        <p className="mb-3 font-medium text-gray-900">Daftar Barang yang Diminta</p>
                                        <div className="space-y-3">
                                            {selectedRequest.daftarkebutuhan.map((item: any, index: number) => (
                                                <div key={index} className="rounded-lg border bg-gray-50 p-4">
                                                    <div className="mb-3 flex items-center gap-3">
                                                        <Package className="h-4 w-4 text-gray-500" />
                                                        <span className="flex-1 text-sm font-medium">{item.name}</span>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="text-center">
                                                            <p className="mb-1 text-xs text-gray-500">Diminta</p>
                                                            <Badge variant="outline" className="border-blue-200 bg-blue-50 font-medium text-blue-700">
                                                                {item.requested} {item.satuan}
                                                            </Badge>
                                                        </div>

                                                        <div className="text-center">
                                                            <p className="mb-1 text-xs text-gray-500">Disetujui</p>
                                                            <Badge
                                                                variant="outline"
                                                                className={`font-medium ${
                                                                    item.approved
                                                                        ? item.approved == item.requested
                                                                            ? 'border-green-200 bg-green-50 text-green-700'
                                                                            : 'border-yellow-200 bg-yellow-50 text-yellow-700'
                                                                        : 'border-red-200 bg-red-50 text-red-500'
                                                                }`}
                                                            >
                                                                {item.approved} {item.satuan}
                                                                {/* {item.approved ? `${item.approved} ${item.satuan}` : 'Belum diproses'} */}
                                                            </Badge>
                                                        </div>
                                                    </div>

                                                    {/* Status indicator */}
                                                    {selectedRequest.status !== 'pending' && (
                                                        <div className="mt-2 border-t border-gray-200 pt-2">
                                                            <div className="flex items-center justify-center gap-1">
                                                                {item.approved == item.requested ? (
                                                                    <>
                                                                        <CheckCircle className="h-3 w-3 text-green-600" />
                                                                        <span className="text-xs text-green-600">Disetujui penuh</span>
                                                                    </>
                                                                ) : item.approved > 0 ? (
                                                                    <>
                                                                        <AlertCircle className="h-3 w-3 text-yellow-600" />
                                                                        <span className="text-xs text-yellow-600">Disetujui sebagian</span>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <AlertTriangle className="h-3 w-3 text-red-600" />
                                                                        <span className="text-xs text-red-600">Tidak disetujui/ Belum terpenuhi</span>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}

                                {/* Photos Section */}
                                {selectedRequest.id === 'damage' && selectedRequest.picture.length > 0 && (
                                    <div>
                                        <p className="mb-3 font-medium text-gray-900">Foto Kerusakan ({selectedRequest.picture.length})</p>
                                        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                                            {selectedRequest.picture.map((photo: string, index: number) => (
                                                <div
                                                    key={index}
                                                    className="relative aspect-video cursor-pointer overflow-hidden rounded-lg border transition-colors hover:border-blue-300"
                                                    onClick={() => handleViewImage(photo)}
                                                >
                                                    <img
                                                        src={`/storage/${photo}` || '/placeholder.svg'}
                                                        alt={`Foto kerusakan ${index + 1}`}
                                                        className="object-cover"
                                                    />
                                                    <div className="bg-opacity-0 hover:bg-opacity-10 absolute inset-0 flex items-center justify-center transition-all">
                                                        <ImageIcon className="h-6 w-6 text-white opacity-0 transition-opacity hover:opacity-100" />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Admin Message Display for Approved/Rejected */}
                                {selectedRequest.keterangan &&
                                    selectedRequest.status !== 'pending' &&
                                    (() => {
                                        // Mapping warna berdasarkan status
                                        const colorMap: any = {
                                            confirmed: {
                                                border: 'border-green-200',
                                                bg: 'bg-green-50',
                                                icon: 'text-green-600',
                                                title: 'text-green-900',
                                                text: 'text-green-800',
                                            },
                                            in_progress: {
                                                border: 'border-blue-200',
                                                bg: 'bg-blue-50',
                                                icon: 'text-blue-600',
                                                title: 'text-blue-900',
                                                text: 'text-blue-800',
                                            },
                                            cancelled: {
                                                border: 'border-red-200',
                                                bg: 'bg-red-50',
                                                icon: 'text-red-600',
                                                title: 'text-red-900',
                                                text: 'text-red-800',
                                            },
                                            rejected: {
                                                border: 'border-red-200',
                                                bg: 'bg-red-50',
                                                icon: 'text-red-600',
                                                title: 'text-red-900',
                                                text: 'text-red-800',
                                            },
                                        };

                                        const color = colorMap[selectedRequest.status] ?? colorMap['in_progress'];

                                        return (
                                            <div className={`rounded-lg border ${color.border} ${color.bg} p-4`}>
                                                <div className="mb-2 flex items-center gap-2">
                                                    <MessageSquare className={`h-4 w-4 ${color.icon}`} />
                                                    <h4 className={`font-medium ${color.title}`}>Pesan dari Admin</h4>
                                                </div>
                                                <p className={`text-sm ${color.text}`}>{selectedRequest.keterangan}</p>
                                            </div>
                                        );
                                    })()}

                                <Separator />

                                {/* User Completion Section for Approved Items */}
                                {selectedRequest.status === 'in_progress' && (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle className="h-5 w-5 text-green-600" />
                                            <h4 className="font-medium text-gray-900">Konfirmasi Selesai</h4>
                                        </div>

                                        <div className="rounded-lg border bg-green-50 p-4">
                                            <p className="mb-3 text-sm text-green-800">
                                                Permintaan Anda telah disetujui. Silakan konfirmasi setelah
                                                {selectedRequest.type === 'vehicle'
                                                    ? ' menggunakan kendaraan'
                                                    : selectedRequest.type === 'supplies'
                                                      ? ' mendapatkan barang'
                                                      : ' perbaikan selesai'}
                                                .
                                            </p>

                                            <div className="flex gap-2 pt-3">
                                                <Button
                                                    onClick={() => handleComplete(selectedRequest.code, selectedRequest.type)}
                                                    disabled={isProcessing}
                                                    className="bg-green-600 hover:bg-green-700"
                                                >
                                                    <CheckCircle className="mr-2 h-4 w-4" />
                                                    {isProcessing ? 'Memproses...' : 'Konfirmasi Selesai'}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDetailsOpen(false)} disabled={isProcessing}>
                                Tutup
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Image & Video Viewer Dialog */}
                <Dialog open={isImageViewerOpen} onOpenChange={setIsImageViewerOpen}>
                    <DialogContent className="overflow-hidden p-0 sm:max-w-3xl">
                        <DialogHeader className="p-4 pb-2">
                            <DialogTitle>Foto Kerusakan</DialogTitle>
                        </DialogHeader>

                        {selectedImage && (
                            <div className="relative flex items-center justify-center bg-black/5 p-4">
                                <img
                                    src={selectedImage ? `/storage/${selectedImage}` : '/placeholder.svg'}
                                    alt="Foto kerusakan"
                                    className="max-h-[70vh] w-auto rounded-md object-contain"
                                />
                            </div>
                        )}

                        <DialogFooter className="p-4 pt-2">
                            <Button variant="outline" onClick={() => setIsImageViewerOpen(false)}>
                                Tutup
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
}
