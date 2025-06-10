"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Car } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { SuccessAlert } from "@/components/success-alert"
import { BottomNavigation } from "@/components/bottom-navigation"
import { DesktopNavigation } from "@/components/desktop-navigation"

export default function VehicleRequest() {
  const [formData, setFormData] = useState({
    vehicleType: "",
    date: "",
    time: "",
    destination: "",
    purpose: "",
    passengers: "",
    needDriver: false,
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
          <PageHeader title="Permintaan Kendaraan" backUrl="/" />

          <SuccessAlert show={showSuccess} message="Permintaan kendaraan berhasil diajukan!" />

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Car className="w-5 h-5" />
                <span>Form Permintaan Kendaraan</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="vehicleType">Jenis Kendaraan</Label>
                  <Select
                    value={formData.vehicleType}
                    onValueChange={(value) => setFormData({ ...formData, vehicleType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih jenis kendaraan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sedan">Sedan</SelectItem>
                      <SelectItem value="mpv">MPV</SelectItem>
                      <SelectItem value="bus">Bus</SelectItem>
                      <SelectItem value="pickup">Pick Up</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
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
                  <div>
                    <Label htmlFor="time">Jam</Label>
                    <Input
                      id="time"
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="destination">Tujuan</Label>
                  <Input
                    id="destination"
                    placeholder="Alamat tujuan lengkap"
                    value={formData.destination}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="purpose">Keperluan</Label>
                  <Textarea
                    id="purpose"
                    placeholder="Jelaskan keperluan penggunaan kendaraan..."
                    value={formData.purpose}
                    onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="passengers">Jumlah Penumpang</Label>
                  <Input
                    id="passengers"
                    type="number"
                    placeholder="Masukkan jumlah penumpang"
                    value={formData.passengers}
                    onChange={(e) => setFormData({ ...formData, passengers: e.target.value })}
                    required
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="needDriver"
                    checked={formData.needDriver}
                    onCheckedChange={(checked) => setFormData({ ...formData, needDriver: checked as boolean })}
                  />
                  <Label htmlFor="needDriver">Memerlukan Driver</Label>
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
                  Ajukan Permintaan
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
