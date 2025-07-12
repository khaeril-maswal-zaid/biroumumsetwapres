'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Bell, Calendar, Car, Clock, PenTool, Wrench } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Notification {
    id: string;
    type: 'room_booking' | 'damage_report' | 'vehicle_request' | 'supplies_request' | 'room_reminder';
    title: string;
    message: string;
    time: string;
    isRead: boolean;
    priority: 'high' | 'medium' | 'low';
    data?: any;
}

export default function Notification() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    // Simulate notifications data
    useEffect(() => {
        const mockNotifications: Notification[] = [
            {
                id: '1',
                type: 'room_booking',
                title: 'Permintaan Ruang Belum Ditanggapi',
                message: 'Permintaan ruang rapat dari Dani Martinez sudah lebih dari 24 jam belum ditanggapi',
                time: '2 hari yang lalu',
                isRead: false,
                priority: 'high',
                data: { requestId: 'RB001', requester: 'Dani Martinez', room: 'Ruang Holding' },
            },
            {
                id: '2',
                type: 'room_reminder',
                title: 'Pengingat Ruang Rapat',
                message: 'Ruang Holding akan digunakan besok (15 Jan) pukul 09:00 - 11:00',
                time: '1 hari yang lalu',
                isRead: false,
                priority: 'medium',
                data: { room: 'Ruang Holding', date: '15 Jan 2024', time: '09:00 - 11:00' },
            },
            {
                id: '3',
                type: 'damage_report',
                title: 'Laporan Kerusakan Mendesak',
                message: 'Laporan kerusakan AC dari Budi Santoso belum ditanggapi selama 30 jam',
                time: '1 hari yang lalu',
                isRead: false,
                priority: 'high',
                data: { requestId: 'DR002', requester: 'Budi Santoso', damage: 'AC Rusak' },
            },
            {
                id: '4',
                type: 'vehicle_request',
                title: 'Permintaan Kendaraan Tertunda',
                message: 'Permintaan kendaraan MPV dari Siti Aminah sudah 26 jam belum diproses',
                time: '1 hari yang lalu',
                isRead: false,
                priority: 'medium',
                data: { requestId: 'VR003', requester: 'Siti Aminah', vehicle: 'MPV' },
            },
            {
                id: '5',
                type: 'supplies_request',
                title: 'Permintaan ATK Menunggu',
                message: 'Permintaan ATK dari Rudi Hartono sudah 25 jam belum disetujui',
                time: '1 hari yang lalu',
                isRead: false,
                priority: 'medium',
                data: { requestId: 'SR004', requester: 'Rudi Hartono', items: 'Kertas A4, Pulpen' },
            },
            {
                id: '6',
                type: 'room_reminder',
                title: 'Pengingat Ruang Rapat H-1',
                message: 'Ruang Rapat akan digunakan lusa (16 Jan) pukul 13:00 - 14:30',
                time: '6 jam yang lalu',
                isRead: true,
                priority: 'low',
                data: { room: 'Ruang Rapat', date: '16 Jan 2024', time: '13:00 - 14:30' },
            },
            {
                id: '7',
                type: 'room_booking',
                title: 'Permintaan Ruang Baru',
                message: 'Permintaan ruang meeting dari Lisa Wijaya untuk tanggal 17 Jan',
                time: '3 jam yang lalu',
                isRead: true,
                priority: 'low',
                data: { requestId: 'RB005', requester: 'Lisa Wijaya', room: 'Ruang Meeting' },
            },
        ];
        setNotifications(mockNotifications);
    }, []);

    const unreadCount = notifications.filter((n) => !n.isRead).length;
    const highPriorityCount = notifications.filter((n) => !n.isRead && n.priority === 'high').length;

    const getNotificationIcon = (type: Notification['type']) => {
        switch (type) {
            case 'room_booking':
            case 'room_reminder':
                return <Calendar className="h-4 w-4" />;
            case 'damage_report':
                return <Wrench className="h-4 w-4" />;
            case 'vehicle_request':
                return <Car className="h-4 w-4" />;
            case 'supplies_request':
                return <PenTool className="h-4 w-4" />;
            default:
                return <Bell className="h-4 w-4" />;
        }
    };

    const getNotificationColor = (type: Notification['type'], priority: Notification['priority']) => {
        if (priority === 'high') return 'text-red-600 bg-red-50';

        switch (type) {
            case 'room_booking':
            case 'room_reminder':
                return 'text-blue-600 bg-blue-50';
            case 'damage_report':
                return 'text-red-600 bg-red-50';
            case 'vehicle_request':
                return 'text-green-600 bg-green-50';
            case 'supplies_request':
                return 'text-purple-600 bg-purple-50';
            default:
                return 'text-gray-600 bg-gray-50';
        }
    };

    const getPriorityBadge = (priority: Notification['priority']) => {
        switch (priority) {
            case 'high':
                return (
                    <Badge variant="destructive" className="text-xs">
                        Mendesak
                    </Badge>
                );
            case 'medium':
                return (
                    <Badge variant="secondary" className="text-xs">
                        Penting
                    </Badge>
                );
            case 'low':
                return (
                    <Badge variant="outline" className="text-xs">
                        Normal
                    </Badge>
                );
        }
    };

    const markAsRead = (notificationId: string) => {
        setNotifications((prev) => prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n)));
    };

    const markAllAsRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    };

    return (
        <div className="me-3">
            <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                        <Bell className="h-5 w-5" />
                        {unreadCount > 0 && (
                            <Badge
                                className={cn(
                                    'absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center p-0 text-xs',
                                    highPriorityCount > 0 ? 'bg-red-500' : 'bg-blue-500',
                                )}
                            >
                                {unreadCount > 99 ? '99+' : unreadCount}
                            </Badge>
                        )}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="max-h-96 w-96 overflow-y-auto">
                    <div className="flex items-center justify-between p-2">
                        <DropdownMenuLabel className="ms-1.5 gap-0 p-0">
                            <p className="font-bold">Pemberitahuan</p>
                            <span className="text-xs text-gray-500">{unreadCount} belum dibaca</span>
                        </DropdownMenuLabel>
                        {unreadCount > 0 && (
                            <Button variant="ghost" size="sm" className="h-6 bg-gray-100 text-xs" onClick={markAllAsRead}>
                                Tandai semua dibaca
                            </Button>
                        )}
                    </div>
                    <DropdownMenuSeparator />

                    {notifications.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                            <Bell className="mx-auto mb-2 h-8 w-8 opacity-50" />
                            <p className="text-sm">Tidak ada pemberitahuan</p>
                        </div>
                    ) : (
                        <div className="overflow-y-auto">
                            {notifications.map((notification) => (
                                <DropdownMenuItem
                                    key={notification.id}
                                    className={cn('flex cursor-pointer items-start space-x-3 p-3', !notification.isRead && 'bg-blue-50/50')}
                                    onClick={() => markAsRead(notification.id)}
                                >
                                    <div
                                        className={cn(
                                            'flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full',
                                            getNotificationColor(notification.type, notification.priority),
                                        )}
                                    >
                                        {getNotificationIcon(notification.type)}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="mb-1 flex items-center justify-between">
                                            <p className="truncate text-sm font-medium">{notification.title}</p>
                                            {getPriorityBadge(notification.priority)}
                                        </div>
                                        <p className="mb-1 line-clamp-2 text-xs text-gray-600">{notification.message}</p>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center text-xs text-gray-500">
                                                <Clock className="mr-1 h-3 w-3" />
                                                {notification.time}
                                            </div>
                                            {!notification.isRead && <div className="h-2 w-2 rounded-full bg-blue-500"></div>}
                                        </div>
                                    </div>
                                </DropdownMenuItem>
                            ))}
                        </div>
                    )}

                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-center font-medium text-blue-600">Lihat semua pemberitahuan</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
