'use client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Link, router } from '@inertiajs/react';
import { Download, FileText, Loader2, Plus, SheetIcon, Upload } from 'lucide-react';
import { DragEvent, useState } from 'react';
import * as XLSX from 'xlsx';

type ImportPreviewRow = {
    id: string;
    name: string;
    quantity: number;
    unit: string;
    price: number;
};

export default function ImportPerolehanAtkDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
    const { toast } = useToast();
    const [importFile, setImportFile] = useState<File | null>(null);
    const [importError, setImportError] = useState<string | null>(null);
    const [isImportProcessing, setIsImportProcessing] = useState(false);
    const [previewRows, setPreviewRows] = useState<ImportPreviewRow[]>([]);
    const [isDragActive, setIsDragActive] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const handlePreviewData = async (file: File) => {
        setImportError(null);
        setImportFile(file);
        setIsImportProcessing(true);
        setPreviewRows([]);

        try {
            const data = await file.arrayBuffer();
            const workbook = XLSX.read(data);

            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];

            // convert ke JSON (array of array)
            const rows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });

            // hapus header (baris pertama)
            const [, ...body] = rows;

            const expectedHeader = ['No', 'Kode ATK', 'Nama ATK', 'Kategori', 'Satuan', 'Perolehan', 'Harga Satuan'];

            const header = rows[0];

            const isValidHeader =
                header && header.length >= expectedHeader.length && expectedHeader.every((val, i) => (header[i] || '').toString().trim() === val);

            if (!isValidHeader) {
                setImportError('Format header tidak sesuai template.');
                setIsImportProcessing(false);
                return;
            }

            const mapped: ImportPreviewRow[] = body
                .filter((row) => row.some((cell) => cell !== undefined && cell !== null && cell !== ''))
                .slice(0, 500) // limit preview
                .map((row, index) => ({
                    id: String(index),
                    name: row[2] || '', // Nama ATK
                    quantity: Number(row[5]) || 0, // Perolehan
                    unit: row[4] || '', // Satuan
                    price: Number(row[6]) || 0, // Harga Satuan
                }));

            setPreviewRows(mapped);
        } catch (error) {
            setImportError('Gagal membaca file Excel.');
        } finally {
            setIsImportProcessing(false);
        }
    };

    const handleFileSelect = (files: FileList | null) => {
        if (!files?.length) {
            return;
        }

        const file = files[0];
        const validExtension = /\.(xls|xlsx)$/i.test(file.name);

        if (!validExtension) {
            setImportError('Hanya file .xlsx atau .xls yang diperbolehkan.');
            setImportFile(null);
            setPreviewRows([]);
            return;
        }

        handlePreviewData(file);
    };

    const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
        setIsDragActive(false);
        handleFileSelect(event.dataTransfer.files);
    };

    const handleImportNow = () => {
        if (!importFile) {
            setImportError('File excel wajib diunggah sebelum import.');
            return;
        }

        setIsProcessing(true);

        const formData = new FormData();
        formData.append('file', importFile);

        router.post(route('stockopname.import'), formData, {
            forceFormData: true,
            onSuccess: () => {
                toast({
                    title: 'Berhasil',
                    description: 'Data berhasil diimport.',
                });

                onOpenChange(false);
                setImportFile(null);
                setPreviewRows([]);
            },
            onError: (e) => {
                toast({
                    title: 'Gagal',
                    description: Object.values(e)[0],
                    variant: 'destructive',
                });
            },
            onFinish: () => setIsProcessing(false),
        });
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(val) => {
                if (!val) {
                    setImportFile(null);
                    setPreviewRows([]);
                    setImportError(null);
                    setIsImportProcessing(false);
                }
                onOpenChange(val);
            }}
        >
            <DialogContent className="max-h-[calc(100vh-4rem)] gap-1.5 overflow-hidden bg-linear-to-r from-white to-blue-50 p-0 lg:min-w-4xl">
                <div className="max-h-[90vh] overflow-y-auto p-6">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-xl">
                            <SheetIcon className="h-5 w-5 text-emerald-600" />
                            Import Perolehan
                        </DialogTitle>
                        <DialogDescription>Import perolehan dari Excel dan lihat preview sebelum menyimpan.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-6 py-4">
                        <section className="rounded-[1.25rem] border border-emerald-100 bg-emerald-50/60 p-4 shadow-sm">
                            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <h3 className="text-base font-semibold text-emerald-900">Upload File Excel</h3>
                                    <p className="text-sm text-muted-foreground">Seret file ke area di bawah atau pilih file .xlsx / .xls.</p>
                                </div>
                                <Link href={route('daftaratk.downloadtemplate')}>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="gap-2 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-900"
                                        disabled={isProcessing}
                                        onClick={() => setIsProcessing(false)}
                                    >
                                        <Download className="h-4 w-4" />
                                        {isProcessing ? 'Mempersiapkan...' : 'Download Template'}
                                    </Button>
                                </Link>
                            </div>

                            <label
                                htmlFor="import-atk-file"
                                onDragOver={(event) => {
                                    event.preventDefault();
                                    setIsDragActive(true);
                                }}
                                onDragLeave={() => setIsDragActive(false)}
                                onDrop={handleDrop}
                                className={cn(
                                    'group flex min-h-[180px] flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed p-6 text-center transition duration-200',
                                    isDragActive ? 'border-emerald-400 bg-emerald-100/80' : 'border-emerald-200 bg-white hover:border-emerald-300',
                                )}
                            >
                                <Upload className="h-10 w-10 text-emerald-600" />
                                <div className="space-y-1">
                                    <p className="text-sm font-semibold text-emerald-900">Seret file di sini</p>
                                    <p className="text-sm text-muted-foreground">atau klik untuk memilih file</p>
                                </div>
                                <p className="text-xs text-muted-foreground">Hanya .xlsx dan .xls yang diterima.</p>

                                <span className="mt-2 rounded-full bg-emerald-100 px-3 py-1 text-xs text-emerald-800 shadow-sm">
                                    {importFile ? importFile.name : 'Tidak ada file yang dipilih'}
                                </span>
                                <input
                                    id="import-atk-file"
                                    type="file"
                                    accept=".xlsx,.xls"
                                    className="hidden"
                                    onChange={(event) => handleFileSelect(event.target.files)}
                                />
                            </label>

                            {importError && <p className="mt-2 text-sm text-red-600">{importError}</p>}
                            {isImportProcessing && (
                                <div className="mt-4 flex items-center gap-2 text-sm text-emerald-700">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Memproses file, harap tunggu...
                                </div>
                            )}
                        </section>

                        <section className="rounded-[1.25rem] border border-slate-200 bg-white p-4 shadow-sm">
                            <div className="mb-4 flex items-center justify-between gap-3">
                                <div>
                                    <h3 className="text-base font-semibold text-slate-900">Preview Data</h3>
                                    <p className="text-sm text-muted-foreground">Review contoh data sebelum mengimport.</p>
                                </div>
                                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                                    {importFile ? `${previewRows.length} baris` : 'Kosong'}
                                </span>
                            </div>

                            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50">
                                {isImportProcessing ? (
                                    <div className="flex min-h-[220px] flex-col items-center justify-center gap-3 px-4 py-12 text-slate-500">
                                        <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
                                        <p className="text-sm">Mempersiapkan preview data...</p>
                                    </div>
                                ) : previewRows.length === 0 ? (
                                    <div className="flex min-h-[220px] flex-col items-center justify-center gap-3 px-4 py-12 text-center text-slate-500">
                                        <FileText className="h-8 w-8" />
                                        <div>
                                            <p className="text-sm font-semibold text-slate-900">Belum ada file</p>
                                            <p className="text-sm text-slate-500">Unggah file Excel untuk melihat preview perolehan.</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="max-h-80 overflow-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead className="py-2 text-sm">Nama Barang</TableHead>
                                                    <TableHead className="py-2 text-sm">Jumlah</TableHead>
                                                    <TableHead className="py-2 text-sm">Satuan</TableHead>
                                                    <TableHead className="py-2 text-sm">Harga</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {previewRows.map((row) => (
                                                    <TableRow key={row.id} className="odd:bg-slate-50">
                                                        <TableCell className="py-2 text-xs">{row.name}</TableCell>
                                                        <TableCell className="py-2 text-xs">{row.quantity}</TableCell>
                                                        <TableCell className="py-2 text-xs">{row.unit}</TableCell>
                                                        <TableCell className="py-2 text-xs">Rp {row.price.toLocaleString('id-ID')}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>
                    <DialogFooter className="gap-2">
                        <Button variant="outline" onClick={() => onOpenChange(false)}>
                            Batal
                        </Button>
                        <Button
                            onClick={handleImportNow}
                            className="bg-linear-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                            disabled={!importFile || isImportProcessing || isProcessing}
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            {isProcessing ? 'Mengimpor...' : 'Import Sekarang'}
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
}
