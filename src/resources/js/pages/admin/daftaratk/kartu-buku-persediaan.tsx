'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, FileDown } from 'lucide-react';

const formatTanggalIna = (tanggal: string) => {
    return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(new Date(tanggal));
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manajemen ATK',
        href: '/dashboard',
    },
];

const MONTHS_ID = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

function formatBulanTahun({ bulan, tahun }: any) {
    if (!tahun) return '';

    if (!bulan) {
        return tahun;
    }

    const monthIndex = Number(bulan) - 1;

    return `${MONTHS_ID[monthIndex]} ${tahun}`;
}

function formatCurrency(value: number | string) {
    const num = Number(value) || 0;
    return num.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });
}

export default function rincianBukuPersediaan({ filters, atk, dataStok = [] }: any) {
    const periodeBulan = formatBulanTahun(filters || {});
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kartu Buku Persediaan" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl bg-linear-to-br from-white to-blue-50 p-6">
                <Link href={route('stockopname.buku_persediaan')}>
                    <Button variant="ghost" className="mb-1 flex items-center space-x-2">
                        <ArrowLeft className="h-4 w-4" />
                        <span>Kembali</span>
                    </Button>
                </Link>

                <Card className="max-w-full">
                    <CardHeader>
                        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                            <div className="flex flex-col">
                                <div>
                                    <p className="text-sm text-muted-foreground">Kode Barang</p>
                                    <p className="mb-2.5 text-lg font-semibold">{atk?.kode_atk ?? '-'}</p>
                                    <p className="mt-1 text-sm text-muted-foreground">Nama Barang</p>
                                    <p className="text-lg font-semibold">{atk?.name ?? '-'}</p>
                                </div>
                            </div>
                            <div className="items-end gap-2 text-right">
                                <div className="mb-4">
                                    <h1 className="text-2xl font-extrabold tracking-tight">RINCIAN BUKU PERSEDIAAN</h1>
                                    <p className="text-sm text-muted-foreground">
                                        Periode: <span className="font-medium">{periodeBulan || '-'}</span>
                                    </p>
                                </div>

                                <Button
                                    className="inline-flex items-center gap-2 bg-red-600 text-white hover:bg-red-700"
                                    onClick={() => {
                                        window.open(route('stockopname.rincian_buku_persediaan_pdf', atk?.kode_atk));
                                    }}
                                >
                                    <FileDown className="h-4 w-4" />
                                    Unduh PDF
                                </Button>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <div className="overflow-hidden rounded-lg border">
                            <Table>
                                <TableHeader className="bg-muted">
                                    <TableRow>
                                        <TableHead rowSpan={2} className="w-12 border-r border-muted/50 last:border-r-0">
                                            No
                                        </TableHead>
                                        <TableHead rowSpan={2} className="border-r border-muted/50 last:border-r-0">
                                            Tanggal
                                        </TableHead>
                                        <TableHead rowSpan={2} className="border-r border-muted/50 last:border-r-0">
                                            Diterima/ Diserahkan
                                        </TableHead>
                                        <TableHead rowSpan={2} className="border-r border-muted/50 text-center last:border-r-0">
                                            Masuk
                                        </TableHead>
                                        <TableHead rowSpan={2} className="border-r border-muted/50 text-center last:border-r-0">
                                            Harga Perolehan
                                        </TableHead>
                                        <TableHead rowSpan={2} className="text-center">
                                            Keluar
                                        </TableHead>
                                        <TableHead colSpan={2} className="text-center">
                                            Saldo
                                        </TableHead>
                                    </TableRow>
                                    <TableRow>
                                        {/* <TableHead className="w-32 border-r border-muted/50 text-center last:border-r-0">Jumlah</TableHead> */}
                                        <TableHead className="w-32 text-center">Jumlah</TableHead>
                                        <TableHead className="w-32 text-center">Nilai</TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {dataStok.length > 0 ? (
                                        dataStok.map((opname: any, idx: number) => (
                                            <TableRow key={idx} className="transition-colors hover:bg-muted/50">
                                                <TableCell className="py-2 text-xs">{idx + 1}</TableCell>
                                                <TableCell className="py-2 text-xs">{formatTanggalIna(opname.tanggal)}</TableCell>
                                                <TableCell className="py-2 text-xs">{opname.uraian}</TableCell>
                                                <TableCell className="py-2 text-center text-xs">
                                                    {opname.type == 'Perolehan' ? opname.quantity : '-'}
                                                </TableCell>
                                                <TableCell className="py-2 text-center text-xs">
                                                    {opname.quantity > 0 ? formatCurrency(opname.harga) : '-'}
                                                </TableCell>
                                                <TableCell className="py-2 text-center text-xs">
                                                    {opname.type == 'Pemakaian' ? opname.quantity : '-'}
                                                </TableCell>
                                                <TableCell className="py-2 text-center text-xs">{opname.saldo}</TableCell>
                                                <TableCell className="py-2 text-center text-xs">
                                                    {opname.saldo > 0 ? formatCurrency(opname.saldo * opname.harga) : '-'}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={12} className="py-8 text-center text-muted-foreground">
                                                Tidak ada data
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
