'use client';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BreadcrumbItem } from '@/types';
import { router } from '@inertiajs/react';
import {
    BookOpen,
    Camera,
    Car,
    Computer,
    Edit,
    Folders,
    Mic,
    PenSquare,
    Plus,
    Projector,
    Shield,
    Snowflake,
    Sofa,
    Speaker,
    Table,
    Tv,
    Wifi,
} from 'lucide-react';
import type React from 'react';
import { useState } from 'react';

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

export default function ButtonRooms() {
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
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

    const [imagePreview, setImagePreview] = useState<string>('');

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

    const openAddDialog = () => {
        resetForm();
        setIsAddDialogOpen(true);
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

                    resetForm();
                },
                onError: (errors) => {
                    console.log('Validation Errors: ', errors);
                },
            },
        );
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

    return (
        <>
            <Button onClick={openAddDialog}>
                <Plus className="mr-2 h-4 w-4" />
                Tambah Ruangan
            </Button>

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
        </>
    );
}
