'use client';

import BookingReports from '@/components/admin/booking';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function BookingReportsPage({
    penggunaanRuangan,
    divisionUsage,
    topUsers,
    summaryData,
    statusDistribution,
    peakHours,
    monthlyTrend,
    weeklyPattern,
    weeklySchedule,
    roomSchedules,
    rooms,
}: any) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <BookingReports
                penggunaanRuangan={penggunaanRuangan}
                divisionUsage={divisionUsage}
                topUsers={topUsers}
                summaryData={summaryData}
                statusDistribution={statusDistribution}
                peakHours={peakHours}
                monthlyTrend={monthlyTrend}
                weeklyPattern={weeklyPattern}
                weeklySchedule={weeklySchedule}
                roomSchedules={roomSchedules}
                rooms={rooms}
            />
        </AppLayout>
    );
}
