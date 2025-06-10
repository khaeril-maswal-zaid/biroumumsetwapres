"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Users } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { SuccessAlert } from "@/components/success-alert"
import { BottomNavigation } from "@/components/bottom-navigation"
import { DesktopNavigation } from "@/components/desktop-navigation"

export default function RoomBooking() {
  const [formData, setFormData] = useState({
    room: "",
    date: "",
    startTime: "",
    endTime: "",
    purpose: "",
    contact: "",
  })
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowSuccess(true)
    setTimeout(() => {
      setShowSuccess(false)
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DesktopNavigation />

      <div className="pb-20 md:pb-0">
        <div className="p-4 space-y-6">
          <PageHeader title="Pemesanan Ruang Rapat" backUrl="/" />

          <SuccessAlert show={showSuccess} message="Pemesanan ruang rapat berhasil diajukan!" />

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Form Pemesanan</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="room">Pilih Ruangan</Label>
                  <RadioGroup
                    value={formData.room}
                    onValueChange={(value) => setFormData({ ...formData, room: value })}
                    className="mt-2"
                  >
                    <div className="flex items-center space-x-2 p-3 border rounded-lg">
                      <RadioGroupItem value="holding" id="holding" />
                      <Label htmlFor="holding" className="flex-1">
                        <div className="font-medium">Ruang Holding</div>
                        <div className="text-sm text-gray-500">Kapasitas: 16 Orang</div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded-lg">
                      <RadioGroupItem value="rapat" id="rapat" />
                      <Label htmlFor="rapat" className="flex-1">
                        <div className="font-medium">Ruang Rapat</div>
                        <div className="text-sm text-gray-500">Kapasitas: 7 Orang</div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="date">Tanggal</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startTime">Jam Mulai</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="endTime">Jam Selesai</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="purpose">Keperluan</Label>
                  <Textarea
                    id="purpose"
                    placeholder="Jelaskan keperluan penggunaan ruangan..."
                    value={formData.purpose}
                    onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="contact">Kontak Person</Label>
                  <Input
                    id="contact"
                    placeholder="Nama dan nomor telepon"
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    required
                  />
                </div>

                <Button type="submit" className="w-full">
                  Ajukan Pemesanan
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <BottomNavigation />
    </div>
  )
}
