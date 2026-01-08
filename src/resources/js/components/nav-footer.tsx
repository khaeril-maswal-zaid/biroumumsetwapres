import { Icon } from '@/components/icon';
import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { type ComponentPropsWithoutRef } from 'react';

export function NavFooter({
    items,
    className,
    ...props
}: ComponentPropsWithoutRef<typeof SidebarGroup> & {
    items: NavItem[];
}) {
    const { url } = usePage();
    const { permissions }: any = usePage().props.auth;

    return (
        <SidebarGroup {...props} className={`group-data-[collapsible=icon]:p-0 ${className || ''}`}>
            <SidebarGroupContent>
                <SidebarMenu>
                    {items
                        .filter((item) => {
                            if (!item.permission) return true;
                            return permissions.includes(item.permission);
                        })
                        .map((item) => {
                            let itemPath = '/';
                            try {
                                itemPath = new URL(item.href).pathname;
                            } catch {
                                itemPath = item.href;
                            }
                            const isActive = url.startsWith(itemPath);

                            return (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        className={`text-neutral-600 hover:text-neutral-800 ${
                                            isActive ? 'border-r-2 border-blue-700 bg-blue-50 text-blue-700' : ''
                                        }`}
                                    >
                                        <Link href={item.href} rel="noopener noreferrer">
                                            {item.icon && <Icon iconNode={item.icon} className="h-5 w-5" />}
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            );
                        })}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
}
