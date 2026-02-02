'use client';

import { BottomNavigation } from '@/components/biroumum/bottom-navigation';
import { PageHeader } from '@/components/biroumum/page-header';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { type SharedData } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { AlertCircleIcon, Calendar, CheckCircle2, Clock, FileUp, MapPin, Wrench } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';

interface FormData {
    namaPemesan: string;
    unitKerja: string;
    tanggalBerangkat: string;
    jamBerangkat: string;
    dari: string;
    ke: string;
    jenisPerjalanan: string;
    deskripsi: string;
    suratTugas: File | null;
    status: 'pending' | 'approved' | 'rejected';
}

export default function VehicleRequest() {
    const { auth } = usePage<SharedData>().props;

    const [showSuccess, setShowSuccess] = useState(false);

    // const handleSubmit = (e: React.FormEvent) => {
    //     e.preventDefault();
    //     setShowSuccess(true);
    //     setTimeout(() => {
    //         setShowSuccess(false);
    //     }, 3000);
    // };

    //-----------------------------------------------------

    const [formData, setFormData] = useState<FormData>({
        namaPemesan: 'John Doe', // Simulasi: dari akun yang login
        unitKerja: 'Direktorat IT',
        tanggalBerangkat: '',
        jamBerangkat: '',
        dari: '',
        ke: '',
        jenisPerjalanan: 'sekali-jalan',
        deskripsi: '',
        suratTugas: null,
        status: 'pending',
    });

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [errorServer, setErrorServer] = useState<null | Record<string, string[]>>(null);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const handleConfirm = () => {
        setShowSuccessDialog(false);
        router.visit(route('history'));
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.tanggalBerangkat) newErrors.tanggalBerangkat = 'Tanggal berangkat wajib diisi';
        if (!formData.jamBerangkat) newErrors.jamBerangkat = 'Jam berangkat wajib diisi';
        if (!formData.dari.trim()) newErrors.dari = 'Lokasi asal wajib diisi';
        if (!formData.ke.trim()) newErrors.ke = 'Lokasi tujuan wajib diisi';
        if (!formData.deskripsi.trim()) newErrors.deskripsi = 'Deskripsi wajib diisi';
        if (!formData.suratTugas) newErrors.suratTugas = 'Surat tugas wajib diunggah';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const validTypes = ['application/pdf', 'image/jpeg', 'image/png'];
            if (validTypes.includes(file.type)) {
                setFormData((prev) => ({ ...prev, suratTugas: file }));
                if (errors.suratTugas) {
                    setErrors((prev) => ({ ...prev, suratTugas: '' }));
                }
            } else {
                setErrors((prev) => ({ ...prev, suratTugas: 'Format file harus PDF atau JPG/PNG' }));
            }
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (validateForm()) {
            // Simulasi submit - ubah status menjadi approved
            setFormData((prev) => ({ ...prev, status: Math.random() > 0.5 ? 'approved' : 'pending' }));
            setIsSubmitted(true);
            setTimeout(() => {
                setIsSubmitted(false);
            }, 5000);
        }
    };

    return (
        <>
            <Head title="Laporan Kerusakan Gedung" />
            <div className="mx-auto min-h-screen w-full max-w-md bg-gray-50">
                <div className="pb-20">
                    <div className="space-y-6 p-4">
                        <PageHeader title="Laporan Kerusakan Gedung" backUrl="/" />

                        {errorServer && (
                            <Alert variant="destructive" className="mb-4 bg-white text-red-700">
                                <AlertCircleIcon />
                                <AlertTitle>Gagal kirim laporan !</AlertTitle>
                                <AlertDescription className="text-red-700">
                                    <ul>
                                        {Object.values(errorServer)
                                            .flat()
                                            .map((item, index) => (
                                                <li key={index}>{item}</li>
                                            ))}
                                    </ul>
                                </AlertDescription>
                            </Alert>
                        )}

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Wrench className="h-5 w-5" />
                                    <span>Form Laporan Kerusakan</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Section 1: Informasi Pemohon */}
                                    <div className="space-y-4">
                                        <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                                                1
                                            </span>
                                            Informasi Pemohon
                                        </h3>

                                        <div className="space-y-4">
                                            <div>
                                                <Label htmlFor="namaPemesan" className="text-sm font-medium text-slate-700">
                                                    Nama Pemesan
                                                </Label>
                                                <Input
                                                    id="namaPemesan"
                                                    name="namaPemesan"
                                                    value={formData.namaPemesan}
                                                    disabled
                                                    className="mt-1 cursor-not-allowed bg-slate-50 text-slate-600"
                                                    placeholder="Dari akun yang login"
                                                />
                                                {/* <p className="text-xs text-slate-500">Diambil dari akun pengguna yang login</p> */}
                                            </div>

                                            <div>
                                                <Label htmlFor="unitKerja" className="text-sm font-medium text-slate-700">
                                                    Unit Kerja
                                                </Label>
                                                <Input
                                                    id="unitKerja"
                                                    name="unitKerja"
                                                    value={formData.unitKerja}
                                                    disabled
                                                    className="mt-1 cursor-not-allowed bg-slate-50 text-slate-600"
                                                    placeholder="Dari data pegawai"
                                                />
                                                {/* <p className="text-xs text-slate-500">Dari data pegawai terkait</p> */}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Divider */}
                                    <div className="border-t border-slate-200"></div>

                                    {/* Section 2: Informasi Perjalanan */}
                                    <div className="space-y-4">
                                        <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                                                2
                                            </span>
                                            Informasi Perjalanan
                                        </h3>

                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label
                                                    htmlFor="tanggalBerangkat"
                                                    className="flex items-center gap-2 text-sm font-medium text-slate-700"
                                                >
                                                    <Calendar className="h-4 w-4" />
                                                    Tanggal Berangkat
                                                </Label>
                                                <Input
                                                    id="tanggalBerangkat"
                                                    name="tanggalBerangkat"
                                                    type="date"
                                                    value={formData.tanggalBerangkat}
                                                    onChange={handleInputChange}
                                                    className={errors.tanggalBerangkat ? 'border-red-500' : ''}
                                                />
                                                {errors.tanggalBerangkat && <p className="text-xs text-red-600">{errors.tanggalBerangkat}</p>}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="jamBerangkat" className="flex items-center gap-2 text-sm font-medium text-slate-700">
                                                    <Clock className="h-4 w-4" />
                                                    Jam Berangkat
                                                </Label>
                                                <Input
                                                    id="jamBerangkat"
                                                    name="jamBerangkat"
                                                    type="time"
                                                    value={formData.jamBerangkat}
                                                    onChange={handleInputChange}
                                                    className={errors.jamBerangkat ? 'border-red-500' : ''}
                                                />
                                                {errors.jamBerangkat && <p className="text-xs text-red-600">{errors.jamBerangkat}</p>}
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="space-y-1">
                                                <Label htmlFor="dari" className="flex items-center gap-2 text-sm font-medium text-slate-700">
                                                    <MapPin className="h-4 w-4" />
                                                    Dari (Lokasi Asal)
                                                </Label>

                                                <Input
                                                    id="dari"
                                                    name="dari"
                                                    type=""
                                                    value={formData.dari}
                                                    onChange={handleInputChange}
                                                    className={errors.dari ? 'border-red-500' : ''}
                                                />
                                                {errors.dari && <p className="text-xs text-red-600">{errors.dari}</p>}
                                            </div>

                                            <div className="space-y-1">
                                                <Label htmlFor="ke" className="flex items-center gap-2 text-sm font-medium text-slate-700">
                                                    <MapPin className="h-4 w-4" />
                                                    Ke (Lokasi Tujuan)
                                                </Label>

                                                <Input
                                                    id="ke"
                                                    name="ke"
                                                    type=""
                                                    value={formData.ke}
                                                    onChange={handleInputChange}
                                                    className={errors.ke ? 'border-red-500' : ''}
                                                />

                                                {errors.ke && <p className="text-xs text-red-600">{errors.ke}</p>}
                                            </div>

                                            <div className="space-y-1">
                                                <Label htmlFor="ke" className="flex items-center gap-2 text-sm font-medium text-slate-700">
                                                    Jenis Perjalanan
                                                </Label>

                                                <Select
                                                    value={formData.jenisPerjalanan}
                                                    onValueChange={(value) => handleSelectChange('jenisPerjalanan', value)}
                                                >
                                                    <SelectTrigger id="jenisPerjalanan">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="sekali-jalan">Sekali Jalan</SelectItem>
                                                        <SelectItem value="pulang-pergi">Pulang Pergi</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Divider */}
                                    <div className="border-t border-slate-200"></div>

                                    {/* Section 3: Keterangan & Lampiran */}
                                    <div className="space-y-4">
                                        <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                                                3
                                            </span>
                                            Keterangan & Lampiran
                                        </h3>

                                        <div className="space-y-2">
                                            <Label htmlFor="deskripsi" className="text-sm font-medium text-slate-700">
                                                Deskripsi / Keterangan Kebutuhan
                                            </Label>
                                            <Textarea
                                                id="deskripsi"
                                                name="deskripsi"
                                                value={formData.deskripsi}
                                                onChange={handleInputChange}
                                                placeholder="Jelaskan alasan perjalanan atau konteks kebutuhan kendaraan..."
                                                className={`mt-1 min-h-[100px] resize-none ${errors.deskripsi ? 'border-red-500' : ''}`}
                                            />
                                            {errors.deskripsi && <p className="text-xs text-red-600">{errors.deskripsi}</p>}
                                            <p className="text-xs text-slate-500">Minimal 10 karakter diperlukan</p>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="suratTugas" className="flex items-center gap-2 text-sm font-medium text-slate-700">
                                                <FileUp className="h-4 w-4" />
                                                Unggah Surat Tugas
                                            </Label>
                                            <div className="relative">
                                                <input
                                                    id="suratTugas"
                                                    type="file"
                                                    accept=".pdf,.jpg,.jpeg,.png"
                                                    onChange={handleFileChange}
                                                    className="hidden"
                                                />
                                                <label
                                                    htmlFor="suratTugas"
                                                    className={`block cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
                                                        errors.suratTugas
                                                            ? 'border-red-300 bg-red-50'
                                                            : 'border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-blue-50'
                                                    }`}
                                                >
                                                    <div className="flex flex-col items-center gap-2">
                                                        <FileUp className={`h-6 w-6 ${errors.suratTugas ? 'text-red-500' : 'text-slate-400'}`} />
                                                        <div>
                                                            <p className={`font-medium ${errors.suratTugas ? 'text-red-700' : 'text-slate-700'}`}>
                                                                {formData.suratTugas ? formData.suratTugas.name : 'Klik atau drag file'}
                                                            </p>
                                                            <p className="text-xs text-slate-500">PDF, JPG, atau PNG (maks. 5MB)</p>
                                                        </div>
                                                    </div>
                                                </label>
                                            </div>
                                            {errors.suratTugas && <p className="text-xs text-red-600">{errors.suratTugas}</p>}
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row">
                                        <Button
                                            type="reset"
                                            variant="outline"
                                            className="flex-1 bg-transparent"
                                            onClick={() => {
                                                setFormData({
                                                    namaPemesan: 'John Doe',
                                                    unitKerja: 'Direktorat IT',
                                                    tanggalBerangkat: '',
                                                    jamBerangkat: '',
                                                    dari: '',
                                                    ke: '',
                                                    jenisPerjalanan: 'sekali-jalan',
                                                    deskripsi: '',
                                                    suratTugas: null,
                                                    status: 'pending',
                                                });
                                                setErrors({});
                                            }}
                                        >
                                            Reset
                                        </Button>
                                        <Button
                                            type="submit"
                                            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                                        >
                                            Kirim Permintaan
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
                <BottomNavigation />

                <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader className="text-center">
                            <div className="flex flex-col items-center justify-center">
                                <CheckCircle2 className="mb-3.5 h-10 w-10 text-green-600" />
                                <DialogTitle className="text-xl font-semibold text-green-700">Laporan kerusakan berhasil dikirim!</DialogTitle>
                            </div>
                        </DialogHeader>
                        <div className="text-center text-sm text-muted-foreground">Klik tombol "Ok" untuk melihat aktivitas dan detail laporan.</div>
                        <DialogFooter className="mt-4 flex justify-center">
                            <Button onClick={handleConfirm} className="w-full sm:w-auto">
                                OK
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
}
