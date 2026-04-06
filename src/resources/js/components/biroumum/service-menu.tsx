'use client';

import { Card, CardContent } from '@/components/ui/card';
import { SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import * as Icons from 'lucide-react';

interface ServiceItem {
    icon: string;
    name: string;
    url: string;
    contact: string;
    permission?: string;
}

export function ServiceMenu() {
    const { services } = usePage<SharedData>().props;
    const { permissions }: any = usePage<SharedData>().props.auth;

    const hasPermission = (permission?: string) => !permission || permissions?.includes(permission);

    const getIcon = (name: string) => Icons[name as keyof typeof Icons] || Icons.HelpCircle;

    return (
        <div>
            <h2 className="mb-4 text-lg font-semibold text-gray-800">Layanan Biro Umum</h2>

            <div className="grid grid-cols-2 gap-4">
                {services.map((item: ServiceItem, index: number) => {
                    const isAllowed = hasPermission(item.permission);
                    const Icon = getIcon(item.icon);

                    if (isAllowed) {
                        return (
                            <Link key={index} href={route(item.url)} className="block">
                                <Card className="h-full min-h-42.5 cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg">
                                    <CardContent className="flex h-full flex-col items-center justify-center p-4 text-center">
                                        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                                            <Icon className="h-6 w-6 text-blue-600" />
                                        </div>

                                        <p className="text-sm leading-tight font-medium text-gray-700">{item.name}</p>
                                        <p className="mt-2 text-xs leading-tight font-medium text-gray-400">
                                            <Icons.PhoneCall className="mr-1 inline h-3.5 w-3.5 text-gray-400" />
                                            {item.contact}
                                        </p>
                                    </CardContent>
                                </Card>
                            </Link>
                        );
                    }

                    return (
                        <div key={index} className="pointer-events-none">
                            <Card className="h-full min-h-42.5 cursor-not-allowed border border-gray-200 opacity-50 transition-opacity duration-200">
                                <CardContent className="flex h-full flex-col items-center justify-center p-4 text-center">
                                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                                        <Icon className="h-6 w-6 text-gray-400" />
                                    </div>

                                    <p className="text-sm leading-tight font-medium text-gray-400">{item.name}</p>

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
