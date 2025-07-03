'use client';

import { BottomNavigation } from '@/components/biroumum/bottom-navigation';
import { PageHeader } from '@/components/biroumum/page-header';
import { RoomSelection } from '@/components/biroumum/room-selection';
import { SuccessAlert } from '@/components/biroumum/success-alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { type SharedData } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { Calendar, Clock, Users } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';

export default function RoomBooking({ daftarruangans }: any) {
    const { auth } = usePage<SharedData>().props;

    const [formData, setFormData] = useState({
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

        router.post(
            route('ruangrapat.store'),
            {
                date: formData.date,
                startTime: formData.startTime,
                endTime: formData.endTime,
                room: formData.room,
                purpose: formData.purpose,
                contact: formData.contact,
            },
            {
                onError: (e) => {
                    //
                },
                onSuccess: () => {
                    setShowSuccess(true);

                    setFormData({
                        room: '',
                        date: '',
                        startTime: '',
                        endTime: '',
                        purpose: '',
                        contact: '',
                    });
                },
            },
        );
    };

    // Get today's date for min date validation
    const today = new Date().toISOString().split('T')[0];

    return (
        <>
            <Head title="Pemesanan Ruangan Rapat" />
            <div className="mx-auto min-h-screen w-full max-w-md bg-gray-50">
                <div className="pb-20">
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
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Personal Information */}
                                    <div className="space-y-4">
                                        <h3 className="border-b pb-2 text-lg font-medium text-gray-900">Informasi Pemesan</h3>

                                        <div>
                                            <Label htmlFor="name">Nama pemesan</Label>
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
                                    </div>

                                    {/* Date and Time Selection */}
                                    <div className="space-y-4">
                                        <h3 className="flex items-center gap-2 border-b pb-2 text-lg font-medium text-gray-900">
                                            <Calendar className="h-5 w-5" />
                                            Pilih Tanggal & Waktu
                                        </h3>

                                        <div>
                                            <Label htmlFor="date" className="mb-1">
                                                Tanggal penggunaan ruangan
                                            </Label>
                                            <Input
                                                id="date"
                                                type="date"
                                                value={formData.date}
                                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                                min={today}
                                                required
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="startTime" className="mb-1 flex items-center gap-2">
                                                    <Clock className="h-4 w-4" />
                                                    Jam Mulai
                                                </Label>
                                                <Input
                                                    id="startTime"
                                                    type="time"
                                                    value={formData.startTime}
                                                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="endTime" className="mb-1 flex items-center gap-2">
                                                    <Clock className="h-4 w-4" />
                                                    Jam Selesai
                                                </Label>
                                                <Input
                                                    id="endTime"
                                                    type="time"
                                                    value={formData.endTime}
                                                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                                                    required
                                                    min={formData.startTime}
                                                />
                                            </div>
                                        </div>

                                        {formData.startTime && formData.endTime && formData.startTime >= formData.endTime && (
                                            <div className="rounded border border-red-200 bg-red-50 p-2 text-sm text-red-600">
                                                ⚠️ Jam selesai harus lebih besar dari jam mulai
                                            </div>
                                        )}
                                    </div>

                                    {/* Room Selection */}
                                    <div className="space-y-4">
                                        <h3 className="border-b pb-2 text-lg font-medium text-gray-900">Pilih Ruangan</h3>
                                        <RoomSelection
                                            daftarRuangans={daftarruangans}
                                            selectedRoom={formData.room}
                                            onRoomChange={(value) => setFormData({ ...formData, room: value })}
                                            selectedDate={formData.date}
                                            selectedStartTime={formData.startTime}
                                            selectedEndTime={formData.endTime}
                                        />
                                    </div>

                                    {/* Additional Information */}
                                    <div className="space-y-4">
                                        <h3 className="border-b pb-2 text-lg font-medium text-gray-900">Informasi Tambahan</h3>

                                        <div>
                                            <Label htmlFor="purpose">Kegiatan</Label>
                                            <Textarea
                                                id="purpose"
                                                placeholder="Jelaskan kegiatan yang akan dilaksanakan..."
                                                value={formData.purpose}
                                                onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                                                required
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="contact">No Handphone</Label>
                                            <Input
                                                id="contact"
                                                placeholder="Lebih baik juga aktif di WhatsApp"
                                                value={formData.contact}
                                                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full"
                                        disabled={!formData.room || !formData.contact || !formData.purpose || formData.startTime >= formData.endTime}
                                    >
                                        Ajukan Pemesanan
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <BottomNavigation />
            </div>
        </>
    );
}
