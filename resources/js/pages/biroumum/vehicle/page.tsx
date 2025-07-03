'use client';

import { BottomNavigation } from '@/components/biroumum/bottom-navigation';
import { PageHeader } from '@/components/biroumum/page-header';
import { SuccessAlert } from '@/components/biroumum/success-alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { Car } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';

export default function VehicleRequest() {
    const { auth } = usePage<SharedData>().props;

    const [formData, setFormData] = useState({
        name: '',
        devisi: '',
        vehicleType: '',
        start_datetime: '',
        end_datetime: '',
        destination: '',
        purpose: '',
        passengers: '',
        needDriver: false,
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
        <div className="mx-auto min-h-screen w-full max-w-md bg-gray-50">
            <div className="pb-20 md:pb-0">
                <div className="space-y-6 p-4">
                    <PageHeader title="Permintaan Kendaraan" backUrl="/" />

                    <SuccessAlert show={showSuccess} message="Permintaan kendaraan berhasil diajukan!" />

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Car className="h-5 w-5" />
                                <span>Form Permintaan Kendaraan</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <Label htmlFor="name">Nama Pelapor</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        readOnly
                                        value={auth?.user.name}
                                        className="cursor-not-allowed border border-gray-300 bg-gray-100 text-gray-500"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="unitkerja">Unit Kerja</Label>
                                    <Input
                                        id="unitkerja"
                                        type="text"
                                        value={auth?.user.unit_kerja}
                                        readOnly
                                        className="cursor-not-allowed border border-gray-300 bg-gray-100 text-gray-500"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="vehicleType">Jenis Kendaraan</Label>
                                    <Select value={formData.vehicleType} onValueChange={(value) => setFormData({ ...formData, vehicleType: value })}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih jenis kendaraan" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="sedan">Sedan</SelectItem>
                                            <SelectItem value="mpv">MPV</SelectItem>
                                            <SelectItem value="bus">Bus</SelectItem>
                                            <SelectItem value="pickup">Pick Up</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="start_datetime">Mulai Digunakan (Tanggal & Waktu)</Label>
                                    <Input
                                        id="start_datetime"
                                        type="datetime-local"
                                        value={formData.start_datetime}
                                        onChange={(e) => setFormData({ ...formData, start_datetime: e.target.value })}
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="end_datetime">Selesai Digunakan (Tanggal & Waktu)</Label>
                                    <Input
                                        id="end_datetime"
                                        type="datetime-local"
                                        value={formData.end_datetime}
                                        onChange={(e) => setFormData({ ...formData, end_datetime: e.target.value })}
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="destination">Tujuan</Label>
                                    <Input
                                        id="destination"
                                        placeholder="Alamat tujuan lengkap"
                                        value={formData.destination}
                                        onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="purpose">Keperluan</Label>
                                    <Textarea
                                        id="purpose"
                                        placeholder="Jelaskan keperluan penggunaan kendaraan..."
                                        value={formData.purpose}
                                        onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="passengers">Jumlah Penumpang</Label>
                                    <Input
                                        id="passengers"
                                        type="number"
                                        placeholder="Masukkan jumlah penumpang"
                                        value={formData.passengers}
                                        onChange={(e) => setFormData({ ...formData, passengers: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="needDriver"
                                        checked={formData.needDriver}
                                        onCheckedChange={(checked) => setFormData({ ...formData, needDriver: checked as boolean })}
                                    />
                                    <Label htmlFor="needDriver">Memerlukan Driver</Label>
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
                                    Ajukan Permintaan
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
