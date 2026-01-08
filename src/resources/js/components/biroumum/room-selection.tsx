'use client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Skeleton } from '@/components/ui/skeleton';
import { router, usePage } from '@inertiajs/react';
import { Camera, Info, MapPin, Mic, Speaker, User, Users } from 'lucide-react';
import { useState } from 'react';

import { CheckCircle, Clock, Monitor, PenSquare, Tv, X } from 'lucide-react';
import type React from 'react';
import { useEffect } from 'react';

interface Room {
    id: string;
    nama_ruangan: string;
    kode_ruangan: string;
    kapasitas: string;
    kapasitas_max: string;
    lokasi: string;
    status: 'available' | 'booked';
    bookedSlots?: string[];
    image: string;
    facilities: string[];
}

interface RoomSelectionProps {
    selectedRoom: string;
    onRoomChange: (roomId: string, roomName: string) => void;
    selectedDate: string;
    selectedStartTime: string;
    selectedEndTime: string;
}

export const facilityOptions = [
    {
        id: 'tv-led',
        label: 'TV LED',
        icon: Tv,
        required: true,
    },
    {
        id: 'papan-tulis',
        label: 'Papan Tulis',
        icon: PenSquare,
        required: true,
    },
    {
        id: 'tv-matador',
        label: 'TV Matador',
        icon: Monitor,
        required: true,
    },
    {
        id: 'kamera',
        label: 'Kamera',
        icon: Camera,
        required: true,
    },
    {
        id: 'mikrofon',
        label: 'Mikrofon',
        icon: Mic,
        required: true,
    },
    {
        id: 'sound-system',
        label: 'Sound System',
        icon: Speaker,
        required: true,
    },
];

export function RoomSelection({ selectedRoom, onRoomChange, selectedDate, selectedStartTime, selectedEndTime }: RoomSelectionProps) {
    const { flash } = usePage<{ flash: { availableRoom?: Room[] } }>().props;

    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedRoomDetail, setSelectedRoomDetail] = useState<Room | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    useEffect(() => {
        if (selectedDate && selectedStartTime && selectedEndTime) {
            router.get(
                route('ruangrapat.available'),
                {
                    tanggal: selectedDate,
                    jam_mulai: selectedStartTime,
                    jam_selesai: selectedEndTime,
                },
                {
                    preserveState: true,
                    preserveScroll: true,
                    onStart: () => setLoading(true),
                    onFinish: () => setLoading(false),
                },
            );
        } else {
            setRooms([]);
        }
    }, [selectedDate, selectedStartTime, selectedEndTime]);

    useEffect(() => {
        setRooms(Array.isArray(flash.availableRoom) ? flash.availableRoom : []);
    }, [flash.availableRoom]);

    const handleViewDetail = (e: React.MouseEvent, room: Room) => {
        e.stopPropagation(); // Prevent card click from triggering
        setSelectedRoomDetail(room);
        setIsDetailOpen(true);
    };

    const getStatusBadge = (room: Room) => {
        if (room.status === 'available') {
            return (
                <Badge className="flex items-center gap-1 bg-green-100 text-green-800 hover:bg-green-200">
                    <CheckCircle className="h-3 w-3" />
                    Tersedia
                </Badge>
            );
        } else {
            return (
                <Badge className="flex items-center gap-1 bg-red-100 text-red-800 hover:bg-red-200">
                    <X className="h-3 w-3" />
                    Telah dipesan
                </Badge>
            );
        }
    };

    const formatDateTime = (date: string, startTime: string, endTime: string) => {
        if (!date || !startTime || !endTime) return '';

        const dateObj = new Date(date);
        const dayName = new Intl.DateTimeFormat('id-ID', { weekday: 'long' }).format(dateObj);
        const dateStr = new Intl.DateTimeFormat('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        }).format(dateObj);

        return `${dayName}, ${dateStr} • ${startTime} - ${endTime}`;
    };

    const getFacilityIcon = (facilityLabel: string) => {
        const facility = facilityOptions.find((f) => f.id === facilityLabel);
        return facility ? facility.icon : Monitor;
    };

    const getFacilityLabel = (facilityLabel: string) => {
        const facility = facilityOptions.find((f) => f.id === facilityLabel);
        return facility ? facility.label : facilityLabel;
    };

    if (!selectedDate || !selectedStartTime || !selectedEndTime) {
        return (
            <div className="space-y-4">
                <div className="rounded-lg border-2 border-dashed bg-gray-50 px-3 py-6 text-center text-gray-500">
                    <Clock className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                    <p className="mb-2 text-lg font-medium">Pilih Tanggal dan Waktu Terlebih Dahulu</p>
                    <p className="text-sm">Sistem akan menampilkan ketersediaan ruangan secara real-time</p>
                </div>
            </div>
        );
    }

    const handleCardClick = (room: Room) => {
        onRoomChange(room.id, room.nama_ruangan);
    };

    const isTimeSlotConflict = (room: Room) => {
        if (!selectedStartTime || !selectedEndTime) return false;

        const requestStart = Number.parseInt(selectedStartTime.replace(':', ''));
        const requestEnd = Number.parseInt(selectedEndTime.replace(':', ''));

        return (
            room.bookedSlots?.some((slot) => {
                const [slotStart, slotEnd] = slot.split('-').map((time) => Number.parseInt(time.replace(':', '')));
                return requestStart < slotEnd && requestEnd > slotStart;
            }) || false
        );
    };

    return (
        <>
            <div className="space-y-4">
                <div className="space-y-2">
                    <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-blue-600" />
                            <span className="font-medium">Jadwal yang dipilih:</span>
                        </div>
                        <p className="mt-1">{formatDateTime(selectedDate, selectedStartTime, selectedEndTime)}</p>
                    </div>
                </div>

                {loading ? (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-blue-600"></div>
                            Mengecek ketersediaan ruangan...
                        </div>
                        {[1, 2, 3, 4].map((i) => (
                            <Card key={i} className="animate-pulse py-0">
                                <CardContent className="p-4">
                                    <div className="flex items-start space-x-4">
                                        <Skeleton className="mt-1 h-4 w-4 rounded-full" />
                                        <div className="flex-1 space-y-3">
                                            <div className="flex items-start justify-between">
                                                <div className="space-y-2">
                                                    <Skeleton className="h-5 w-32" />
                                                    <Skeleton className="h-4 w-20" />
                                                </div>
                                                <Skeleton className="h-4 w-16" />
                                            </div>

                                            <div className="flex items-center justify-between text-sm text-gray-600">
                                                {/* Kiri - Kapasitas */}
                                                <div className="flex items-center gap-1">
                                                    <Skeleton className="h-4 w-24" />
                                                </div>

                                                <Skeleton className="h-4 w-16" />
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    // RadioGroup controlled value: pastikan string (bukan undefined)
                    <RadioGroup
                        value={selectedRoom ?? ''}
                        onValueChange={(value) => {
                            const room = rooms.find((r) => r.id === value);
                            if (room) {
                                onRoomChange(room.id, room.nama_ruangan);
                            }
                        }}
                    >
                        <div className="grid gap-4">
                            {Array.isArray(rooms) &&
                                rooms.map((room) => {
                                    const hasConflict = isTimeSlotConflict(room);
                                    const isDisabled = hasConflict;
                                    const radioId = `room-${room.id}`; // <-- prefix supaya unique / safe

                                    return (
                                        <Card
                                            key={room.id}
                                            className={`py-0 transition-all hover:shadow-md ${isDisabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'} ${
                                                selectedRoom === room.id ? 'shadow-md ring-2 ring-blue-500' : ''
                                            }`}
                                        >
                                            <CardContent className="p-4">
                                                <Label htmlFor={radioId} className={`${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                                                    <div className="flex items-start space-x-4">
                                                        {/* Radio input */}
                                                        <RadioGroupItem value={room.id} id={radioId} disabled={isDisabled} className="mt-1" />

                                                        <div className="flex-1 space-y-3">
                                                            <div className="flex items-start justify-between">
                                                                {/* Label terhubung ke radio via htmlFor */}

                                                                <div className="space-y-1">
                                                                    <div className="text-lg font-medium">{room.nama_ruangan}</div>
                                                                    <div className="text-sm text-gray-500">{room.lokasi}</div>
                                                                </div>

                                                                {getStatusBadge(room)}
                                                            </div>

                                                            <div className="flex items-center justify-between text-sm text-gray-600">
                                                                <div className="">
                                                                    <div className="mb-1.5 flex items-center gap-1">
                                                                        <User className="h-4 w-4" />
                                                                        <span>Kapasitas: {room.kapasitas} Orang</span>
                                                                    </div>
                                                                    <div className="flex items-center gap-1">
                                                                        <Users className="h-4 w-4" />
                                                                        <span>Kapasitas Max: {room.kapasitas_max} Orang</span>
                                                                    </div>
                                                                </div>

                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    type="button"
                                                                    onClick={(e) => handleViewDetail(e, room)}
                                                                    className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
                                                                >
                                                                    <Info className="h-4 w-4" />
                                                                    Detail
                                                                </Button>
                                                            </div>

                                                            {hasConflict && room.bookedSlots && room.bookedSlots.length > 0 && (
                                                                <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                                                                    <div className="flex items-center gap-2 text-sm text-red-800">
                                                                        <X className="h-4 w-4" />
                                                                        <span className="font-medium">Ruang rapat sedang digunakan:</span>
                                                                    </div>
                                                                    <div className="mt-1 text-xs text-red-600">{room.bookedSlots.join(', ')}</div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </Label>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                        </div>
                    </RadioGroup>
                )}

                {!loading && rooms.length === 0 && selectedDate && selectedStartTime && selectedEndTime && (
                    <div className="py-8 text-center text-gray-500">
                        <p>Tidak ada ruangan yang tersedia untuk waktu yang dipilih</p>
                    </div>
                )}
            </div>

            {/* Room Detail Modal */}
            <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Detail Ruangan</DialogTitle>
                        <DialogDescription>Informasi lengkap tentang ruangan yang dipilih.</DialogDescription>
                    </DialogHeader>

                    {selectedRoomDetail && (
                        <div className="space-y-4">
                            {/* Room Image */}
                            <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                                <img
                                    src={`/storage/${selectedRoomDetail.image}` || '/placeholder.svg'}
                                    alt={selectedRoomDetail.nama_ruangan}
                                    className="h-full w-full object-cover"
                                />
                                <div className="absolute top-2 right-2">{getStatusBadge(selectedRoomDetail)}</div>
                            </div>

                            {/* Room Info */}
                            <div className="space-y-5">
                                <div>
                                    <h3 className="text-xl font-semibold">{selectedRoomDetail.nama_ruangan}</h3>
                                    <p className="text-sm text-gray-500">Kode Ruangan: {selectedRoomDetail.kode_ruangan}</p>
                                </div>

                                <div className="space-y-3 text-sm">
                                    {/* Lokasi */}
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-gray-500" />
                                        <span>{selectedRoomDetail.lokasi}</span>
                                    </div>

                                    {/* Kapasitas */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex items-center gap-2">
                                            <User className="h-4 w-4 text-gray-500" />
                                            <span>Kapasitas: {selectedRoomDetail.kapasitas} orang</span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Users className="h-4 w-4 text-gray-500" />
                                            <span>Kapasitas Max: {selectedRoomDetail.kapasitas_max} orang</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Facilities */}
                                <div>
                                    <h4 className="mb-2 font-medium">Fasilitas Ruangan:</h4>
                                    <div className="grid grid-cols-2 gap-2">
                                        {selectedRoomDetail.facilities.map((facility) => {
                                            const Icon = getFacilityIcon(facility);
                                            return (
                                                <div key={facility} className="flex items-center gap-2 text-sm">
                                                    <Icon className="h-4 w-4 text-blue-600" />
                                                    {getFacilityLabel(facility)}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Booking Status */}
                                {selectedRoomDetail.status === 'booked' &&
                                    selectedRoomDetail.bookedSlots &&
                                    selectedRoomDetail.bookedSlots.length > 0 && (
                                        <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                                            <div className="flex items-center gap-2 text-red-800">
                                                <div className="h-2 w-2 rounded-full bg-red-500"></div>
                                                <span className="font-medium">Jadwal yang sudah dipesan:</span>
                                            </div>
                                            <div className="mt-2 space-y-1">
                                                {selectedRoomDetail.bookedSlots.map((slot, index) => (
                                                    <div key={index} className="rounded bg-red-100 px-2 py-1 text-sm text-red-600">
                                                        {slot}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                {selectedRoomDetail.status === 'available' && (
                                    <div className="rounded-lg border border-green-200 bg-green-50 p-3">
                                        <div className="flex items-center gap-2 text-green-800">
                                            <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                            <span className="font-medium">Ruangan Tersedia</span>
                                        </div>
                                        <p className="mt-1 text-sm text-green-600">
                                            Ruangan dapat dipesan untuk waktu: {selectedStartTime} - {selectedEndTime}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end">
                        <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
                            Tutup
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
