'use client';

import { Button } from '@/components/ui/button';
import { Link, usePage } from '@inertiajs/react';
import { Calendar, Home, User } from 'lucide-react';

export function BottomNavigation() {
    const { url: pathname } = usePage();

    return (
        <div className="fixed right-0 bottom-0 left-0 mx-auto w-full max-w-md border-t border-gray-200 bg-white px-4 py-2">
            <div className="flex justify-around">
                <Link href="/">
                    <Button
                        variant="ghost"
                        size="sm"
                        className={`flex flex-col items-center space-y-1 ${pathname === '/' ? 'text-blue-600' : 'text-gray-600'}`}
                    >
                        <Home className="h-5 w-5" />
                        <span className="text-xs">Beranda</span>
                    </Button>
                </Link>
                <Link href="/booking">
                    <Button
                        variant="ghost"
                        size="sm"
                        className={`flex flex-col items-center space-y-1 ${pathname === '/booking' ? 'text-blue-600' : 'text-gray-600'}`}
                    >
                        <Calendar className="h-5 w-5" />
                        <span className="text-xs">Booking</span>
                    </Button>
                </Link>
                <Link href={route('user.create')}>
                    <Button
                        variant="ghost"
                        size="sm"
                        className={`flex flex-col items-center space-y-1 ${pathname === '/profile' ? 'text-blue-600' : 'text-gray-600'}`}
                    >
                        <User className="h-5 w-5" />
                        <span className="text-xs">Profil</span>
                    </Button>
                </Link>
            </div>
        </div>
    );
}
