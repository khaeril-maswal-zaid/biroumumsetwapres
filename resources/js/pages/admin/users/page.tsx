"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Building, Mail, Phone, Search, User, UserCheck, UserX } from "lucide-react"

// Mock data for users
const users = [
  {
    id: "1",
    name: "Dani Martinez",
    email: "dani.martinez@company.com",
    phone: "+62 812-3456-7890",
    devisi: "Biro 1",
    role: "Staff",
    status: "active",
    avatar: "/placeholder.svg?height=40&width=40",
    joinDate: "2024-01-15",
    lastLogin: "2025-06-11T08:30:00",
  },
  {
    id: "2",
    name: "Budi Santoso",
    email: "budi.santoso@company.com",
    phone: "+62 812-3456-7891",
    devisi: "Biro 2",
    role: "Supervisor",
    status: "active",
    avatar: "/placeholder.svg?height=40&width=40",
    joinDate: "2023-08-20",
    lastLogin: "2025-06-10T17:45:00",
  },
  {
    id: "3",
    name: "Siti Aminah",
    email: "siti.aminah@company.com",
    phone: "+62 812-3456-7892",
    devisi: "Biro 3",
    role: "Manager",
    status: "active",
    avatar: "/placeholder.svg?height=40&width=40",
    joinDate: "2023-03-10",
    lastLogin: "2025-06-11T09:15:00",
  },
  {
    id: "4",
    name: "Rudi Hartono",
    email: "rudi.hartono@company.com",
    phone: "+62 812-3456-7893",
    devisi: "Biro 4",
    role: "Staff",
    status: "inactive",
    avatar: "/placeholder.svg?height=40&width=40",
    joinDate: "2024-05-22",
    lastLogin: "2025-06-05T14:20:00",
  },
  {
    id: "5",
    name: "Dewi Lestari",
    email: "dewi.lestari@company.com",
    phone: "+62 812-3456-7894",
    devisi: "Biro 1",
    role: "Staff",
    status: "active",
    avatar: "/placeholder.svg?height=40&width=40",
    joinDate: "2024-02-28",
    lastLogin: "2025-06-11T07:50:00",
  },
  {
    id: "6",
    name: "Ahmad Fauzi",
    email: "ahmad.fauzi@company.com",
    phone: "+62 812-3456-7895",
    devisi: "Biro 2",
    role: "Staff",
    status: "suspended",
    avatar: "/placeholder.svg?height=40&width=40",
    joinDate: "2024-07-12",
    lastLogin: "2025-06-08T16:30:00",
  },
]

export default function UsersAdmin() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [roleFilter, setRoleFilter] = useState("all")
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleActivateUser = async (userId: string) => {
    setIsProcessing(true)
    // Simulasi API call
    setTimeout(() => {
      console.log(`User ${userId} activated`)
      setIsProcessing(false)
      setIsDetailsOpen(false)
      // Di aplikasi nyata, ini akan update data dari server
    }, 1000)
  }

  const handleDeactivateUser = async (userId: string) => {
    setIsProcessing(true)
    // Simulasi API call
    setTimeout(() => {
      console.log(`User ${userId} deactivated`)
      setIsProcessing(false)
      setIsDetailsOpen(false)
      // Di aplikasi nyata, ini akan update data dari server
    }, 1000)
  }

  // Filter users based on search term, status, and role
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.devisi.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || user.status === statusFilter
    const matchesRole = roleFilter === "all" || user.role === roleFilter

    return matchesSearch && matchesStatus && matchesRole
  })

  const handleViewDetails = (user: any) => {
    setSelectedUser(user)
    setIsDetailsOpen(true)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Aktif</Badge>
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">Tidak Aktif</Badge>
      case "suspended":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Suspended</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "Manager":
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">Manager</Badge>
      case "Supervisor":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Supervisor</Badge>
      case "Staff":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">Staff</Badge>
      default:
        return <Badge variant="outline">{role}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date)
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manajemen Pengguna</h1>
        <p className="text-gray-500">Kelola semua pengguna sistem Biro Umum.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Pengguna</CardTitle>
          <CardDescription>Semua pengguna yang terdaftar dalam sistem.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex w-full max-w-sm items-center space-x-2">
              <Search className="h-4 w-4 text-gray-400" />
              <Input
                placeholder="Cari nama, email, atau divisi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="active">Aktif</SelectItem>
                  <SelectItem value="inactive">Tidak Aktif</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Role</SelectItem>
                  <SelectItem value="Manager">Manager</SelectItem>
                  <SelectItem value="Supervisor">Supervisor</SelectItem>
                  <SelectItem value="Staff">Staff</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pengguna</TableHead>
                  <TableHead className="hidden md:table-cell">Divisi</TableHead>
                  <TableHead className="hidden lg:table-cell">Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden lg:table-cell">Login Terakhir</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                      Tidak ada pengguna yang ditemukan
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                            <AvatarFallback>
                              {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{user.devisi}</TableCell>
                      <TableCell className="hidden lg:table-cell">{getRoleBadge(user.role)}</TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell className="hidden lg:table-cell">{formatDateTime(user.lastLogin)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => handleViewDetails(user)}>
                          Detail
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* User Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Detail Pengguna</DialogTitle>
            <DialogDescription>Informasi lengkap tentang pengguna.</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedUser.avatar || "/placeholder.svg"} alt={selectedUser.name} />
                  <AvatarFallback className="text-lg">
                    {selectedUser.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-medium">{selectedUser.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    {getRoleBadge(selectedUser.role)}
                    {getStatusBadge(selectedUser.status)}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <p className="text-sm">{selectedUser.email}</p>
                </div>

                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <p className="text-sm">{selectedUser.phone}</p>
                </div>

                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-gray-500" />
                  <p className="text-sm">{selectedUser.devisi}</p>
                </div>

                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <p className="text-sm">Role: {selectedUser.role}</p>
                </div>

                <div className="pt-2 space-y-2">
                  <div>
                    <p className="text-sm font-medium">Tanggal Bergabung:</p>
                    <p className="text-sm text-gray-700">{formatDate(selectedUser.joinDate)}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium">Login Terakhir:</p>
                    <p className="text-sm text-gray-700">{formatDateTime(selectedUser.lastLogin)}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="flex justify-between sm:justify-between">
            {selectedUser && (
              <div className="flex gap-2">
                {selectedUser.status === "active" && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => handleDeactivateUser(selectedUser.id)}
                    disabled={isProcessing}
                  >
                    <UserX className="h-4 w-4" />
                    <span>{isProcessing ? "Memproses..." : "Nonaktifkan"}</span>
                  </Button>
                )}
                {selectedUser.status !== "active" && (
                  <Button
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => handleActivateUser(selectedUser.id)}
                    disabled={isProcessing}
                  >
                    <UserCheck className="h-4 w-4" />
                    <span>{isProcessing ? "Memproses..." : "Aktifkan"}</span>
                  </Button>
                )}
              </div>
            )}
            <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
