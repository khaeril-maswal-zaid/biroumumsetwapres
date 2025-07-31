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
    LayoutDashboard,
    LockKeyhole,
    PackageCheck,
} from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: route('dashboard'),
        icon: LayoutDashboard, // ✅ lebih spesifik dari LayoutGrid
    },
    {
        title: 'Pemesanan Ruang Rapat',
        href: route('ruangrapat.index'),
        icon: CalendarClock, // ✅ lebih menggambarkan pemesanan + waktu
    },
    {
        title: 'Kerusakan Gedung',
        href: route('kerusakangedung.index'),
        icon: Hammer, // ✅ lebih cocok untuk “kerusakan”
    },
    {
        title: 'Permintaan ATK',
        href: route('permintaanatk.index'),
        icon: ClipboardList, // ✅ menggambarkan permintaan / daftar barang
    },
    {
        title: 'Permintaan Kendaraan',
        href: '#', // route('permintaankendaraan.index'),
        icon: CarFront, // ✅ lebih modern dan umum untuk kendaraan
    },
];

//Laporan---
const reportsNavItems: NavItem[] = [
    {
        title: 'Pemesanan Ruangan',
        href: route('ruangrapat.reports'),
        icon: FileBarChart2, // ✅ laporan bentuk chart
    },
    {
        title: 'Laporan Kerusakan',
        href: route('kerusakangedung.reports'),
        icon: FileWarning, // ✅ laporan + indikasi kerusakan
    },
    {
        title: 'Permintaan ATK',
        href: route('permintaanatk.reports'),
        icon: FileText, // ✅ laporan umum
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Manajemen Ruangan',
        href: route('rooms.index'),
        icon: Building2, // sudah tepat
    },
    {
        title: 'Manajemen ATK',
        href: route('daftaratk.index'),
        icon: PackageCheck, // ✅ barang + stok
    },
    {
        title: 'Kategori Kerusakan',
        href: route('daftarkerusakan.index'),
        icon: Hammer, // sama seperti atas
    },
    {
        title: 'Pengaturan Akses',
        href: route('roles.index'),
        icon: LockKeyhole, // ✅ lebih representatif untuk akses
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

            {/* <SidebarContent>
                <NavReports items={reportsNavItems} />
            </SidebarContent> */}

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
