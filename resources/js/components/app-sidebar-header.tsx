import { Breadcrumbs } from '@/components/breadcrumbs';
import Notification from '@/components/buttonnavbar/notif';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';

export function AppSidebarHeader({ Button, breadcrumbs = [] }: { Button?: React.ComponentType<any>; breadcrumbs?: BreadcrumbItemType[] }) {
    return (
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-sidebar-border/50 px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            {/* Kiri */}
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>

            {/* Kanan */}
            <div className="flex items-center gap-4">
                <Notification />
                {Button && <Button />}
            </div>
        </header>
    );
}
