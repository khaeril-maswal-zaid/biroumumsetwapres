import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { Building2, Calendar, Car, LayoutGrid, PackageSearch, PenTool, ShieldCheck, Users, Wrench } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Pemesanan Ruang Rapat',
        href: route('ruangrapat.index'),
        icon: Calendar,
    },
    {
        title: 'Kerusakan Gedung',
        href: route('kerusakangedung.index'),
        icon: Wrench,
    },
    {
        title: 'Permintaan ATK',
        href: route('permintaanatk.index'),
        icon: PenTool,
    },
    {
        title: 'Permintaan Kendaraan',
        href: route('permintaankendaraan.index'),
        icon: Car,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Manajemen Ruangan',
        href: '',
        icon: Building2,
    },
    {
        title: 'Manajemen ATK',
        href: '',
        icon: PackageSearch,
    },
    {
        title: 'Manajemen Pengguna',
        href: '',
        icon: Users,
    },
    {
        title: 'Pengaturan Akses',
        href: '',
        icon: ShieldCheck,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
