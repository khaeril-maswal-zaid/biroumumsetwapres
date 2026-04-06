'use client';

import { ActivityList } from '@/components/biroumum/activity-list';
import { BottomNavigation } from '@/components/biroumum/bottom-navigation';
import { DashboardHeader } from '@/components/biroumum/dashboard-header';
import { HelpDeskCard } from '@/components/biroumum/help-desk-card';
import { ServiceMenu } from '@/components/biroumum/service-menu';
import { Button } from '@/components/ui/button';
import { SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, LayoutDashboard } from 'lucide-react';

export default function Dashboard({ requestHistory, mainServices }: any) {
    const { auth } = usePage<SharedData>().props;
    const permissions = auth?.permissions || [];

    console.log(permissions);

    return (
        <>
            <Head title="Home" />
            <div className="mx-auto min-h-screen w-full max-w-md bg-gray-50">
                {/* Desktop Navigation */}

                {/* Main Content */}
                <div className="pb-20">
                    {/* Header with user info */}
                    <DashboardHeader userName={auth.user?.name} />

                    <div className="space-y-6 p-4">
                        {/* Search Bar */}
                        {/* <SearchBar /> */}

                        {/* Help Desk Card */}
                        <HelpDeskCard mainServices={mainServices} />

                        {/* Quick Admin Dashboard Link (visible only with permission) */}
                        {permissions && permissions.includes('view_admin_dashboard') && (
                            <Link href={route('dashboard')} as="div" className="w-full">
                                <Button
                                    asChild
                                    className="group relative w-full overflow-hidden bg-linear-to-r from-blue-600 to-blue-700 text-white shadow-lg transition-all duration-300 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl"
                                >
                                    <span className="flex items-center justify-center gap-2">
                                        <LayoutDashboard className="h-5 w-5 transition-transform group-hover:rotate-12" />
                                        <span className="font-semibold">Admin Dashboard</span>
                                        <ArrowRight className="-ml-2 h-4 w-4 opacity-0 transition-all group-hover:ml-0 group-hover:opacity-100" />
                                    </span>
                                </Button>
                            </Link>
                        )}

                        {/* Layanan Biro Umum */}
                        <ServiceMenu />

                        {/* Aktivitas */}
                        <ActivityList activities={requestHistory} />
                    </div>
                </div>

                {/* Bottom Navigation (Mobile) */}
                <BottomNavigation />
            </div>
        </>
    );
}
