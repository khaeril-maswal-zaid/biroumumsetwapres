'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { CheckCircle, Image, ImageIcon, MapPin, Search, User, Wrench, X } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

// Mock data for damage reports
const damages = [
    {
        id: '1',
        name: 'Budi Santoso',
        devisi: 'Biro 2',
        location: 'Lantai 2, Ruang 201',
        damageType: 'AC',
        description: 'AC tidak dingin dan mengeluarkan bunyi berisik',
        urgency: 'tinggi',
        contact: '0812-3456-7891',
        status: 'pending',
        photos: ['/placeholder.svg?height=200&width=300', '/placeholder.svg?height=200&width=300'],
        createdAt: '2025-06-10T09:30:00',
    },
    {
        id: '2',
        name: 'Siti Aminah',
        devisi: 'Biro 3',
        location: 'Lantai 1, Ruang 105',
        damageType: 'Lampu',
        description: 'Lampu berkedip dan terkadang mati sendiri',
        urgency: 'sedang',
        contact: '0812-3456-7892',
        status: 'in_progress',
        photos: ['/placeholder.svg?height=200&width=300'],
        createdAt: '2025-06-09T14:15:00',
    },
    {
        id: '3',
        name: 'Rudi Hartono',
        devisi: 'Biro 4',
        location: 'Lantai 3, Toilet Pria',
        damageType: 'Keran Air',
        description: 'Keran air bocor dan lantai menjadi basah',
        urgency: 'tinggi',
        contact: '0812-3456-7893',
        status: 'completed',
        photos: ['/placeholder.svg?height=200&width=300', '/placeholder.svg?height=200&width=300'],
        createdAt: '2025-06-08T11:45:00',
    },
    {
        id: '4',
        name: 'Dewi Lestari',
        devisi: 'Biro 1',
        location: 'Lantai 2, Ruang Rapat',
        damageType: 'Proyektor',
        description: 'Proyektor tidak menyala saat digunakan',
        urgency: 'rendah',
        contact: '0812-3456-7894',
        status: 'pending',
        photos: [],
        createdAt: '2025-06-07T16:20:00',
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

    const handleViewImage = (imageUrl: string) => {
        setSelectedImage(imageUrl);
        setIsImageViewerOpen(true);
    };

    const handleProcess = async (damageId: string) => {
        setIsProcessing(true);
        // Simulasi API call
        setTimeout(() => {
            console.log(`Damage report ${damageId} processed`);
            setIsProcessing(false);
            setIsDetailsOpen(false);
            // Di aplikasi nyata, ini akan update data dari server
        }, 1000);
    };

    const handleReject = async (damageId: string) => {
        setIsProcessing(true);
        // Simulasi API call
        setTimeout(() => {
            console.log(`Damage report ${damageId} rejected`);
            setIsProcessing(false);
            setIsDetailsOpen(false);
            // Di aplikasi nyata, ini akan update data dari server
        }, 1000);
    };

    const handleComplete = async (damageId: string) => {
        setIsProcessing(true);
        // Simulasi API call
        setTimeout(() => {
            console.log(`Damage report ${damageId} completed`);
            setIsProcessing(false);
            setIsDetailsOpen(false);
            // Di aplikasi nyata, ini akan update data dari server
        }, 1000);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Menunggu</Badge>;
            case 'in_progress':
                return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Diproses</Badge>;
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
            case 'Rendah':
                return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">Rendah</Badge>;
            case 'Sedang':
                return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Sedang</Badge>;
            case 'Tinggi':
                return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Tinggi</Badge>;
            default:
                return <Badge variant="outline">Unknown</Badge>;
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Laporan Kerusakan Gedung</h1>
                        <p className="text-gray-500">Kelola semua laporan kerusakan gedung.</p>
                    </div>

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
                                        placeholder="Cari nama, lokasi, atau jenis kerusakan..."
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
                                            <SelectItem value="in_progress">Diproses</SelectItem>
                                            <SelectItem value="completed">Selesai</SelectItem>
                                            <SelectItem value="rejected">Ditolak</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Pelapor</TableHead>
                                            <TableHead>Lokasi</TableHead>
                                            <TableHead className="hidden md:table-cell">Jenis Kerusakan</TableHead>
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
                                            filteredDamages.map((damage) => (
                                                <TableRow key={damage.kode_pelaporan}>
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

                    {/* Damage Details Dialog */}
                    <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                        <DialogContent className="sm:max-w-lg">
                            <DialogHeader>
                                <DialogTitle>Detail Laporan Kerusakan</DialogTitle>
                                <DialogDescription>Informasi lengkap tentang laporan kerusakan gedung.</DialogDescription>
                            </DialogHeader>
                            {selectedDamage && (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-medium">{selectedDamage.item}</h3>
                                        {getStatusBadge(selectedDamage.status)}
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <User className="h-4 w-4 text-gray-500" />
                                            <div>
                                                <p className="text-sm font-medium">{selectedDamage?.pelapor.name}</p>
                                                <p className="text-xs text-gray-500">{selectedDamage?.pelapor.unit_kerja}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4 text-gray-500" />
                                            <p className="text-sm">{selectedDamage.lokasi}</p>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Wrench className="h-4 w-4 text-gray-500" />
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm">Urgensi:</p>
                                                {getUrgencyBadge(selectedDamage.urgensi)}
                                            </div>
                                        </div>

                                        <div className="pt-2">
                                            <p className="text-sm font-medium">Deskripsi Kerusakan:</p>
                                            <p className="text-sm text-gray-700">{selectedDamage.deskripsi}</p>
                                        </div>

                                        <div>
                                            <p className="text-sm font-medium">Kontak:</p>
                                            <p className="text-sm text-gray-700">{selectedDamage.no_hp}</p>
                                        </div>

                                        <div>
                                            <p className="text-sm font-medium">Waktu Laporan:</p>
                                            <p className="text-sm text-gray-700">{formatDate(selectedDamage.created_at)}</p>
                                        </div>

                                        {selectedDamage.picture.length > 0 && (
                                            <div>
                                                <p className="mb-2 text-sm font-medium">Foto Kerusakan:</p>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {selectedDamage.picture.map((photo: string, index: number) => (
                                                        <div
                                                            key={index}
                                                            className="relative aspect-video cursor-pointer overflow-hidden rounded-md border"
                                                            onClick={() => handleViewImage(photo)}
                                                        >
                                                            <Image
                                                                src={photo || '/placeholder.svg'}
                                                                alt={`Foto kerusakan ${index + 1}`}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                            <DialogFooter className="flex justify-between sm:justify-between">
                                {selectedDamage && (
                                    <div className="flex gap-2">
                                        {selectedDamage.status === 'pending' && (
                                            <>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    className="flex items-center gap-1"
                                                    onClick={() => handleReject(selectedDamage.id)}
                                                    disabled={isProcessing}
                                                >
                                                    <X className="h-4 w-4" />
                                                    <span>{isProcessing ? 'Memproses...' : 'Tolak'}</span>
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    className="flex items-center gap-1"
                                                    onClick={() => handleProcess(selectedDamage.id)}
                                                    disabled={isProcessing}
                                                >
                                                    <CheckCircle className="h-4 w-4" />
                                                    <span>{isProcessing ? 'Memproses...' : 'Proses'}</span>
                                                </Button>
                                            </>
                                        )}
                                        {selectedDamage.status === 'in_progress' && (
                                            <Button
                                                size="sm"
                                                className="flex items-center gap-1"
                                                onClick={() => handleComplete(selectedDamage.id)}
                                                disabled={isProcessing}
                                            >
                                                <CheckCircle className="h-4 w-4" />
                                                <span>{isProcessing ? 'Memproses...' : 'Selesai'}</span>
                                            </Button>
                                        )}
                                    </div>
                                )}
                                <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
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
                                    <Image src={selectedImage || '/placeholder.svg'} alt="Foto kerusakan" fill className="object-contain" />
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
            </div>
        </AppLayout>
    );
}
