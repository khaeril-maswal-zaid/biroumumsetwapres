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
import { Users } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';

export default function RoomBooking() {
    const [formData, setFormData] = useState({
        name: '',
        devisi: '',
        room: '',
        date: '',
        startTime: '',
        endTime: '',
        purpose: '',
        contact: '',
    });
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setShowSuccess(true);
        setTimeout(() => {
            console.log(formData);

            setShowSuccess(false);
        }, 3000);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <DesktopNavigation />

            <div className="pb-20 md:pb-0">
                <div className="space-y-6 p-4">
                    <PageHeader title="Pemesanan Ruang Rapat" backUrl="/" />

                    <SuccessAlert show={showSuccess} message="Pemesanan ruang rapat berhasil diajukan!" />

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Users className="h-5 w-5" />
                                <span>Form Pemesanan</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <Label htmlFor="name">Nama pemesan</Label>
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
                                    <Label htmlFor="room">Pilih Ruangan</Label>
                                    <RadioGroup value={formData.room} onValueChange={(value) => setFormData({ ...formData, room: value })}>
                                        <div className="flex items-center space-x-2 rounded-lg border p-3">
                                            <RadioGroupItem value="holding" id="holding" />
                                            <Label htmlFor="holding" className="flex-1">
                                                <div className="font-medium">Ruang Holding</div>
                                                <div className="text-sm text-gray-500">Kapasitas: 16 Orang</div>
                                            </Label>
                                        </div>
                                        <div className="flex items-center space-x-2 rounded-lg border p-3">
                                            <RadioGroupItem value="rapat" id="rapat" />
                                            <Label htmlFor="rapat" className="flex-1">
                                                <div className="font-medium">Ruang Rapat</div>
                                                <div className="text-sm text-gray-500">Kapasitas: 7 Orang</div>
                                            </Label>
                                        </div>
                                    </RadioGroup>
                                </div>

                                <div>
                                    <Label htmlFor="date">Tanggal penggunaan ruangan</Label>
                                    <Input
                                        id="date"
                                        type="date"
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="startTime">Jam Mulai</Label>
                                        <Input
                                            id="startTime"
                                            type="time"
                                            value={formData.startTime}
                                            onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="endTime">Jam Selesai</Label>
                                        <Input
                                            id="endTime"
                                            type="time"
                                            value={formData.endTime}
                                            onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="purpose">Keperluan</Label>
                                    <Textarea
                                        id="purpose"
                                        placeholder="Jelaskan keperluan penggunaan ruangan..."
                                        value={formData.purpose}
                                        onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                                        required
                                    />
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
                                    Ajukan Pemesanan
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
