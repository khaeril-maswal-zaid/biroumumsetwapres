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
import { ScrollArea } from '@/components/ui/scroll-area';
import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { AlertTriangle, Bell, Car, Home, Package } from 'lucide-react';
import { useState } from 'react';

interface Notification {
    id: string;
    type: 'overdue' | 'reminder' | 'new' | 'urgent';
    category: 'room' | 'damage' | 'vehicle' | 'supplies';
    title: string;
    message: string;
    timestamp: string;
    is_read: boolean;
    priority: 'high' | 'medium' | 'low';
    actionUrl?: string;
}

export default function Notification() {
    const { notifFromServer } = usePage<SharedData>().props;

    const [notifications, setNotifications] = useState<Notification[]>([
        ...notifFromServer,

        // Permintaan tertunda >24 jam
        // {
        //     id: '1',
        //     type: 'overdue',
        //     category: 'room',
        //     title: 'Permintaan Ruang Tertunda',
        //     message: 'Permintaan Ruang Meeting A oleh Dani Martinez sudah 2 hari belum ditanggapi',
        //     timestamp: '2 hari yang lalu',
        //     is_read: false,
        //     priority: 'high',
        //     actionUrl: '/admin/bookings',
        // },
        // {
        //     id: '2',
        //     type: 'overdue',
        //     category: 'damage',
        //     title: 'Laporan Kerusakan Tertunda',
        //     message: 'Laporan kerusakan AC di Ruang 201 sudah 1 hari belum diproses',
        //     timestamp: '1 hari yang lalu',
        //     is_read: false,
        //     priority: 'high',
        //     actionUrl: '/admin/damages',
        // },
        // {
        //     id: '3',
        //     type: 'overdue',
        //     category: 'supplies',
        //     title: 'Permintaan ATK Tertunda',
        //     message: 'Permintaan ATK dari Biro 2 sudah 3 hari belum disetujui',
        //     timestamp: '3 hari yang lalu',
        //     is_read: false,
        //     priority: 'high',
        //     actionUrl: '/admin/supplies',
        // },
        // // Pengingat ruangan H-2 dan H-1
        // {
        //     id: '4',
        //     type: 'reminder',
        //     category: 'room',
        //     title: 'Pengingat Ruangan H-1',
        //     message: 'Ruang Meeting B akan digunakan besok (15 Jan) pukul 09:00 untuk Rapat Bulanan',
        //     timestamp: 'Hari ini',
        //     is_read: false,
        //     priority: 'medium',
        //     actionUrl: '/admin/bookings',
        // },
        // {
        //     id: '5',
        //     type: 'reminder',
        //     category: 'room',
        //     title: 'Pengingat Ruangan H-2',
        //     message: 'Ruang Auditorium akan digunakan lusa (16 Jan) pukul 14:00 untuk Seminar',
        //     timestamp: 'Hari ini',
        //     is_read: false,
        //     priority: 'medium',
        //     actionUrl: '/admin/bookings',
        // },
        // // Permintaan baru
        // {
        //     id: '6',
        //     type: 'new',
        //     category: 'vehicle',
        //     title: 'Permintaan Kendaraan Baru',
        //     message: 'Permintaan kendaraan untuk dinas luar kota dari Biro 3',
        //     timestamp: '2 jam yang lalu',
        //     is_read: false,
        //     priority: 'medium',
        //     actionUrl: '/admin/vehicles',
        // },
        // {
        //     id: '7',
        //     type: 'urgent',
        //     category: 'damage',
        //     title: 'Laporan Kerusakan Darurat',
        //     message: 'Kerusakan listrik di Server Room - Status Darurat',
        //     timestamp: '30 menit yang lalu',
        //     is_read: false,
        //     priority: 'high',
        //     actionUrl: '/admin/damages',
        // },
        // // Notifikasi yang sudah dibaca
        // {
        //     id: '8',
        //     type: 'new',
        //     category: 'supplies',
        //     title: 'Permintaan ATK Disetujui',
        //     message: 'Permintaan ATK dari Biro 1 telah disetujui dan sedang diproses',
        //     timestamp: '1 jam yang lalu',
        //     is_read: true,
        //     priority: 'low',
        // },
    ]);

    const unreadCount = notifications.filter((n: any) => !n.is_read).length;
    const highPriorityCount = notifications.filter((n: any) => !n.is_read && n.priority === 'high').length;

    const markAsRead = (id: string) => {
        setNotifications((prev) => prev.map((notification) => (notification.id === id ? { ...notification, is_read: true } : notification)));
    };

    const markAllAsRead = () => {
        setNotifications((prev) => prev.map((notification) => ({ ...notification, is_read: true })));
    };

    const getNotificationIcon = (category: string) => {
        switch (category) {
            case 'room':
                return <Home className="h-4 w-4" />;
            case 'damage':
                return <AlertTriangle className="h-4 w-4" />;
            case 'vehicle':
                return <Car className="h-4 w-4" />;
            case 'supplies':
                return <Package className="h-4 w-4" />;
            default:
                return <Bell className="h-4 w-4" />;
        }
    };

    const getNotificationColor = (type: string, priority: string) => {
        if (priority === 'high') return 'bg-red-50 border-red-200';
        if (type === 'reminder') return 'bg-blue-50 border-blue-200';
        if (type === 'new') return 'bg-green-50 border-green-200';
        return 'bg-gray-50 border-gray-200';
    };

    const getPriorityBadge = (priority: string) => {
        switch (priority) {
            case 'high':
                return <Badge className="bg-red-100 text-xs text-red-800">Mendesak</Badge>;
            case 'medium':
                return <Badge className="bg-yellow-100 text-xs text-yellow-800">Penting</Badge>;
            case 'low':
                return (
                    <Badge variant="outline" className="text-xs">
                        Normal
                    </Badge>
                );
            default:
                return null;
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="relative bg-transparent">
                    <Bell className="h-4 w-4" />
                    {unreadCount > 0 && (
                        <Badge
                            className={`absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs ${
                                highPriorityCount > 0 ? 'bg-red-500' : 'bg-blue-500'
                            }`}
                        >
                            {unreadCount > 99 ? '99+' : unreadCount}
                        </Badge>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-96">
                <DropdownMenuLabel className="flex items-center justify-between">
                    <span>Notifikasi ({unreadCount})</span>
                    {unreadCount > 0 && (
                        <Button variant="ghost" size="sm" onClick={markAllAsRead} className="h-auto bg-gray-100 py-1.5 pe-3 text-xs">
                            Tandai Semua Dibaca
                        </Button>
                    )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <ScrollArea className="h-96">
                    {notifications.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                            <Bell className="mx-auto mb-2 h-8 w-8 text-gray-300" />
                            <p className="text-sm">Tidak ada notifikasi</p>
                        </div>
                    ) : (
                        <div className="space-y-0.5">
                            {notifications.map((notification: any) => (
                                <DropdownMenuItem
                                    key={notification.id}
                                    className={`cursor-pointer p-4 ${getNotificationColor(notification.type, notification.priority)} ${
                                        !notification.is_read ? 'border-l-4' : ''
                                    }`}
                                    onClick={() => markAsRead(notification.id)}
                                >
                                    <div className="flex w-full items-start gap-3">
                                        <div className="mt-1 flex-shrink-0">{getNotificationIcon(notification.category)}</div>
                                        <div className="min-w-0 flex-1">
                                            <div className="mb-1 flex items-center justify-between">
                                                <h4 className="truncate text-sm font-medium text-gray-900">{notification.title}</h4>
                                                {!notification.is_read && <div className="ml-2 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500" />}
                                            </div>
                                            <p className="line-clamp-2 text-xs text-gray-600">{notification.message}</p>
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs text-gray-500">{notification.timestamp}</span>
                                                {getPriorityBadge(notification.priority)}
                                            </div>
                                        </div>
                                    </div>
                                </DropdownMenuItem>
                            ))}
                        </div>
                    )}
                </ScrollArea>

                {notifications.length > 0 && (
                    <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-center text-blue-600 hover:text-blue-800">
                            <span className="w-full">Lihat Semua Notifikasi</span>
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
