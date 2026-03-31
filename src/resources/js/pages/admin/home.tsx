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
        title: 'Home',
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            {permissions && permissions.includes('management_access') ? (
                <HomeDashboard dashboardStats={dashboardStats} recentActivities={recentActivities} upcomingBookings={upcomingBookings} />
            ) : permissions && permissions.includes('change_supplies_status') ? (
                <SuppliesReports
                    statusDistribution={statusDistribution}
                    divisionStats={divisionStats}
                    topUsers={topUsers}
                    monthlyTrend={monthlyTrend}
                    summaryData={summaryData}
                    itemComparison={itemComparison}
                />
            ) : permissions && permissions.includes('change_damage_status') ? (
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
            ) : permissions && permissions.includes('change_booking_status') ? (
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
            ) : null}
        </AppLayout>
    );
}
