'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Link, usePage } from '@inertiajs/react';
import type { LucideIcon } from 'lucide-react';
import { Car, PenTool, Users, Wrench } from 'lucide-react';

interface ServiceItem {
    icon: LucideIcon;
    label: string;
    href: string;
    permission?: string;
}

export function ServiceMenu() {
    const { permissions }: any = usePage().props.auth;

    const layananItems: ServiceItem[] = [
        {
            icon: Users,
            label: 'Pemesanan Ruang Rapat',
            href: route('ruangrapat.create'),
            permission: 'create_booking',
        },
        {
            icon: Wrench,
            label: 'Kerusakan Sarpras',
            href: route('kerusakangedung.create'),
            permission: 'create_damage',
        },
        {
            icon: PenTool,
            label: 'Permintaan ATK',
            href: route('permintaanatk.create'),
            permission: 'create_supplies',
        },
        {
            icon: Car,
            label: 'Permintaan Kendaraan',
            href: '#', // Ganti nanti dengan route('permintaankendaraan.index') jika aktif
            permission: 'create_vehicle',
        },
    ];

    const hasPermission = (permission?: string) => !permission || permissions?.includes(permission);

    return (
        <div>
            <h2 className="mb-4 text-lg font-semibold text-gray-800">Layanan Biro Umum</h2>
            <div className="grid grid-cols-2 gap-4">
                {layananItems.map((item, index) => {
                    const isAllowed = hasPermission(item.permission);

                    if (isAllowed) {
                        return (
                            <Link key={index} href={item.href}>
                                <Card className="cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg">
                                    <CardContent className="p-4 text-center">
                                        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                                            <item.icon className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <p className="text-sm leading-tight font-medium text-gray-700">{item.label}</p>
                                    </CardContent>
                                </Card>
                            </Link>
                        );
                    }

                    return (
                        <div key={index} className="pointer-events-none">
                            <Card className="cursor-not-allowed border border-gray-200 opacity-50 transition-opacity duration-200">
                                <CardContent className="p-4 text-center">
                                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                                        <item.icon className="h-6 w-6 text-gray-400" />
                                    </div>
                                    <p className="text-sm leading-tight font-medium text-gray-400">{item.label}</p>
                                    <p className="mt-2 text-xs text-gray-500">Tidak ada akses</p>
                                </CardContent>
                            </Card>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
