'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Label } from '@radix-ui/react-label';
import { Separator } from '@radix-ui/react-separator';
import {
    AlertCircle,
    AlertTriangle,
    CheckCircle,
    Hash,
    ImageIcon,
    MapPin,
    MessageSquare,
    NotebookText,
    Search,
    Settings,
    Users,
    Wrench,
    X,
} from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function DamagesAdmin({ kerusakan }: any) {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedDamage, setSelectedDamage] = useState<any>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [adminMessage, setAdminMessage] = useState('');
    const [actionType, setActionType] = useState<'cancelled' | 'confirmed' | null>(null);

    // Filter damages based on search term and status
    const filteredDamages = kerusakan.data.filter((damage: any) => {
        const matchesSearch =
            damage?.pelapor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            damage.lokasi.toLowerCase().includes(searchTerm.toLowerCase()) ||
            damage.item.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || damage.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const handleViewDetails = (damage: any) => {
        setSelectedDamage(damage);
        setIsDetailsOpen(true);
    };

    const handleActionClick = (action: 'cancelled' | 'confirmed') => {
        setActionType(action);
        setAdminMessage('');
    };

    const handleViewImage = (imageUrl: string) => {
        setSelectedImage(imageUrl);
        setIsImageViewerOpen(true);
    };

    const handleSubmit = async (raportCode: string) => {
        setIsProcessing(true);
        router.patch(
            route('kerusakangedung.status', raportCode),
            {
                action: actionType,
                message: adminMessage,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsProcessing(false);
                    setIsDetailsOpen(false);
                    setAdminMessage('');
                    setActionType(null);
                },
                onError: (errors) => {
                    console.log('Validation Errors: ', errors);
                },
            },
        );
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Menunggu</Badge>;
            case 'confirmed':
                return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Selesai</Badge>;
            case 'cancelled':
                return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Ditolak</Badge>;
            default:
                return <Badge variant="outline">Unknown</Badge>;
        }
    };

    const getUrgencyBadge = (urgency: string) => {
        switch (urgency) {
            case 'rendah':
                return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">Rendah</Badge>;
            case 'sedang':
                return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Sedang</Badge>;
            case 'tinggi':
                return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Tinggi</Badge>;
            default:
                return <Badge variant="outline">Unknown</Badge>;
        }
    };

    const formatTanggalIna = (tanggal: string) => {
        return new Intl.DateTimeFormat('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        }).format(new Date(tanggal));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Laporan Kerusakan</CardTitle>
                        <CardDescription>Semua laporan kerusakan gedung yang telah diajukan.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div className="flex w-full max-w-sm items-center space-x-2">
                                <Search className="h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Cari nama, lokasi, atau nama  item rusak..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full"
                                />
                            </div>
                            <div className="flex items-center space-x-2">
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Filter Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Status</SelectItem>
                                        <SelectItem value="pending">Menunggu</SelectItem>
                                        <SelectItem value="confirmed">Selesai</SelectItem>
                                        <SelectItem value="cancelled">Ditolak</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Kode Laporan</TableHead>
                                        <TableHead>Nama Pelapor</TableHead>
                                        <TableHead>Lokasi</TableHead>
                                        <TableHead className="hidden md:table-cell">Nama Item Rusak</TableHead>
                                        <TableHead className="hidden lg:table-cell">Urgensi</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="hidden md:table-cell">Foto</TableHead>
                                        <TableHead className="text-right">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredDamages.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="py-4 text-center text-gray-500">
                                                Tidak ada laporan kerusakan yang ditemukan
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredDamages.map((damage: any) => (
                                            <TableRow key={damage.kode_pelaporan}>
                                                <TableCell>{damage.kode_pelaporan}</TableCell>
                                                <TableCell>
                                                    <div className="font-medium">{damage?.pelapor.name}</div>
                                                    <div className="text-sm text-gray-500">{damage?.pelapor.unit_kerja}</div>
                                                </TableCell>
                                                <TableCell>{damage.lokasi}</TableCell>
                                                <TableCell className="hidden md:table-cell">{damage.item}</TableCell>
                                                <TableCell className="hidden lg:table-cell">{getUrgencyBadge(damage.urgensi)}</TableCell>
                                                <TableCell>{getStatusBadge(damage.status)}</TableCell>
                                                <TableCell className="hidden md:table-cell">
                                                    {damage.picture.length > 0 ? (
                                                        <Badge variant="outline" className="flex items-center gap-1">
                                                            <ImageIcon className="h-3 w-3" />
                                                            <span>{damage.picture.length}</span>
                                                        </Badge>
                                                    ) : (
                                                        <span className="text-sm text-gray-500">-</span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="sm" onClick={() => handleViewDetails(damage)}>
                                                        Detail
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                {/* Booking Details Dialog */}
                <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                    <DialogContent className="max-h-[90vh] overflow-y-auto px-10 pt-12 sm:max-w-2xl">
                        <DialogHeader className="mb-4">
                            <DialogTitle className="flex items-center gap-2">
                                <Wrench className="h-5 w-5" />
                                Detail Laporan Kerusakan
                            </DialogTitle>
                            <DialogDescription>Tinjau informasi laporan kerusakan dan berikan tindakan dengan pesan untuk pelapor.</DialogDescription>
                        </DialogHeader>

                        {selectedDamage && (
                            <div className="space-y-6">
                                {/* Status and Room Info */}
                                <div className="flex flex-col gap-4 rounded-lg bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <div className="mb-2 flex items-center gap-1">
                                            <NotebookText className="h-4 w-4 text-gray-500" />
                                            <span className="text-xs text-gray-600">{formatTanggalIna(selectedDamage.created_at)}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Hash className="h-4 w-4 text-gray-500" />
                                            <span className="font-mono text-sm font-medium text-gray-700">{selectedDamage.kode_pelaporan}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">{getStatusBadge(selectedDamage.status)}</div>
                                </div>

                                {/* Booking Details */}
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3">
                                            <Users className="my-auto h-5 w-5 text-blue-600" />
                                            <div>
                                                <p className="font-medium text-gray-900">{selectedDamage?.pelapor?.name}</p>
                                                <p className="text-xs text-gray-600">{selectedDamage?.pelapor?.unit_kerja}</p>
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

                                        <div className="flex items-center gap-3">
                                            <AlertCircle className="h-5 w-5 text-orange-600" />
                                            <div>
                                                <p className="font-medium text-gray-900">Tingkat Urgensi</p>
                                                {getUrgencyBadge(selectedDamage.urgensi)}
                                            </div>
                                        </div>
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
                                                <p className="font-medium text-gray-900">Nama Item Rusak</p>
                                                <p className="text-sm text-gray-600">{selectedDamage?.kategori.name}</p>
                                            </div>
                                        </div>

                                        <div>
                                            <p className="mb-2 font-medium text-gray-900">Deskripsi Kerusakan</p>
                                            <p className="rounded-md bg-gray-50 p-3 text-sm text-gray-700">{selectedDamage.deskripsi}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Photos Section */}
                                {selectedDamage.picture.length > 0 && (
                                    <>
                                        <p className="mb-3 font-medium text-gray-900">Foto Kerusakan ({selectedDamage.picture.length})</p>
                                        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                                            {selectedDamage.picture.map((photo: string, index: number) => (
                                                <div
                                                    key={index}
                                                    className="relative aspect-video cursor-pointer overflow-hidden rounded-lg border transition-colors hover:border-blue-300"
                                                    onClick={() => handleViewImage(photo)}
                                                >
                                                    <img
                                                        src={photo || '/placeholder.svg'}
                                                        alt={`Foto kerusakan ${index + 1}`}
                                                        className="object-cover"
                                                    />
                                                    <div className="bg-opacity-0 hover:bg-opacity-10 absolute inset-0 flex items-center justify-center bg-black transition-all">
                                                        <ImageIcon className="h-6 w-6 text-white opacity-0 transition-opacity hover:opacity-100" />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}

                                {/* Admin Message Display for Approved/Rejected */}
                                {selectedDamage.keterangan &&
                                    selectedDamage.status !== 'pending' &&
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

                                {/* Action Section */}
                                {selectedDamage.status === 'pending' && (
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
                                                            Tolak Laporan
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            className="flex-1 border-green-200 bg-transparent text-green-700 hover:bg-green-50"
                                                            onClick={() => handleActionClick('confirmed')}
                                                        >
                                                            <Settings className="mr-2 h-4 w-4" />
                                                            Terima Laporan
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        )}

                                        {actionType && (
                                            <div className="space-y-4 rounded-lg border bg-gray-50 p-4">
                                                <div className="flex items-center gap-2">
                                                    {actionType === 'confirmed' && <CheckCircle className="h-5 w-5 text-green-600" />}
                                                    {actionType === 'cancelled' && <AlertCircle className="h-5 w-5 text-red-600" />}
                                                    <h5 className="font-medium">
                                                        {actionType === 'confirmed' && 'Menyelesaikan Perbaikan'}
                                                        {actionType === 'cancelled' && 'Menolak Laporan'}
                                                    </h5>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="admin-message">
                                                        Pesan untuk Pelapor {actionType === 'cancelled' && <span className="text-red-500">*</span>}
                                                    </Label>
                                                    <Textarea
                                                        id="admin-message"
                                                        placeholder={
                                                            actionType === 'confirmed'
                                                                ? 'Konfirmasi bahwa perbaikan telah selesai dan berikan informasi terkait...'
                                                                : 'Jelaskan alasan penolakan laporan kerusakan...'
                                                        }
                                                        value={adminMessage}
                                                        onChange={(e) => setAdminMessage(e.target.value)}
                                                        rows={3}
                                                        className="mt-0.5 resize-none"
                                                    />

                                                    <p className="text-sm text-red-600">Pesan wajib diisi</p>
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
                                                            handleSubmit(selectedDamage.kode_pelaporan);
                                                        }}
                                                        disabled={isProcessing || adminMessage === ''}
                                                        className={
                                                            actionType === 'confirmed'
                                                                ? 'bg-green-600 hover:bg-green-700'
                                                                : 'bg-red-600 hover:bg-red-700'
                                                        }
                                                    >
                                                        {isProcessing
                                                            ? 'Memproses...'
                                                            : actionType === 'confirmed'
                                                              ? 'Konfirmasi Penyetujuan'
                                                              : 'Konfirmasi Penolakan'}
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
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

                {/* Image Viewer Dialog */}
                <Dialog open={isImageViewerOpen} onOpenChange={setIsImageViewerOpen}>
                    <DialogContent className="sm:max-w-3xl">
                        <DialogHeader>
                            <DialogTitle>Foto Kerusakan</DialogTitle>
                        </DialogHeader>
                        {selectedImage && (
                            <div className="relative aspect-video w-full">
                                <img src={selectedImage || '/placeholder.svg'} alt="Foto kerusakan" className="object-contain" />
                            </div>
                        )}
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsImageViewerOpen(false)}>
                                Tutup
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
