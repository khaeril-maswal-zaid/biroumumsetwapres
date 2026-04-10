('use client');

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Calendar, Hand, Pen, Phone } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function SupplieDetailsPage({ permintaanAtk, pengambilanAtk, itemsSummary, kodePermintaan }: any) {
    const { toast } = useToast();

    const [openModal, setOpenModal] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const [form, setForm] = useState({
        nama_pengambil: '',
        no_hp: '',
        tanggal_ambil: new Date().toISOString().slice(0, 10),
        keterangan: '',
        details: [],
    });

    const updateField = (key: string, value: any) => setForm((s) => ({ ...s, [key]: value }));

    const handleSubmitCatatan = async () => {
        setIsProcessing(true);
        const payload = {
            nama_pengambil: form.nama_pengambil,
            no_hp: form.no_hp,
            tanggal_ambil: form.tanggal_ambil,
            keterangan: form.keterangan,
            details: itemsSummary
                .filter((item: any) => item.sisa > 0)
                .map((item: any) => ({
                    item_id: item.id,
                    qty_diambil: item.sisa,
                })),
        };

        // send to backend; use patch to existing route or adjust to your API
        router.post(route('pengambilan.store', permintaanAtk.kode_pelaporan), payload, {
            preserveScroll: true,
            onSuccess: () => {
                toast({
                    title: 'Berhasil menambahkan catatan',
                    description: 'Catatan serah terima berhasil ditambahkan.',
                });
                setIsProcessing(false);
                setOpenModal(false);
            },
            onError: (errors: any) => {
                toast({
                    title: 'Validasi gagal',
                    variant: 'destructive',
                    description: Object.values(errors)[0],
                });
                setIsProcessing(false);
            },
        });
    };

    const hasRemaining = itemsSummary.some((item: any) => item.sisa > 0);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl bg-linear-to-br from-white to-blue-100 p-4">
                <Link href={route('permintaanatk.show', kodePermintaan)}>
                    <Button
                        variant="ghost"
                        className="mb-1 flex items-center space-x-2 border bg-accent text-accent-foreground hover:border-gray-300 hover:bg-gray-200"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span>Kembali</span>
                    </Button>
                </Link>

                <Card className="max-w-4xl">
                    <CardHeader>
                        <CardTitle className="mb-2 flex items-center gap-1">
                            <Hand className="h-5 w-5" />
                            Catatan Serah Terima ATK
                        </CardTitle>
                        <CardDescription>Catatan serah terima item ATK yang diberikan kepada user.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            <div className="flex justify-end gap-2">
                                <Button
                                    variant="outline"
                                    className="flex items-center gap-2 border-blue-200 bg-transparent text-blue-700 hover:bg-blue-50"
                                    onClick={() => {
                                        setOpenModal(true);
                                        setForm({
                                            nama_pengambil: '',
                                            no_hp: '',
                                            tanggal_ambil: new Date().toISOString().slice(0, 10),
                                            keterangan: '',
                                            details: [],
                                        });
                                    }}
                                >
                                    <Pen className="h-4 w-4" />
                                    Buat Serah Terima
                                </Button>
                            </div>

                            {pengambilanAtk.length === 0 ? (
                                <div className="text-center text-sm text-muted-foreground">Belum ada histori pengambilan.</div>
                            ) : (
                                <div className="grid gap-4 md:grid-cols-2">
                                    {pengambilanAtk.map((p: any) => (
                                        <Card key={p.id} className="gap-0 p-4">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-tr from-blue-600 to-indigo-600 font-semibold text-white">
                                                        {String(p.nama_pengambil || '-')
                                                            .split(' ')
                                                            .map((n: any) => n[0])
                                                            .slice(0, 2)
                                                            .join('')}
                                                    </div>

                                                    <div>
                                                        <p className="text-sm font-medium">{p.nama_pengambil}</p>
                                                        <p className="flex items-center gap-2 text-xs text-muted-foreground">
                                                            <Phone className="h-3 w-3" /> {p.no_hp ?? '-'}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="text-right">
                                                    <p className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <Calendar className="h-4 w-4" /> {p.tanggal_ambil}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">{p.kode ?? ''}</p>
                                                </div>
                                            </div>

                                            {/* <div className="mt-3 text-sm text-muted-foreground">{p.keterangan ?? '-'}</div> */}

                                            <div className="mt-4 divide-y divide-muted-foreground/20">
                                                {p.details.map((d: any) => (
                                                    <div key={d.id} className="flex items-center justify-between py-3 text-sm">
                                                        <div className="min-w-0">
                                                            <p className="truncate font-medium">{d.item_name}</p>
                                                            <p className="text-xs text-muted-foreground">Satuan: {d.satuan ?? '-'}</p>
                                                        </div>

                                                        <div className="flex items-center gap-4">
                                                            <div className="text-right">
                                                                <div className="font-medium">{d.qty_diambil}</div>
                                                                <div className="text-xs text-muted-foreground">Diambil</div>
                                                            </div>

                                                            {/* <div className="text-right">
                                                                <div className="text-sm font-medium text-emerald-600">
                                                                    {d.sisa ?? d.remaining ?? '-'}
                                                                </div>
                                                                <div className="text-xs text-muted-foreground">Sisa</div>
                                                            </div> */}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Dialog open={openModal} onOpenChange={setOpenModal}>
                    <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">Catat Serah Terima Item</DialogTitle>
                        </DialogHeader>

                        {!hasRemaining && <p className="text-center text-sm text-muted-foreground">Semua item sudah diambil.</p>}

                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <div>
                                    <Label className="mb-1">Nama Pengambil</Label>
                                    <Input
                                        value={form.nama_pengambil}
                                        onChange={(e) => updateField('nama_pengambil', e.target.value)}
                                        placeholder="Nama pengambil"
                                    />
                                </div>

                                <div>
                                    <Label className="mb-1">No. HP</Label>
                                    <Input value={form.no_hp} onChange={(e) => updateField('no_hp', e.target.value)} placeholder="0812..." />
                                </div>

                                <div>
                                    <Label className="mb-1">Tanggal Ambil</Label>
                                    <Input type="date" value={form.tanggal_ambil} onChange={(e) => updateField('tanggal_ambil', e.target.value)} />
                                </div>

                                <div>
                                    <Label className="mb-1">Keterangan</Label>
                                    <Textarea
                                        value={form.keterangan}
                                        onChange={(e) => updateField('keterangan', e.target.value)}
                                        placeholder="Catatan atau tujuan serah terima"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                {itemsSummary
                                    .filter((item: any) => item.sisa > 0)
                                    .map((item: any) => (
                                        <div key={item.id} className="space-y-2 rounded-md border p-3">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <p className="font-medium">{item.name}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        Approved: {item.approved} {item.satuan}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        Sudah diambil: {item.sudah_diambil} {item.satuan}
                                                    </p>
                                                    <p className="text-sm font-medium text-green-600">Sisa: {item.sisa}</p>

                                                    {item.status === 'replacement' && (
                                                        <p className="text-xs text-amber-600">Pengganti dari: {item.origin_id}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>

                        <DialogFooter className="flex gap-2">
                            <Button variant="outline" onClick={() => setOpenModal(false)}>
                                Batal
                            </Button>
                            <Button onClick={() => handleSubmitCatatan()} disabled={isProcessing || !hasRemaining}>
                                {isProcessing ? 'Menyimpan...' : 'Simpan & Serah Terima'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
