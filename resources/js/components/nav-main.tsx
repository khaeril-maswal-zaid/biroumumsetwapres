import { Icon } from '@/components/icon';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BarChart4, ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';

function getPathnameFromHref(href: string): string {
    try {
        return new URL(href).pathname;
    } catch {
        return href; // fallback kalau href sudah relatif
    }
}

function isPathActive(currentPath: string, href: string, exact = false): boolean {
    const base = getPathnameFromHref(href).replace(/\/+$/, '');
    const current = currentPath.replace(/\/+$/, '');

    return exact ? current === base : current === base || current.startsWith(base + '/');
}

type NavMainProps = {
    items: NavItem[];
    itemsReport: NavItem[];
};

export function NavMain({ items, itemsReport }: NavMainProps) {
    const { url: pathname } = usePage();

    const [isManagementOpen, setIsManagementOpen] = useState(itemsReport.some((item: any) => isPathActive(pathname, item.href)));

    console.log('DAFTAR items:', items);
    console.log('DAFTAR itemsReport:', itemsReport);

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => {
                    const isActive = isPathActive(pathname, item.href, true); // exact match ONLY

                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                className={cn(
                                    'text-neutral-600 hover:text-neutral-800 dark:text-neutral-300 dark:hover:text-neutral-100',
                                    isActive && 'border-r-2 border-blue-700 bg-blue-50 text-blue-700',
                                )}
                            >
                                <Link href={item.href} rel="noopener noreferrer">
                                    {item.icon && <Icon iconNode={item.icon} className="h-5 w-5" />}
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}

                <Collapsible open={isManagementOpen} onOpenChange={setIsManagementOpen}>
                    <CollapsibleTrigger asChild>
                        <Button
                            variant="ghost"
                            className={cn(
                                'w-full justify-start rounded-md text-sm font-medium transition-colors',
                                itemsReport.some((item: any) => isPathActive(pathname, item.href))
                                    ? 'bg-blue-50 text-blue-700'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                            )}
                        >
                            <BarChart4 className="h-5 w-5" />
                            Laporan
                            {isManagementOpen ? <ChevronDown className="ml-auto h-4 w-4" /> : <ChevronRight className="ml-auto h-4 w-4" />}
                        </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-1 space-y-1">
                        {itemsReport.map((item: any) => {
                            const isActive = isPathActive(pathname, item.href); // default: partial match OK
                            return (
                                <Link
                                    key={item.title}
                                    href={item.href}
                                    className={cn(
                                        'flex items-center rounded-md px-6 py-1.5 text-sm font-medium transition-colors',
                                        isActive
                                            ? 'border-r-2 border-blue-700 bg-blue-50 text-blue-700'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                                    )}
                                >
                                    <item.icon className="mr-3 h-4 w-4" />
                                    {item.title}
                                </Link>
                            );
                        })}
                    </CollapsibleContent>
                </Collapsible>
            </SidebarMenu>
        </SidebarGroup>
    );
}
