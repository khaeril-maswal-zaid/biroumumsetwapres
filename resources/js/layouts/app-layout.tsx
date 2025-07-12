import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';

import type { ComponentType } from 'react';

interface AppLayoutProps {
    Button?: ComponentType<any>;
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ Button, children, breadcrumbs, ...props }: AppLayoutProps) => (
    <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props} Button={Button}>
        {children}
    </AppLayoutTemplate>
);
