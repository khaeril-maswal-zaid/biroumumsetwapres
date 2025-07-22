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
import { router, usePage } from '@inertiajs/react';
import { AlertTriangle, Bell, Car, Home, Package } from 'lucide-react';
import { useEffect, useState } from 'react';

export interface Notification {
    id: number;
    type: 'overdue' | 'reminder' | 'new' | 'urgent';
    category: 'room' | 'damage' | 'vehicle' | 'supplies';
    title: string;
    message: string;
    priority: 'high' | 'medium' | 'low';
    action_url?: string;
    is_read: boolean;
    created_at: string;
}

export default function Notification() {
    const { notifFromServer } = usePage<SharedData>().props;

    useEffect(() => {
        const interval = setInterval(() => {
            router.reload({
                only: ['notifFromServer'],
            });
        }, 30 * 1000); // 30 detik

        return () => clearInterval(interval);
    }, []);

    const [notifications, setNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        setNotifications([...notifFromServer]);
    }, [notifFromServer]);

    const unreadCount = notifications.filter((n: any) => !n.is_read).length;
    const highPriorityCount = notifications.filter((n: any) => !n.is_read && n.priority === 'high').length;

    const markAsRead = (id: number) => {
        router.patch(
            route('notif.isread', id),
            {
                AlZaidWebcrafters: 'Khaeril Maswal Zaid', //Formalitas, data lansung set true di BE
            },
            {
                onSuccess: () => {
                    //
                },
                onError: (er) => {
                    console.log(er);
                },
            },
        );

        setNotifications((prev) => prev.map((notification) => (notification.id === id ? { ...notification, is_read: true } : notification)));
    };

    const markAllAsRead = () => {
        router.patch(
            route('notif.isreadall'),
            {
                AlZaidWebcrafters: 'Khaeril Maswal Zaid', //Formalitas, data lansung set true di BE
            },
            {
                onSuccess: () => {
                    //
                },
                onError: (er) => {
                    console.log(er);
                },
            },
        );
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

    function timeAgo(dateString: string) {
        const now = new Date();
        const then = new Date(dateString);
        const diff = Math.floor((now.getTime() - then.getTime()) / 1000); // dalam detik

        if (diff < 60) return 'baru saja';
        if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
        if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
        if (diff < 172800) return 'kemarin';
        return `${Math.floor(diff / 86400)} hari lalu`;
    }

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
                                    className={`mb-2 cursor-pointer p-3 ${getNotificationColor(notification.type, notification.priority)} ${
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

                                            {/* Deskripsi dan badge berdampingan */}
                                            <div className="mb-1 flex items-start justify-between gap-2">
                                                <p className="line-clamp-2 flex-1 text-xs text-gray-600">{notification.message}</p>
                                                <div className="flex-shrink-0">{getPriorityBadge(notification.priority)}</div>
                                            </div>

                                            {/* Waktu di bawah */}
                                            <span className="text-xs text-gray-500">{timeAgo(notification.created_at)}</span>
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
