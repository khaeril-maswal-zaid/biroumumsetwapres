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
import { Wrench } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';

export default function DamageReport() {
    const [formData, setFormData] = useState({
        location: '',
        damageType: '',
        description: '',
        urgency: '',
        contact: '',
    });
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setShowSuccess(true);
        setTimeout(() => {
            setShowSuccess(false);
        }, 3000);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <DesktopNavigation />

            <div className="pb-20 md:pb-0">
                <div className="space-y-6 p-4">
                    <PageHeader title="Laporan Kerusakan Gedung" backUrl="/" />

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
                                    <Label htmlFor="damageType">Jenis Kerusakan</Label>
                                    <Select value={formData.damageType} onValueChange={(value) => setFormData({ ...formData, damageType: value })}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih jenis kerusakan" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="listrik">Kerusakan Listrik</SelectItem>
                                            <SelectItem value="plumbing">Kerusakan Pipa/Air</SelectItem>
                                            <SelectItem value="ac">Kerusakan AC</SelectItem>
                                            <SelectItem value="pintu">Kerusakan Pintu/Jendela</SelectItem>
                                            <SelectItem value="cat">Kerusakan Cat/Dinding</SelectItem>
                                            <SelectItem value="lainnya">Lainnya</SelectItem>
                                        </SelectContent>
                                    </Select>
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
                                    <Label htmlFor="contact">Kontak Pelapor</Label>
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
