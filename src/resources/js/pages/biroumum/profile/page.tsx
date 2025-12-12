'use client';

import { BottomNavigation } from '@/components/biroumum/bottom-navigation';
import { PageHeader } from '@/components/biroumum/page-header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { type SharedData } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { Building, LogOut, Mail, User } from 'lucide-react';

export default function Profile() {
    const { auth } = usePage<SharedData>().props;

    const handleLogout = () => {
        router.post(
            route('logout'),
            {},
            {
                onSuccess: () => {
                    //
                },
            },
        );
    };

    return (
        <>
            <Head title={auth?.user.name} />
            <div className="mx-auto min-h-screen w-full max-w-md bg-gray-50">
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
                                        <AvatarImage src="/placeholder.svg?height=96&width=96" alt={auth?.user.name} />
                                        <AvatarFallback className="text-2xl">DM</AvatarFallback>
                                    </Avatar>
                                    <div className="text-center">
                                        <h2 className="text-2xl font-bold">{auth?.user.name}</h2>
                                        <p className="text-gray-600">{auth?.user?.role}</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center space-x-3">
                                        <Mail className="h-5 w-5 text-gray-500" />
                                        <div>
                                            <Label className="text-sm text-gray-500">Email</Label>
                                            <p className="font-medium">{auth?.user?.email}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <Building className="h-5 w-5 text-gray-500" />
                                        <div>
                                            <Label className="text-sm text-gray-500">Unit Kerja</Label>
                                            <p className="font-medium">{auth?.user?.biro?.nama_biro}</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-center">
                                <Button
                                    variant="outline"
                                    onClick={handleLogout}
                                    className="flex items-center space-x-2 border-red-200 bg-red-50 text-red-600 hover:bg-red-300"
                                >
                                    <LogOut className="h-4 w-4" />
                                    <span>Logout</span>
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </div>

                <BottomNavigation />
            </div>
        </>
    );
}
