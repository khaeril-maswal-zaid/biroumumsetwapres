'use client';

import SuppliesReports from '@/components/admin/suplie';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function SuppliesReportsPage({ statusDistribution, divisionStats, topUsers, monthlyTrend, summaryData, itemComparison }: any) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <SuppliesReports
                statusDistribution={statusDistribution}
                divisionStats={divisionStats}
                topUsers={topUsers}
                monthlyTrend={monthlyTrend}
                summaryData={summaryData}
                itemComparison={itemComparison}
            />
        </AppLayout>
    );
}
