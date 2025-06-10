"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DesktopNavigation } from "@/components/desktop-navigation"
import { BottomNavigation } from "@/components/bottom-navigation"
import { SearchBar } from "@/components/search-bar"
import { HelpDeskCard } from "@/components/help-desk-card"
import { ServiceMenu } from "@/components/service-menu"
import { ActivityList } from "@/components/activity-list"
import { FooterIllustration } from "@/components/footer-illustration"

const aktivitas = [
  {
    waktu: "10.00 – 12.00",
    ruang: "Ruang Rapat Sinergi 10 orang",
    keterangan: "Untuk Keperluan Rapat Divisi",
  },
  {
    waktu: "12.00 – 13.00",
    ruang: "Ruang Rapat Sinergi 12 orang",
    keterangan: "Untuk Keperluan Briefing Divisi",
  },
]

export default function Dashboard() {
  const [currentTime, setCurrentTime] = useState("07:00")

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const hours = now.getHours().toString().padStart(2, "0")
      const minutes = now.getMinutes().toString().padStart(2, "0")
      setCurrentTime(`${hours}:${minutes}`)
    }

    updateTime()
    const interval = setInterval(updateTime, 60000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Navigation */}
      <DesktopNavigation />

      {/* Main Content */}
      <div className="pb-20 md:pb-0">
        {/* Header with user info */}
        <DashboardHeader userName="Dani Martinez" currentTime={currentTime} />

        <div className="p-4 space-y-6">
          {/* Search Bar */}
          <SearchBar />

          {/* Help Desk Card */}
          <HelpDeskCard />

          {/* Layanan Biro Umum */}
          <ServiceMenu />

          {/* Aktivitas */}
          <ActivityList activities={aktivitas} />

          {/* Footer Illustration (Mobile) */}
          <FooterIllustration />
        </div>
      </div>

      {/* Bottom Navigation (Mobile) */}
      <BottomNavigation />
    </div>
  )
}
