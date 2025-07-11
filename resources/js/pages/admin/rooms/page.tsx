'use client';
import ButtonRooms from '@/components/buttonnavbar/button-ruangan';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import {
    BookOpen,
    Building,
    Camera,
    Car,
    Computer,
    Edit,
    Folders,
    MapPin,
    Mic,
    Monitor,
    PenSquare,
    Projector,
    Search,
    Shield,
    Snowflake,
    Sofa,
    Speaker,
    Table,
    Trash2,
    Tv,
    Users,
    Wifi,
} from 'lucide-react';
import type React from 'react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface Room {
    id: string;
    nama_ruangan: string;
    kode_ruangan: string;
    lokasi: string;
    kapasitas: number;
    image: string;
    fasilitas: string[];
    status: 'aktif' | 'maintenance' | 'nonaktif';
    created_at: string;
}

const facilityOptions = [
    { id: 'wifi', label: 'WiFi', icon: Wifi },
    { id: 'projector', label: 'Proyektor', icon: Projector },
    { id: 'lcd-proyektor', label: 'LCD Proyektor', icon: Projector },
    { id: 'tv-led', label: 'TV LED', icon: Tv },
    { id: 'sound-system', label: 'Sound System', icon: Speaker },
    { id: 'kamera-cctv', label: 'Kamera CCTV', icon: Camera },
    { id: 'mikrofon', label: 'Mikrofon', icon: Mic },
    { id: 'meja-bundar', label: 'Meja Bundar', icon: Table },
    { id: 'papan-tulis', label: 'Papan Tulis', icon: PenSquare },
    { id: 'whiteboard', label: 'Whiteboard', icon: Edit },
    { id: 'ac', label: 'AC', icon: Snowflake },
    { id: 'parking', label: 'Parkir', icon: Car },
    { id: 'komputer', label: 'Komputer', icon: Computer },
    { id: 'sofa', label: 'Sofa', icon: Sofa },
    { id: 'majalah', label: 'Majalah', icon: BookOpen },
    { id: 'rak-arsip', label: 'Rak Arsip', icon: Folders },
    { id: 'lemari-besi', label: 'Lemari Besi', icon: Shield },
];

export default function RoomsPage({ ruangans }: any) {
    const [rooms, setRooms] = useState<Room[]>(ruangans.data);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [formData, setFormData] = useState({
        nama_ruangan: '',
        kode_ruangan: '',
        lokasi: '',
        kapasitas: '',
        fasilitas: [] as string[],
        status: 'aktif' as 'aktif' | 'maintenance' | 'nonaktif',
        image: '' as string,
    });

    useEffect(() => {
        setRooms(ruangans.data);
    }, [ruangans.data]);

    const [imagePreview, setImagePreview] = useState<string>('');

    const filteredRooms = rooms.filter(
        (room) =>
            room.nama_ruangan.toLowerCase().includes(searchTerm.toLowerCase()) ||
            room.kode_ruangan.toLowerCase().includes(searchTerm.toLowerCase()) ||
            room.lokasi.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const resetForm = () => {
        setFormData({
            nama_ruangan: '',
            kode_ruangan: '',
            lokasi: '',
            kapasitas: '',
            fasilitas: [],
            status: 'aktif',
            image: '',
        });

        setImagePreview('');
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file); // ini yang dikirim ke BE

            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string); // hanya untuk preview
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAdd = () => {
        // Validate required fields
        if (!formData.nama_ruangan || !formData.kode_ruangan || !formData.lokasi || !formData.kapasitas) {
            alert('Mohon lengkapi semua field yang wajib diisi');
            return;
        }

        const newRoom: Room = {
            id: Date.now().toString(),
            nama_ruangan: formData.nama_ruangan,
            kode_ruangan: formData.kode_ruangan,
            lokasi: formData.lokasi,
            kapasitas: Number.parseInt(formData.kapasitas),
            image: formData.image || '/placeholder.svg?height=200&width=300',
            fasilitas: formData.fasilitas,
            status: formData.status,
            created_at: new Date().toISOString().split('T')[0],
        };

        router.post(
            route('rooms.store'),
            {
                nama_ruangan: formData.nama_ruangan,
                kode_ruangan: formData.kode_ruangan,
                lokasi: formData.lokasi,
                kapasitas: Number.parseInt(formData.kapasitas),
                fasilitas: formData.fasilitas,
                status: formData.status,
                photo: imageFile,
            },
            {
                onSuccess() {
                    setIsAddDialogOpen(false);
                    setRooms([...rooms, newRoom]);
                    resetForm();
                },
                onError: (errors) => {
                    console.log('Validation Errors: ', errors);
                },
            },
        );
    };

    const handleEdit = (room: Room) => {
        setSelectedRoom(room);
        setFormData({
            nama_ruangan: room.nama_ruangan,
            kode_ruangan: room.kode_ruangan,
            lokasi: room.lokasi,
            kapasitas: room.kapasitas.toString(),
            fasilitas: room.fasilitas,
            status: room.status,
            image: room.image,
        });
        setImagePreview(room.image);
        setIsEditDialogOpen(true);
    };

    const handleUpdate = () => {
        if (!selectedRoom) return;

        // Validate required fields
        if (!formData.nama_ruangan || !formData.kode_ruangan || !formData.lokasi || !formData.kapasitas) {
            alert('Mohon lengkapi semua field yang wajib diisi');
            return;
        }

        if (!selectedRoom) return;

        // Validasi...
        const form = new FormData();
        form.append('_method', 'PUT');
        form.append('nama_ruangan', formData.nama_ruangan);
        form.append('lokasi', formData.lokasi);
        form.append('kapasitas', formData.kapasitas);
        form.append('status', formData.status);
        formData.fasilitas.forEach((f) => form.append('fasilitas[]', f));
        if (imageFile) {
            form.append('photo', imageFile);
        }

        router.post(route('rooms.update', selectedRoom.kode_ruangan), form, {
            preserveScroll: true,
            onSuccess() {
                setIsEditDialogOpen(false);
                setSelectedRoom(null);
                resetForm();
            },
            onError: (errors) => {
                console.log('Validation Errors: ', errors);
            },
        });
    };

    const handleDelete = (roomCode: string) => {
        router.delete(route('rooms.delete', roomCode), {
            preserveScroll: true,
        });
    };

    const handleFacilityChange = (facilityId: string, checked: boolean) => {
        if (checked) {
            setFormData((prev) => ({
                ...prev,
                fasilitas: [...prev.fasilitas, facilityId],
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                fasilitas: prev.fasilitas.filter((f) => f !== facilityId),
            }));
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'aktif':
                return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Aktif</Badge>;
            case 'maintenance':
                return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Maintenance</Badge>;
            case 'nonaktif':
                return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Non-aktif</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    const getFacilityIcon = (facilityLabel: string) => {
        const facility = facilityOptions.find((f) => f.id === facilityLabel);
        return facility ? facility.icon : Monitor;
    };

    const getFacilityLabel = (facilityLabel: string) => {
        const facility = facilityOptions.find((f) => f.id === facilityLabel);
        return facility ? facility.label : facilityLabel;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs} Button={ButtonRooms}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Manajemen Ruangan</h1>
                        <p className="text-muted-foreground">Kelola data ruangan dan fasilitas</p>
                    </div>

                    <div className="relative max-w-sm flex-1">
                        <Search className="absolute top-2.5 left-2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Cari ruangan..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-8" />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {filteredRooms.map((room) => (
                        <Card key={room.id} className="min-h-[540px] gap-0 overflow-hidden pt-0">
                            <div className="relative aspect-video">
                                <img
                                    src={room.image ? `/storage/${room.image}` : '/placeholder.svg'}
                                    alt={room.nama_ruangan}
                                    className="h-[275px] w-full object-cover"
                                />
                                <div className="absolute top-2 right-2">{getStatusBadge(room.status)}</div>
                            </div>
                            <CardHeader className="py-3">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <CardTitle className="text-lg">{room.nama_ruangan}</CardTitle>
                                        <p className="font-mono text-sm text-muted-foreground">{room.kode_ruangan}</p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <MapPin className="h-4 w-4" />
                                    <span>{room.lokasi}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Users className="h-4 w-4" />
                                    <span>Kapasitas: {room.kapasitas} orang</span>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium">Fasilitas:</p>
                                    <div className="flex flex-wrap gap-1">
                                        {room.fasilitas.map((facility) => {
                                            const Icon = getFacilityIcon(facility);
                                            return (
                                                <Badge key={facility} variant="secondary" className="text-xs">
                                                    <Icon className="mr-1 h-3 w-3" />
                                                    {getFacilityLabel(facility)}
                                                </Badge>
                                            );
                                        })}
                                    </div>
                                </div>
                                <div className="flex gap-2 pt-2">
                                    <Button variant="outline" size="sm" onClick={() => handleEdit(room)} className="flex-1">
                                        <Edit className="mr-1 h-4 w-4" />
                                        Edit
                                    </Button>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="outline" size="sm" className="bg-transparent text-red-600 hover:text-red-700">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Hapus Ruangan</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Apakah Anda yakin ingin menghapus ruangan "{room.nama_ruangan}"? Tindakan ini tidak dapat
                                                    dibatalkan.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={() => handleDelete(room.kode_ruangan)}
                                                    className="bg-red-600 hover:bg-red-700"
                                                >
                                                    Hapus
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Add Dialog */}
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Tambah Ruangan Baru</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="nama_ruangan">Nama Ruangan</Label>
                                    <Input
                                        id="nama_ruangan"
                                        value={formData.nama_ruangan}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, nama_ruangan: e.target.value }))}
                                        placeholder="Masukkan nama ruangan"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="kode_ruangan">Kode Ruangan</Label>
                                    <Input
                                        id="kode_ruangan"
                                        value={formData.kode_ruangan}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, kode_ruangan: e.target.value }))}
                                        placeholder="Contoh: RU-001"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lokasi">Lokasi</Label>
                                <Input
                                    id="lokasi"
                                    value={formData.lokasi}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, lokasi: e.target.value }))}
                                    placeholder="Contoh: Lantai 2, Gedung A"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="image">Foto Ruangan</Label>
                                <Input id="image" type="file" accept="image/*" onChange={handleImageChange} className="cursor-pointer" />
                                {imagePreview && (
                                    <div className="mt-2">
                                        <img
                                            src={imagePreview || '/placeholder.svg'}
                                            alt="Preview"
                                            className="h-32 w-full rounded-md border object-cover"
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="kapasitas">Kapasitas</Label>
                                    <Input
                                        id="kapasitas"
                                        type="number"
                                        value={formData.kapasitas}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, kapasitas: e.target.value }))}
                                        placeholder="Jumlah orang"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="status">Status</Label>
                                    <Select
                                        value={formData.status}
                                        onValueChange={(value: 'aktif' | 'maintenance' | 'nonaktif') =>
                                            setFormData((prev) => ({ ...prev, status: value }))
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="aktif">Aktif</SelectItem>
                                            <SelectItem value="maintenance">Maintenance</SelectItem>
                                            <SelectItem value="nonaktif">Non-aktif</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Fasilitas</Label>
                                <div className="grid grid-cols-2 gap-2">
                                    {facilityOptions.map((facility) => (
                                        <div key={facility.id} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={facility.id}
                                                checked={formData.fasilitas.includes(facility.id)}
                                                onCheckedChange={(checked) => handleFacilityChange(facility.id, checked as boolean)}
                                            />
                                            <Label htmlFor={facility.id} className="flex items-center gap-2">
                                                <facility.icon className="h-4 w-4" />
                                                {facility.label}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                                Batal
                            </Button>
                            <Button
                                onClick={handleAdd}
                                disabled={!formData.nama_ruangan || !formData.kode_ruangan || !formData.lokasi || !formData.kapasitas}
                            >
                                Simpan
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Edit Dialog */}
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Edit Ruangan</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="edit_nama_ruangan">Nama Ruangan</Label>
                                    <Input
                                        id="edit_nama_ruangan"
                                        value={formData.nama_ruangan}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, nama_ruangan: e.target.value }))}
                                        placeholder="Masukkan nama ruangan"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit_kode_ruangan">Kode Ruangan</Label>
                                    <Input
                                        id="edit_kode_ruangan"
                                        value={formData.kode_ruangan}
                                        readOnly
                                        className="cursor-not-allowed bg-gray-100 text-gray-500"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit_lokasi">Lokasi</Label>
                                <Input
                                    id="edit_lokasi"
                                    value={formData.lokasi}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, lokasi: e.target.value }))}
                                    placeholder="Contoh: Lantai 2, Gedung A"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit_image">Foto Ruangan</Label>
                                <Input id="edit_image" type="file" accept="image/*" onChange={handleImageChange} className="cursor-pointer" />
                                {imagePreview && (
                                    <div className="mt-2">
                                        <img
                                            src={`/storage/${imagePreview}` || '/placeholder.svg'}
                                            alt="Preview"
                                            className="h-62 w-full rounded-md border object-cover"
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="edit_kapasitas">Kapasitas</Label>
                                    <Input
                                        id="edit_kapasitas"
                                        type="number"
                                        value={formData.kapasitas}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, kapasitas: e.target.value }))}
                                        placeholder="Jumlah orang"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit_status">Status</Label>
                                    <Select
                                        value={formData.status}
                                        onValueChange={(value: 'aktif' | 'maintenance' | 'nonaktif') =>
                                            setFormData((prev) => ({ ...prev, status: value }))
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="aktif">Aktif</SelectItem>
                                            <SelectItem value="maintenance">Maintenance</SelectItem>
                                            <SelectItem value="nonaktif">Non-aktif</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Fasilitas</Label>
                                <div className="grid grid-cols-2 gap-2">
                                    {facilityOptions.map((facility) => (
                                        <div key={facility.id} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`edit_${facility.id}`}
                                                checked={formData.fasilitas.includes(facility.id)}
                                                onCheckedChange={(checked) => handleFacilityChange(facility.id, checked as boolean)}
                                            />
                                            <Label htmlFor={`edit_${facility.id}`} className="flex items-center gap-2">
                                                <facility.icon className="h-4 w-4" />
                                                {facility.label}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                                Batal
                            </Button>
                            <Button
                                onClick={handleUpdate}
                                disabled={!formData.nama_ruangan || !formData.kode_ruangan || !formData.lokasi || !formData.kapasitas}
                            >
                                Simpan Perubahan
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {filteredRooms.length === 0 && (
                    <div className="py-12 text-center">
                        <Building className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-semibold text-gray-900">Tidak ada ruangan</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            {searchTerm ? 'Tidak ada ruangan yang sesuai dengan pencarian.' : 'Mulai dengan menambahkan ruangan baru.'}
                        </p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
