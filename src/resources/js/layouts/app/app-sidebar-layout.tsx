import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { type BreadcrumbItem } from '@/types';

import type { ComponentType, ReactNode } from 'react';

interface AppSidebarLayoutProps {
    Button?: ComponentType<any>;
    breadcrumbs?: BreadcrumbItem[];
    children: ReactNode;
}

export default function AppSidebarLayout({ Button, children, breadcrumbs = [] }: AppSidebarLayoutProps) {
    return (
        <AppShell variant="sidebar">
            <AppSidebar />
            <AppContent variant="sidebar" className="overflow-x-hidden">
                <AppSidebarHeader Button={Button} breadcrumbs={breadcrumbs} />
                {children}
            </AppContent>
        </AppShell>
    );
}
