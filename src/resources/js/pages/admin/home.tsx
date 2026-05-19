'use client';
import BookingReports from '@/components/admin/booking';
import HomeDashboard from '@/components/admin/home';
import DamageReports from '@/components/admin/page';
import SuppliesReports from '@/components/admin/suplie';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function AdminDashboard({
    dashboardStats,
    recentActivities,
    upcomingBookings,
    statusDistribution,
    divisionStats,
    topUsers,

    monthlyTrend,
    summaryData,
    itemComparison,
    locationData,
    divisionReports,
    topReportersData,
    damageTypeData,
    urgencyData,

    penggunaanRuangan,
    divisionUsage,
    peakHours,
    weeklyPattern,
    weeklySchedule,
    roomSchedules,
    rooms,
}: any) {
    const { permissions }: any = usePage().props.auth;
    const { hasExecutiveDashboard }: any = usePage().props.auth;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            {hasExecutiveDashboard ? (
                <HomeDashboard dashboardStats={dashboardStats} recentActivities={recentActivities} upcomingBookings={upcomingBookings} />
            ) : permissions && permissions.includes('tindak_lanjuti_supplies') ? (
                <SuppliesReports
                    statusDistribution={statusDistribution}
                    divisionStats={divisionStats}
                    topUsers={topUsers}
                    monthlyTrend={monthlyTrend}
                    summaryData={summaryData}
                    itemComparison={itemComparison}
                />
            ) : permissions && permissions.includes('tindak_lanjuti_bookings') ? (
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
            ) : permissions &&
              (permissions.includes('tindak_lanjuti_bangunan_damages') || permissions.includes('tindak_lanjuti_perlengkapan_damages')) ? (
                <DamageReports
                    monthlyTrend={monthlyTrend}
                    locationData={locationData}
                    divisionReports={divisionReports}
                    topReportersData={topReportersData}
                    summaryData={summaryData}
                    statusDistribution={statusDistribution}
                    damageTypeData={damageTypeData}
                    urgencyData={urgencyData}
                />
            ) : null}
        </AppLayout>
    );
}
