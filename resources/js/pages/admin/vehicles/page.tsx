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
import { Car, CheckCircle, Clock, MapPin, Search, User, X } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

// Mock data for vehicle requests
const vehicles = [
    {
        id: '1',
        name: 'Siti Aminah',
        devisi: 'Biro 3',
        vehicleType: 'mpv',
        startDateTime: '2025-06-11T08:00',
        endDateTime: '2025-06-11T17:00',
        destination: 'Kantor Pusat Jakarta',
        purpose: 'Rapat koordinasi dengan kantor pusat',
        passengers: '5',
        needDriver: true,
        contact: '0812-3456-7892',
        status: 'confirmed',
        createdAt: '2025-06-10T10:30:00',
    },
    {
        id: '2',
        name: 'Rudi Hartono',
        devisi: 'Biro 4',
        vehicleType: 'sedan',
        startDateTime: '2025-06-12T09:00',
        endDateTime: '2025-06-12T15:00',
        destination: 'Bandara Soekarno-Hatta',
        purpose: 'Penjemputan tamu penting',
        passengers: '3',
        needDriver: true,
        contact: '0812-3456-7893',
        status: 'pending',
        createdAt: '2025-06-10T14:20:00',
    },
    {
        id: '3',
        name: 'Dewi Lestari',
        devisi: 'Biro 1',
        vehicleType: 'bus',
        startDateTime: '2025-06-13T07:00',
        endDateTime: '2025-06-13T18:00',
        destination: 'Bogor, Jawa Barat',
        purpose: 'Kunjungan kerja dan survey lapangan',
        passengers: '25',
        needDriver: true,
        contact: '0812-3456-7894',
        status: 'in_progress',
        createdAt: '2025-06-09T16:45:00',
    },
    {
        id: '4',
        name: 'Ahmad Fauzi',
        devisi: 'Biro 2',
        vehicleType: 'pickup',
        startDateTime: '2025-06-14T10:00',
        endDateTime: '2025-06-14T14:00',
        destination: 'Gudang Logistik Bekasi',
        purpose: 'Pengambilan peralatan kantor',
        passengers: '2',
        needDriver: false,
        contact: '0812-3456-7895',
        status: 'cancelled',
        createdAt: '2025-06-08T11:15:00',
    },
];

export default function VehiclesAdmin() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleApprove = async (vehicleId: string) => {
        setIsProcessing(true);
        // Simulasi API call
        setTimeout(() => {
            console.log(`Vehicle request ${vehicleId} approved`);
            setIsProcessing(false);
            setIsDetailsOpen(false);
            // Di aplikasi nyata, ini akan update data dari server
        }, 1000);
    };

    const handleReject = async (vehicleId: string) => {
        setIsProcessing(true);
        // Simulasi API call
        setTimeout(() => {
            console.log(`Vehicle request ${vehicleId} rejected`);
            setIsProcessing(false);
            setIsDetailsOpen(false);
            // Di aplikasi nyata, ini akan update data dari server
        }, 1000);
    };

    // Filter vehicles based on search term and status
    const filteredVehicles = vehicles.filter((vehicle) => {
        const matchesSearch =
            vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            vehicle.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
            vehicle.vehicleType.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const handleViewDetails = (vehicle: any) => {
        setSelectedVehicle(vehicle);
        setIsDetailsOpen(true);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'confirmed':
                return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Terkonfirmasi</Badge>;
            case 'pending':
                return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Menunggu</Badge>;
            case 'in_progress':
                return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Diproses</Badge>;
            case 'cancelled':
                return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Dibatalkan</Badge>;
            default:
                return <Badge variant="outline">Unknown</Badge>;
        }
    };

    const getVehicleTypeName = (type: string) => {
        switch (type) {
            case 'sedan':
                return 'Sedan';
            case 'mpv':
                return 'MPV';
            case 'bus':
                return 'Bus';
            case 'pickup':
                return 'Pick Up';
            default:
                return type;
        }
    };

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Permintaan Kendaraan</CardTitle>
                        <CardDescription>Semua permintaan kendaraan yang telah diajukan.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div className="flex w-full max-w-sm items-center space-x-2">
                                <Search className="h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Cari nama, tujuan, atau jenis kendaraan..."
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
                                        <SelectItem value="confirmed">Terkonfirmasi</SelectItem>
                                        <SelectItem value="pending">Menunggu</SelectItem>
                                        <SelectItem value="in_progress">Diproses</SelectItem>
                                        <SelectItem value="cancelled">Dibatalkan</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nama</TableHead>
                                        <TableHead>Kendaraan</TableHead>
                                        <TableHead className="hidden md:table-cell">Tujuan</TableHead>
                                        <TableHead className="hidden lg:table-cell">Waktu</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredVehicles.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="py-4 text-center text-gray-500">
                                                Tidak ada permintaan kendaraan yang ditemukan
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredVehicles.map((vehicle) => (
                                            <TableRow key={vehicle.id}>
                                                <TableCell>
                                                    <div className="font-medium">{vehicle.name}</div>
                                                    <div className="text-sm text-gray-500">{vehicle.devisi}</div>
                                                </TableCell>
                                                <TableCell>{getVehicleTypeName(vehicle.vehicleType)}</TableCell>
                                                <TableCell className="hidden max-w-[200px] truncate md:table-cell">{vehicle.destination}</TableCell>
                                                <TableCell className="hidden lg:table-cell">
                                                    <div className="text-sm">{formatDateTime(vehicle.startDateTime)}</div>
                                                </TableCell>
                                                <TableCell>{getStatusBadge(vehicle.status)}</TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="sm" onClick={() => handleViewDetails(vehicle)}>
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

                {/* Vehicle Details Dialog */}
                <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                    <DialogContent className="sm:max-w-lg">
                        <DialogHeader>
                            <DialogTitle>Detail Permintaan Kendaraan</DialogTitle>
                            <DialogDescription>Informasi lengkap tentang permintaan kendaraan.</DialogDescription>
                        </DialogHeader>
                        {selectedVehicle && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-medium">{getVehicleTypeName(selectedVehicle.vehicleType)}</h3>
                                    {getStatusBadge(selectedVehicle.status)}
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <User className="h-4 w-4 text-gray-500" />
                                        <div>
                                            <p className="text-sm font-medium">{selectedVehicle.name}</p>
                                            <p className="text-xs text-gray-500">{selectedVehicle.devisi}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-gray-500" />
                                        <p className="text-sm">{selectedVehicle.destination}</p>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-gray-500" />
                                        <div>
                                            <p className="text-sm">Mulai: {formatDateTime(selectedVehicle.startDateTime)}</p>
                                            <p className="text-sm">Selesai: {formatDateTime(selectedVehicle.endDateTime)}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Car className="h-4 w-4 text-gray-500" />
                                        <p className="text-sm">Penumpang: {selectedVehicle.passengers} orang</p>
                                    </div>

                                    <div className="pt-2">
                                        <p className="text-sm font-medium">Keperluan:</p>
                                        <p className="text-sm text-gray-700">{selectedVehicle.purpose}</p>
                                    </div>

                                    <div>
                                        <p className="text-sm font-medium">Driver:</p>
                                        <p className="text-sm text-gray-700">
                                            {selectedVehicle.needDriver ? 'Memerlukan driver' : 'Tidak memerlukan driver'}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm font-medium">Kontak:</p>
                                        <p className="text-sm text-gray-700">{selectedVehicle.contact}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                        <DialogFooter className="flex justify-between sm:justify-between">
                            {selectedVehicle && selectedVehicle.status === 'pending' && (
                                <div className="flex gap-2">
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        className="flex items-center gap-1"
                                        onClick={() => handleReject(selectedVehicle.id)}
                                        disabled={isProcessing}
                                    >
                                        <X className="h-4 w-4" />
                                        <span>{isProcessing ? 'Memproses...' : 'Tolak'}</span>
                                    </Button>
                                    <Button
                                        size="sm"
                                        className="flex items-center gap-1"
                                        onClick={() => handleApprove(selectedVehicle.id)}
                                        disabled={isProcessing}
                                    >
                                        <CheckCircle className="h-4 w-4" />
                                        <span>{isProcessing ? 'Memproses...' : 'Setujui'}</span>
                                    </Button>
                                </div>
                            )}
                            <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
                                Tutup
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
