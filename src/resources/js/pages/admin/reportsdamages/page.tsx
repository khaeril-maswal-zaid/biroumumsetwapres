'use client';

import DamageReports from '@/components/admin/page';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function DamageReportsPage({
    monthlyTrend,
    locationData,
    divisionReports,
    topReportersData,
    summaryData,
    statusDistribution,
    damageTypeData,
    urgencyData,
}: any) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

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
        </AppLayout>
    );
}
