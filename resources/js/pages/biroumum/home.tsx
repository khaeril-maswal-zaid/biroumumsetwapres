'use client';

import { ActivityList } from '@/components/biroumum/activity-list';
import { BottomNavigation } from '@/components/biroumum/bottom-navigation';
import { DashboardHeader } from '@/components/biroumum/dashboard-header';
import { FooterIllustration } from '@/components/biroumum/footer-illustration';
import { HelpDeskCard } from '@/components/biroumum/help-desk-card';
import { SearchBar } from '@/components/biroumum/search-bar';
import { ServiceMenu } from '@/components/biroumum/service-menu';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function Dashboard({ requestHistory }: any) {
    const [currentTime, setCurrentTime] = useState('07:00');

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
            setCurrentTime(`${hours}:${minutes}`);
        };

        updateTime();
        const interval = setInterval(updateTime, 60000);
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <Head title="Biro Umum - Setwapres" />
            <div className="mx-auto min-h-screen w-full max-w-md bg-gray-50">
                {/* Desktop Navigation */}

                {/* Main Content */}
                <div className="pb-20">
                    {/* Header with user info */}
                    <DashboardHeader userName="Dani Martinez" currentTime={currentTime} />

                    <div className="space-y-6 p-4">
                        {/* Search Bar */}
                        <SearchBar />

                        {/* Help Desk Card */}
                        <HelpDeskCard />

                        {/* Layanan Biro Umum */}
                        <ServiceMenu />

                        {/* Aktivitas */}
                        <ActivityList activities={requestHistory} />

                        {/* Footer Illustration (Mobile) */}
                        <FooterIllustration />
                    </div>
                </div>

                {/* Bottom Navigation (Mobile) */}
                <BottomNavigation />
            </div>
        </>
    );
}
