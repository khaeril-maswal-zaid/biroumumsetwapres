'use client';

import { BottomNavigation } from '@/components/biroumum/bottom-navigation';
import { DesktopNavigation } from '@/components/biroumum/desktop-navigation';
import { PageHeader } from '@/components/biroumum/page-header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building, Mail, MapPin, Phone, User } from 'lucide-react';

export default function Profile() {
    return (
        <div className="min-h-screen bg-gray-50">
            <DesktopNavigation />

            <div className="pb-20 md:pb-0">
                <div className="space-y-6 p-4">
                    <PageHeader title="Profil Pengguna" backUrl="/" />

                    {/* Profile Info Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <User className="h-5 w-5" />
                                <span>Informasi Profil</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex flex-col items-center space-y-4">
                                <Avatar className="h-24 w-24">
                                    <AvatarImage src="/placeholder.svg?height=96&width=96" alt="Dani Martinez" />
                                    <AvatarFallback className="text-2xl">DM</AvatarFallback>
                                </Avatar>
                                <div className="text-center">
                                    <h2 className="text-2xl font-bold">Dani Martinez</h2>
                                    <p className="text-gray-600">Staff Biro Umum</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    <Mail className="h-5 w-5 text-gray-500" />
                                    <div>
                                        <Label className="text-sm text-gray-500">Email</Label>
                                        <p className="font-medium">dani.martinez@company.com</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <Phone className="h-5 w-5 text-gray-500" />
                                    <div>
                                        <Label className="text-sm text-gray-500">Telepon</Label>
                                        <p className="font-medium">+62 812-3456-7890</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <Building className="h-5 w-5 text-gray-500" />
                                    <div>
                                        <Label className="text-sm text-gray-500">Divisi</Label>
                                        <p className="font-medium">Biro Umum</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <MapPin className="h-5 w-5 text-gray-500" />
                                    <div>
                                        <Label className="text-sm text-gray-500">Lokasi</Label>
                                        <p className="font-medium">Jakarta, Indonesia</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Edit Profile Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Edit Profil</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="name">Nama Lengkap</Label>
                                <Input id="name" defaultValue="Dani Martinez" />
                            </div>

                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" defaultValue="dani.martinez@company.com" />
                            </div>

                            <div>
                                <Label htmlFor="phone">Nomor Telepon</Label>
                                <Input id="phone" defaultValue="+62 812-3456-7890" />
                            </div>

                            <div>
                                <Label htmlFor="division">Divisi</Label>
                                <Input id="division" defaultValue="Biro Umum" />
                            </div>

                            <Button className="w-full">Simpan Perubahan</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <BottomNavigation />
        </div>
    );
}
