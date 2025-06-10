"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { PenTool } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { SuccessAlert } from "@/components/success-alert"
import { BottomNavigation } from "@/components/bottom-navigation"
import { DesktopNavigation } from "@/components/desktop-navigation"

export default function SuppliesRequest() {
  const [formData, setFormData] = useState({
    department: "",
    items: [{ name: "", quantity: "", unit: "" }],
    justification: "",
    urgency: "",
    contact: "",
  })
  const [showSuccess, setShowSuccess] = useState(false)

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { name: "", quantity: "", unit: "" }],
    })
  }

  const removeItem = (index: number) => {
    const newItems = formData.items.filter((_, i) => i !== index)
    setFormData({ ...formData, items: newItems })
  }

  const updateItem = (index: number, field: string, value: string) => {
    const newItems = formData.items.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    setFormData({ ...formData, items: newItems })
  }

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
          <PageHeader title="Permintaan Alat Tulis Kantor" backUrl="/" />

          <SuccessAlert show={showSuccess} message="Permintaan alat tulis kantor berhasil diajukan!" />

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <PenTool className="w-5 h-5" />
                <span>Form Permintaan ATK</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="department">Divisi/Bagian</Label>
                  <Input
                    id="department"
                    placeholder="Nama divisi atau bagian"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label>Daftar Barang</Label>
                  {formData.items.map((item, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 mt-2">
                      <div className="col-span-5">
                        <Input
                          placeholder="Nama barang"
                          value={item.name}
                          onChange={(e) => updateItem(index, "name", e.target.value)}
                          required
                        />
                      </div>
                      <div className="col-span-3">
                        <Input
                          type="number"
                          placeholder="Jumlah"
                          value={item.quantity}
                          onChange={(e) => updateItem(index, "quantity", e.target.value)}
                          required
                        />
                      </div>
                      <div className="col-span-3">
                        <Select value={item.unit} onValueChange={(value) => updateItem(index, "unit", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Satuan" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pcs">Pcs</SelectItem>
                            <SelectItem value="box">Box</SelectItem>
                            <SelectItem value="pack">Pack</SelectItem>
                            <SelectItem value="rim">Rim</SelectItem>
                            <SelectItem value="lusin">Lusin</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-1">
                        {formData.items.length > 1 && (
                          <Button type="button" variant="outline" size="sm" onClick={() => removeItem(index)}>
                            ×
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={addItem} className="mt-2">
                    + Tambah Barang
                  </Button>
                </div>

                <div>
                  <Label htmlFor="justification">Justifikasi Kebutuhan</Label>
                  <Textarea
                    id="justification"
                    placeholder="Jelaskan alasan kebutuhan barang-barang tersebut..."
                    value={formData.justification}
                    onChange={(e) => setFormData({ ...formData, justification: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="urgency">Tingkat Urgensi</Label>
                  <RadioGroup
                    value={formData.urgency}
                    onValueChange={(value) => setFormData({ ...formData, urgency: value })}
                    className="mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="normal" id="normal" />
                      <Label htmlFor="normal">Normal (1-2 minggu)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="mendesak" id="mendesak" />
                      <Label htmlFor="mendesak">Mendesak (3-5 hari)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="segera" id="segera" />
                      <Label htmlFor="segera">Segera (1-2 hari)</Label>
                    </div>
                  </RadioGroup>
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
