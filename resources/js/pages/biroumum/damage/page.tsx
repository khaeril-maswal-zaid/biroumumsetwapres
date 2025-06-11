'use client';

import { BottomNavigation } from '@/components/biroumum/bottom-navigation';
import { DesktopNavigation } from '@/components/biroumum/desktop-navigation';
import { PageHeader } from '@/components/biroumum/page-header';
import { SuccessAlert } from '@/components/biroumum/success-alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Image, ImagePlus, Trash2, Wrench } from 'lucide-react';
import type React from 'react';
import { useRef, useState } from 'react';

export default function DamageReport() {
    const [formData, setFormData] = useState({
        name: '',
        devisi: '',
        location: '',
        damageType: '',
        description: '',
        urgency: '',
        contact: '',
    });

    const [photos, setPhotos] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form data:', formData);
        console.log('Photos:', photos);

        setShowSuccess(true);
        setTimeout(() => {
            setShowSuccess(false);
        }, 3000);
    };

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            if (photos.length >= 2) {
                alert('Maksimal 2 foto yang dapat diunggah');
                return;
            }

            const file = e.target.files[0];
            const reader = new FileReader();

            reader.onloadend = () => {
                setPhotos([...photos, reader.result as string]);
            };

            reader.readAsDataURL(file);
        }
    };

    const removePhoto = (index: number) => {
        const newPhotos = [...photos];
        newPhotos.splice(index, 1);
        setPhotos(newPhotos);
    };

    const triggerFileInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <DesktopNavigation />

            <div className="pb-20 md:pb-0">
                <div className="space-y-6 p-4">
                    <PageHeader title="Laporan Kerusakan Barang/Alat" backUrl="/" />

                    <SuccessAlert show={showSuccess} message="Laporan kerusakan berhasil dikirim!" />

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Wrench className="h-5 w-5" />
                                <span>Form Laporan Kerusakan</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <Label htmlFor="name">Nama pelapor</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                        autoFocus
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="devisi">Unit kerja</Label>
                                    <Select value={formData.devisi} onValueChange={(value) => setFormData({ ...formData, devisi: value })}>
                                        <SelectTrigger className="w-[280px]" id="devisi">
                                            <SelectValue placeholder="Pilih Unit kerja" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Biro 1">Biro 1</SelectItem>
                                            <SelectItem value="Biro 2">Biro 2</SelectItem>
                                            <SelectItem value="Biro 3">Biro 3</SelectItem>
                                            <SelectItem value="Biro 4">Biro 4</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="location">Lokasi Kerusakan</Label>
                                    <Input
                                        id="location"
                                        placeholder="Contoh: Lantai 2, Ruang 201"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="damageType">Nama Barang/ Alat</Label>
                                    <Input
                                        id="damageType"
                                        type="text"
                                        value={formData.damageType}
                                        onChange={(e) => setFormData({ ...formData, damageType: e.target.value })}
                                        required
                                        placeholder="Nama Barang/ Alat yang rusak"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="description">Deskripsi Kerusakan</Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Jelaskan detail kerusakan yang terjadi..."
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        required
                                    />
                                </div>

                                {/* Photo Upload Section */}
                                <div>
                                    <Label>Foto Kerusakan (Maks. 2 foto)</Label>
                                    <div className="mt-2 grid grid-cols-2 gap-4">
                                        {photos.map((photo, index) => (
                                            <div key={index} className="relative">
                                                <div className="relative aspect-square overflow-hidden rounded-md border">
                                                    <Image
                                                        src={photo || '/placeholder.svg'}
                                                        alt={`Foto kerusakan ${index + 1}`}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="icon"
                                                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                                                    onClick={() => removePhoto(index)}
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        ))}

                                        {photos.length < 2 && (
                                            <div
                                                className="flex aspect-square cursor-pointer items-center justify-center rounded-md border border-dashed hover:bg-gray-50"
                                                onClick={triggerFileInput}
                                            >
                                                <div className="flex flex-col items-center space-y-2">
                                                    <ImagePlus className="h-8 w-8 text-gray-400" />
                                                    <span className="text-xs text-gray-500">Tambah Foto</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                                </div>

                                <div>
                                    <Label htmlFor="urgency">Tingkat Urgensi</Label>
                                    <RadioGroup
                                        value={formData.urgency}
                                        onValueChange={(value) => setFormData({ ...formData, urgency: value })}
                                        className="mt-2"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="rendah" id="rendah" />
                                            <Label htmlFor="rendah">Rendah</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="sedang" id="sedang" />
                                            <Label htmlFor="sedang">Sedang</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="tinggi" id="tinggi" />
                                            <Label htmlFor="tinggi">Tinggi</Label>
                                        </div>
                                    </RadioGroup>
                                </div>
                                <div>
                                    <Label htmlFor="contact">Narahubung</Label>
                                    <Input
                                        id="contact"
                                        placeholder="Nama dan nomor telepon"
                                        value={formData.contact}
                                        onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                                        required
                                    />
                                </div>
                                <Button type="submit" className="w-full">
                                    Kirim Laporan
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <BottomNavigation />
        </div>
    );
}
