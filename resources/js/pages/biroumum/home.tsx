'use client';

import { ActivityList } from '@/components/biroumum/activity-list';
import { BottomNavigation } from '@/components/biroumum/bottom-navigation';
import { DashboardHeader } from '@/components/biroumum/dashboard-header';
import { FooterIllustration } from '@/components/biroumum/footer-illustration';
import { HelpDeskCard } from '@/components/biroumum/help-desk-card';
import { SearchBar } from '@/components/biroumum/search-bar';
import { ServiceMenu } from '@/components/biroumum/service-menu';
import { SharedData } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { useEffect } from 'react';

export default function Dashboard({ requestHistory }: any) {
    const { auth } = usePage<SharedData>().props;

    useEffect(() => {
        const interval = setInterval(() => {
            router.reload({ only: ['requestHistory'] });
        }, 60 * 1000); // 1 * 60 detik

        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <Head title="Layanan Biro Umum - Setwapres" />
            <div className="mx-auto min-h-screen w-full max-w-md bg-gray-50">
                {/* Desktop Navigation */}

                {/* Main Content */}
                <div className="pb-20">
                    {/* Header with user info */}
                    <DashboardHeader userName={auth.user?.name} />

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
