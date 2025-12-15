import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import {
    Building2,
    CalendarClock,
    CarFront,
    ClipboardList,
    FileBarChart2,
    FileText,
    FileWarning,
    Hammer,
    LockKeyhole,
    PackageCheck,
} from 'lucide-react';
import AppLogo from './app-logo';
const mainNavItems: NavItem[] = [
    // {
    //     title: 'Home',
    //     href: route('dashboard'),
    //     icon: LayoutDashboard,
    //     permission: 'view_admin_dashboard',
    // },
    {
        title: 'Pemesanan Ruang Rapat',
        href: route('ruangrapat.index'),
        icon: CalendarClock,
        permission: 'view_bookings',
    },
    {
        title: 'Kerusakan Gedung',
        href: route('kerusakangedung.index'),
        icon: Hammer,
        permission: 'view_damages',
    },
    {
        title: 'Permintaan ATK',
        href: route('permintaanatk.index'),
        icon: ClipboardList,
        permission: 'view_supplies',
    },
    {
        title: 'Permintaan Kendaraan',
        href: '#', // Ganti nanti dengan route('permintaankendaraan.index') jika aktif
        icon: CarFront,
        permission: 'view_vehicle_requests',
    },
];

const reportsNavItems: NavItem[] = [
    {
        title: 'Pemesanan Ruangan',
        href: route('ruangrapat.reports'),
        icon: FileBarChart2,
        permission: 'report_bookings',
    },
    {
        title: 'Laporan Kerusakan',
        href: route('kerusakangedung.reports'),
        icon: FileWarning,
        permission: 'report_damages',
    },
    {
        title: 'Permintaan ATK',
        href: route('permintaanatk.reports'),
        icon: FileText,
        permission: 'report_supplies',
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Manajemen Ruangan',
        href: route('rooms.index'),
        icon: Building2,
        permission: 'view_rooms',
    },
    {
        title: 'Manajemen ATK',
        href: route('daftaratk.index'),
        icon: PackageCheck,
        permission: 'view_atk',
    },
    {
        title: 'Kategori Kerusakan',
        href: route('daftarkerusakan.index'),
        icon: Hammer,
        permission: 'view_category_damages',
    },
    {
        title: 'Pengaturan Akses',
        href: route('roles.index'),
        icon: LockKeyhole,
        permission: 'management_access',
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
                <NavMain items={mainNavItems} itemsReport={reportsNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
