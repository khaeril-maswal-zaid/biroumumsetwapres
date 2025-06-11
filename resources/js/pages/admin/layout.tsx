"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, Calendar, Wrench, Car, PenTool, LogOut, Menu, X } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface SidebarItemProps {
  icon: React.ElementType
  label: string
  href: string
  active?: boolean
}

function SidebarItem({ icon: Icon, label, href, active }: SidebarItemProps) {
  return (
    <Link href={href}>
      <div
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-gray-100",
          active ? "bg-gray-100 text-gray-900" : "text-gray-500",
        )}
      >
        <Icon className="h-4 w-4" />
        <span>{label}</span>
      </div>
    </Link>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="flex min-h-screen w-full bg-gray-50/50">
      {/* Sidebar for desktop */}
      <aside className="hidden w-64 border-r bg-white lg:block">
        <div className="flex h-full flex-col">
          <div className="flex h-14 items-center border-b px-4">
            <Link href="/admin" className="flex items-center gap-2 font-semibold">
              <LayoutDashboard className="h-6 w-6" />
              <span>Biro Umum Admin</span>
            </Link>
          </div>
          <nav className="flex-1 overflow-auto py-4 px-2">
            <div className="space-y-1">
              <h2 className="mb-2 px-4 text-xs font-semibold tracking-tight text-gray-500">Menu</h2>
              <SidebarItem icon={LayoutDashboard} label="Dashboard" href="/admin" active={pathname === "/admin"} />
              <SidebarItem
                icon={Calendar}
                label="Pemesanan Ruang"
                href="/admin/bookings"
                active={pathname === "/admin/bookings"}
              />
              <SidebarItem
                icon={Wrench}
                label="Kerusakan Gedung"
                href="/admin/damages"
                active={pathname === "/admin/damages"}
              />
              <SidebarItem
                icon={Car}
                label="Permintaan Kendaraan"
                href="/admin/vehicles"
                active={pathname === "/admin/vehicles"}
              />
              <SidebarItem
                icon={PenTool}
                label="Permintaan ATK"
                href="/admin/supplies"
                active={pathname === "/admin/supplies"}
              />
              <SidebarItem icon={Users} label="Pengguna" href="/admin/users" active={pathname === "/admin/users"} />
            </div>
          </nav>
          <div className="mt-auto border-t p-4">
            <div className="flex items-center gap-3 rounded-lg px-3 py-2">
              <Avatar className="h-9 w-9">
                <AvatarImage src="/placeholder.svg?height=36&width=36" alt="Admin" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              <div className="flex flex-1 flex-col">
                <span className="text-sm font-medium">Admin User</span>
                <span className="text-xs text-gray-500">admin@biroumum.com</span>
              </div>
              <Button variant="ghost" size="icon">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile menu */}
      <div className="lg:hidden">
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
        )}
        <div
          className={cn(
            "fixed left-0 top-0 z-50 h-full w-64 transform bg-white transition-transform duration-300 ease-in-out lg:hidden",
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex h-full flex-col">
            <div className="flex h-14 items-center border-b px-4">
              <Link href="/admin" className="flex items-center gap-2 font-semibold">
                <LayoutDashboard className="h-6 w-6" />
                <span>Biro Umum Admin</span>
              </Link>
              <Button variant="ghost" size="icon" className="ml-auto" onClick={() => setIsMobileMenuOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <nav className="flex-1 overflow-auto py-4 px-2">
              <div className="space-y-1">
                <h2 className="mb-2 px-4 text-xs font-semibold tracking-tight text-gray-500">Menu</h2>
                <SidebarItem icon={LayoutDashboard} label="Dashboard" href="/admin" active={pathname === "/admin"} />
                <SidebarItem
                  icon={Calendar}
                  label="Pemesanan Ruang"
                  href="/admin/bookings"
                  active={pathname === "/admin/bookings"}
                />
                <SidebarItem
                  icon={Wrench}
                  label="Kerusakan Gedung"
                  href="/admin/damages"
                  active={pathname === "/admin/damages"}
                />
                <SidebarItem
                  icon={Car}
                  label="Permintaan Kendaraan"
                  href="/admin/vehicles"
                  active={pathname === "/admin/vehicles"}
                />
                <SidebarItem
                  icon={PenTool}
                  label="Permintaan ATK"
                  href="/admin/supplies"
                  active={pathname === "/admin/supplies"}
                />
                <SidebarItem icon={Users} label="Pengguna" href="/admin/users" active={pathname === "/admin/users"} />
              </div>
            </nav>
            <div className="mt-auto border-t p-4">
              <div className="flex items-center gap-3 rounded-lg px-3 py-2">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="/placeholder.svg?height=36&width=36" alt="Admin" />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
                <div className="flex flex-1 flex-col">
                  <span className="text-sm font-medium">Admin User</span>
                  <span className="text-xs text-gray-500">admin@biroumum.com</span>
                </div>
                <Button variant="ghost" size="icon">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 top-3 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </Button>
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="flex h-14 items-center border-b bg-white px-4 lg:px-8">
          <div className="ml-auto flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <span className="sr-only">Notifications</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
              </svg>
            </Button>
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Admin" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
          </div>
        </div>
        <div className="p-4 lg:p-8">{children}</div>
      </main>
    </div>
  )
}
