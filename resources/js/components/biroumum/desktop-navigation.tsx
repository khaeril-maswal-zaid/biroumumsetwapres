'use client';

import { Button } from '@/components/ui/button';
import { Link, usePage } from '@inertiajs/react';
import { Calendar, Home, User } from 'lucide-react';

export function DesktopNavigation() {
    const { url: pathname } = usePage();

    return (
        <nav className="hidden items-center justify-between bg-white p-4 shadow-sm md:flex">
            <div className="flex items-center space-x-6">
                <Link href="/">
                    <Button variant={pathname === '/' ? 'default' : 'ghost'} className="flex items-center space-x-2">
                        <Home className="h-4 w-4" />
                        <span>Beranda</span>
                    </Button>
                </Link>
                <Link href="/booking">
                    <Button variant={pathname === '/booking' ? 'default' : 'ghost'} className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>Booking</span>
                    </Button>
                </Link>
                <Link href="/profile">
                    <Button variant={pathname === '/profile' ? 'default' : 'ghost'} className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <span>Profil</span>
                    </Button>
                </Link>
            </div>
        </nav>
    );
}
