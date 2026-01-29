'use client';

import { BottomNavigation } from '@/components/biroumum/bottom-navigation';
import { PageHeader } from '@/components/biroumum/page-header';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import type { SharedData } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Head, router, usePage } from '@inertiajs/react';
import { AlertCircleIcon, Check, CheckCircle2, ChevronsUpDown, Package, PenTool } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker?url';

// Set worker source
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import * as z from 'zod';

// Skema validasi
const FormSchema = z.object({
    items: z
        .array(
            z.object({
                id: z.string().min(1, 'Nama barang wajib diisi'),
                name: z.string().min(1),
                requested: z.coerce.number().min(1, 'Jumlah minimal 1'),
                approved: z.coerce.number(),
                satuan: z.string().min(1, 'Satuan wajib dipilih'),
                status: z.enum(['custom', 'normal']),
            }),
        )
        .min(1, 'Minimal satu barang harus dipilih'),
    justification: z.string().min(1, 'Keterangan tidak boleh kosong'),
    contact: z.string().min(1, 'Narahubung wajib diisi'),
    // memo: z
    //     .any()
    //     .refine((file) => file instanceof File, 'File memo wajib diupload')
    //     .refine((file) => file?.type === 'application/pdf', 'File harus berformat PDF')
    //     .refine((file) => file === null || file instanceof File, 'File memo wajib diupload')
    //     .nullable(),
});

type FormData = z.infer<typeof FormSchema>;

const LAIN_LAIN_OPTION = { id: 'lain-lain', name: '', satuan: '' };

const generateUniqueLainLainId = () => `lain-lain-${Math.random().toString(36).substr(2, 7)}`;

export default function SuppliesRequest({ availableATK }: any) {
    const { auth } = usePage<SharedData>().props;
    const {
        register,
        handleSubmit,
        control,
        watch,
        reset,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            items: [{ id: '', name: '', requested: 1, approved: 0, satuan: '', status: 'normal' }],
            justification: '',
            // urgency: '',
            contact: '',
            // memo: null,
        },
    });

    const [errorServer, setErrorServer] = useState<null | Record<string, string[]>>(null);

    // const [selectedFile, setSelectedFile] = useState<File | null>(null);
    // const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
    // const [isGeneratingThumbnail, setIsGeneratingThumbnail] = useState(false);
    // const fileInputRef = useRef<HTMLInputElement>(null);

    // const generatePDFThumbnail = async (file: File) => {
    //     setIsGeneratingThumbnail(true);
    //     try {
    //         const arrayBuffer = await file.arrayBuffer();
    //         const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    //         const page = await pdf.getPage(1);

    //         const viewport = page.getViewport({ scale: 0.5 });
    //         const canvas = document.createElement('canvas');
    //         const context = canvas.getContext('2d');

    //         canvas.height = viewport.height;
    //         canvas.width = viewport.width;

    //         await page.render({
    //             canvasContext: context!,
    //             viewport: viewport,
    //             canvas,
    //         }).promise;

    //         const imageUrl = canvas.toDataURL('image/png');
    //         setThumbnailUrl(imageUrl);
    //     } catch (error) {
    //         console.error('Error generating PDF thumbnail:', error);
    //         setThumbnailUrl(null);
    //     } finally {
    //         setIsGeneratingThumbnail(false);
    //     }
    // };

    // const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    //     const file = event.target.files?.[0];
    //     if (file) {
    //         if (file.type !== 'application/pdf') {
    //             alert('Hanya file PDF yang diperbolehkan');
    //             return;
    //         }

    //         setSelectedFile(file);
    //         setValue('memo', file, { shouldValidate: true });
    //         await generatePDFThumbnail(file);
    //     }
    // };

    // const removeFile = () => {
    //     setSelectedFile(null);
    //     setThumbnailUrl(null);
    //     setValue('memo', null);
    //     if (fileInputRef.current) {
    //         fileInputRef.current.value = '';
    //     }
    // };

    const { fields, append, remove, update } = useFieldArray({ control, name: 'items' });
    const items = watch('items');
    // // const selectedUrgency = watch('urgency');

    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [openComboboxes, setOpenComboboxes] = useState<Record<number, boolean>>({});

    const getAvailableOptions = (index: number) => {
        const selectedIds = items.map((it, i) => (i !== index ? it.id : null)).filter(Boolean);
        return availableATK.filter((atk: any) => !selectedIds.includes(String(atk.id)));
    };

    const onSubmit = (data: FormData) => {
        const formData = new FormData();

        formData.append('justification', data.justification);
        formData.append('contact', data.contact);

        // if (data.memo) {
        //     formData.append('memo', data.memo);
        // }

        data.items.forEach((item, index) => {
            formData.append(`items[${index}][id]`, item.id);
            formData.append(`items[${index}][name]`, item.name);
            formData.append(`items[${index}][requested]`, String(item.requested));
            formData.append(`items[${index}][approved]`, String(item.approved));
            formData.append(`items[${index}][satuan]`, item.satuan);
            formData.append(`items[${index}][status]`, item.status);
        });

        router.post(route('permintaanatk.store'), formData, {
            forceFormData: true,
            onError: (e) => {
                setErrorServer(e);
            },
            onSuccess: () => {
                setShowSuccessDialog(true);
                reset();
                // setSelectedFile(null);
                // setThumbnailUrl(null);
                setErrorServer(null);
            },
        });
    };

    const isLainLain = (item?: any) => item?.status === 'custom';

    return (
        <>
            <Head title="Permintaan Alat Kantor" />
            <div className="mx-auto min-h-screen w-full max-w-md bg-gray-50 pb-24">
                <div className="space-y-6 p-4 pb-20 md:pb-0">
                    <PageHeader title="Permintaan Alat Tulis Kantor" backUrl="/" />

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
                                <PenTool className="h-5 w-5" />
                                <span>Form Permintaan ATK</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                {/* Nama & Unit Kerja */}
                                <div>
                                    <Label>Nama Pengaju</Label>
                                    <Input readOnly value={auth.user.name} className="mt-1 cursor-not-allowed bg-gray-100 text-gray-500" />
                                </div>

                                <div>
                                    <Label>Unit Kerja</Label>
                                    <Input
                                        readOnly
                                        value={auth?.user?.biro?.nama_biro ?? '-'}
                                        className="mt-1 cursor-not-allowed bg-gray-100 text-gray-500"
                                    />
                                </div>

                                {/* Daftar Barang */}
                                <div>
                                    <Label>Daftar Barang</Label>
                                    {fields.map((field, index) => {
                                        const sel = items[index];
                                        const opts = getAvailableOptions(index);
                                        const isCustomItem = isLainLain(sel);

                                        return (
                                            <div key={field.id} className="mt-2 space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="min-w-0 flex-1">
                                                        <Popover
                                                            open={openComboboxes[index]}
                                                            onOpenChange={(o) => setOpenComboboxes({ ...openComboboxes, [index]: o })}
                                                        >
                                                            <PopoverTrigger asChild>
                                                                <Button
                                                                    variant="outline"
                                                                    className={cn(
                                                                        'w-full justify-between overflow-hidden',
                                                                        sel?.id && 'border-primary/50 bg-primary/5',
                                                                        isCustomItem && 'border-amber-500/50 bg-amber-50',
                                                                    )}
                                                                >
                                                                    <span className="truncate text-left text-sm">
                                                                        {isCustomItem ? 'Lain-lain' : sel?.name || 'Pilih ATK...'}
                                                                    </span>
                                                                    <ChevronsUpDown className="ml-1 h-4 w-4 shrink-0 opacity-50" />
                                                                </Button>
                                                            </PopoverTrigger>
                                                            <PopoverContent
                                                                align="start"
                                                                className="w-[calc(100vw-3rem)] max-w-[380px] p-0"
                                                                sideOffset={4}
                                                            >
                                                                <Command>
                                                                    <CommandInput placeholder="Cari ATK..." className="text-sm" />
                                                                    <CommandList className="max-h-[200px]">
                                                                        <CommandEmpty>Tidak ada ATK ditemukan.</CommandEmpty>
                                                                        <CommandGroup heading="Opsi Lainnya">
                                                                            <CommandItem
                                                                                onSelect={() => {
                                                                                    update(index, {
                                                                                        id: generateUniqueLainLainId(),
                                                                                        name: LAIN_LAIN_OPTION.name,
                                                                                        satuan: '',
                                                                                        requested: field.requested || 1,
                                                                                        approved: 0,
                                                                                        status: 'custom',
                                                                                    });
                                                                                    setOpenComboboxes({ ...openComboboxes, [index]: false });
                                                                                }}
                                                                                className={cn(
                                                                                    'flex items-center gap-2 py-2',
                                                                                    isCustomItem && 'bg-amber-100',
                                                                                )}
                                                                            >
                                                                                <div
                                                                                    className={cn(
                                                                                        'flex h-5 w-5 items-center justify-center rounded-full',
                                                                                        isCustomItem
                                                                                            ? 'bg-amber-500 text-white'
                                                                                            : 'bg-amber-100 text-amber-600',
                                                                                    )}
                                                                                >
                                                                                    <Package className="h-3 w-3" />
                                                                                </div>
                                                                                <div className="flex min-w-0 flex-1 flex-col">
                                                                                    <span className="text-sm font-medium text-amber-700">
                                                                                        Lain-lain
                                                                                    </span>
                                                                                    <span className="text-xs text-amber-600/70">
                                                                                        Tulis nama barang manual
                                                                                    </span>
                                                                                </div>
                                                                                {isCustomItem && (
                                                                                    <Check className="h-4 w-4 shrink-0 text-amber-600" />
                                                                                )}
                                                                            </CommandItem>
                                                                        </CommandGroup>
                                                                        <CommandGroup heading="Daftar ATK">
                                                                            {opts.map((atk: any) => {
                                                                                const isCurrentlySelected = sel?.id === String(atk.id);

                                                                                return (
                                                                                    <CommandItem
                                                                                        key={atk.id}
                                                                                        onSelect={() => {
                                                                                            update(index, {
                                                                                                id: String(atk.id),
                                                                                                name: atk.name,
                                                                                                satuan: atk.satuan,
                                                                                                requested: field.requested || 1,
                                                                                                approved: 0,
                                                                                                status: 'normal',
                                                                                            });
                                                                                            setOpenComboboxes({ ...openComboboxes, [index]: false });
                                                                                        }}
                                                                                        className={cn(
                                                                                            'flex items-center gap-2 py-2',
                                                                                            isCurrentlySelected && 'bg-primary/10',
                                                                                        )}
                                                                                    >
                                                                                        <Check
                                                                                            className={cn(
                                                                                                'h-4 w-4 shrink-0',
                                                                                                isCurrentlySelected
                                                                                                    ? 'text-primary opacity-100'
                                                                                                    : 'opacity-0',
                                                                                            )}
                                                                                        />
                                                                                        <div className="flex min-w-0 flex-1 flex-col">
                                                                                            <span className="truncate text-sm">{atk.name}</span>
                                                                                            <span className="text-xs text-muted-foreground">
                                                                                                Satuan: {atk.satuan}
                                                                                            </span>
                                                                                        </div>
                                                                                        {isCurrentlySelected && (
                                                                                            <span className="shrink-0 rounded bg-primary px-1.5 py-0.5 text-[10px] font-medium text-primary-foreground">
                                                                                                Dipilih
                                                                                            </span>
                                                                                        )}
                                                                                    </CommandItem>
                                                                                );
                                                                            })}
                                                                        </CommandGroup>
                                                                    </CommandList>
                                                                </Command>
                                                            </PopoverContent>
                                                        </Popover>
                                                        {/* Hidden RHF fields */}
                                                        <input type="hidden" {...register(`items.${index}.id`)} />
                                                        <input type="hidden" {...register(`items.${index}.name`)} />
                                                        <input type="hidden" {...register(`items.${index}.satuan`)} />
                                                        <input type="hidden" {...register(`items.${index}.status` as const)} />
                                                    </div>

                                                    {/* Jumlah - only show if NOT "Lain-lain" */}
                                                    {!isCustomItem && (
                                                        <>
                                                            <div className="w-16 shrink-0">
                                                                <Input
                                                                    type="number"
                                                                    placeholder="Jml"
                                                                    {...register(`items.${index}.requested` as const)}
                                                                    min={1}
                                                                    disabled={!sel?.id}
                                                                    className="text-center text-sm"
                                                                />
                                                            </div>

                                                            {/* Satuan */}
                                                            <div className="w-14 shrink-0">
                                                                <Input
                                                                    readOnly
                                                                    value={sel?.satuan || ''}
                                                                    placeholder="-"
                                                                    className="px-1 text-center text-xs"
                                                                />
                                                            </div>
                                                        </>
                                                    )}

                                                    {/* Hapus item */}
                                                    {fields.length > 1 && (
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="icon"
                                                            className="h-9 w-9 shrink-0 bg-transparent"
                                                            onClick={() => remove(index)}
                                                        >
                                                            ×
                                                        </Button>
                                                    )}
                                                </div>

                                                {isCustomItem && (
                                                    <div className="ml-0 space-y-3 rounded-lg border-2 border-dashed border-amber-300 bg-amber-50/50 p-3">
                                                        <div className="mb-2 flex items-center gap-2 text-amber-700">
                                                            <Package className="h-4 w-4" />
                                                            <span className="text-xs font-medium">Detail Barang Lainnya</span>
                                                        </div>

                                                        {/* Nama Barang Custom */}
                                                        <div>
                                                            <Label className="text-xs text-amber-700">Nama Barang</Label>
                                                            <Input
                                                                placeholder="Tulis nama barang..."
                                                                {...register(`items.${index}.name`)}
                                                                className="mt-1 border-amber-200 bg-white focus:border-amber-400 focus:ring-amber-400"
                                                            />
                                                        </div>

                                                        {/* Jumlah dan Satuan dalam satu baris */}
                                                        <div className="flex gap-2">
                                                            <div className="flex-1">
                                                                <Label className="text-xs text-amber-700">Jumlah</Label>
                                                                <Input
                                                                    type="number"
                                                                    placeholder="Jumlah"
                                                                    {...register(`items.${index}.requested` as const)}
                                                                    min={1}
                                                                    className="mt-1 border-amber-200 bg-white focus:border-amber-400 focus:ring-amber-400"
                                                                />
                                                            </div>
                                                            <div className="flex-1">
                                                                <Label className="text-xs text-amber-700">Satuan</Label>
                                                                <Input
                                                                    placeholder="Pcs, Box, Rim..."
                                                                    {...register(`items.${index}.satuan`)}
                                                                    className="mt-1 border-amber-200 bg-white focus:border-amber-400 focus:ring-amber-400"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => append({ id: '', name: '', requested: 0, approved: 0, satuan: '', status: 'normal' })}
                                        disabled={fields.length >= availableATK.length + 1}
                                        className="mt-3"
                                    >
                                        + Tambah Barang
                                    </Button>
                                    {errors.items && <p className="mt-1 text-sm text-red-600">{errors.items.message}</p>}
                                </div>

                                {/* Keterangan */}
                                <div>
                                    <Label>
                                        Keterangan <span className="text-red-500">*</span>
                                    </Label>
                                    <Textarea
                                        {...register('justification')}
                                        placeholder="Jelaskan alasan kebutuhan..."
                                        className={`mt-1 ${cn(errors.justification && 'border-red-500')}`}
                                    />
                                </div>

                                {/* <div>
                                    <Label htmlFor="memo">Upload Memo (PDF) * <span className="text-red-500">*</span></Label>
                                    <div className="mt-1 space-y-3">
                                        <div className="flex items-center space-x-2">
                                            <Input
                                                ref={fileInputRef}
                                                id="memo"
                                                type="file"
                                                accept=".pdf"
                                                onChange={handleFileChange}
                                                className="hidden"
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => fileInputRef.current?.click()}
                                                className="flex items-center space-x-2"
                                            >
                                                <Upload className="h-4 w-4" />
                                                <span>Pilih File PDF</span>
                                            </Button>
                                            {selectedFile && (
                                                <Button type="button" variant="destructive" size="sm" onClick={removeFile}>
                                                    Hapus
                                                </Button>
                                            )}
                                        </div>

                                        <div className="rounded-lg border-2 border-dashed border-gray-300 p-4">
                                            {selectedFile ? (
                                                <div className="space-y-3">
                                                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                        <FileText className="h-4 w-4" />
                                                        <span>{selectedFile.name}</span>
                                                        <span className="text-xs">({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                                                    </div>

                                                    {isGeneratingThumbnail ? (
                                                        <div className="flex items-center justify-center py-8">
                                                            <div className="text-sm text-gray-500">Membuat preview...</div>
                                                        </div>
                                                    ) : thumbnailUrl ? (
                                                        <div className="flex justify-center">
                                                            <img
                                                                src={thumbnailUrl || '/placeholder.svg'}
                                                                alt="PDF Preview"
                                                                className="max-h-32 rounded border shadow-sm"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center justify-center py-8 text-sm text-gray-500">
                                                            Preview tidak tersedia
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-center py-8 text-sm text-gray-500">
                                                    Belum ada file dipilih
                                                </div>
                                            )}
                                        </div>

                                        {errors.memo && <p className="text-sm text-red-500">{errors.memo.message}</p>}
                                    </div>
                                </div> */}

                                {/* Narahubung */}
                                <div>
                                    <Label htmlFor="contact">
                                        No Hp <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="contact"
                                        {...register('contact')}
                                        placeholder="Nama dan nomor telepon"
                                        className={`mt-1 ${cn(errors.contact && 'border-red-500')}`}
                                    />
                                </div>

                                <Button type="submit" className="w-full">
                                    Ajukan Permintaan
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
                <BottomNavigation />

                <Dialog open={showSuccessDialog} onOpenChange={() => setShowSuccessDialog(false)}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader className="text-center">
                            <CheckCircle2 className="mb-3.5 h-10 w-10 text-green-600" />
                            <DialogTitle className="text-xl font-semibold text-green-700">Permintaan ATK berhasil diajukan!</DialogTitle>
                        </DialogHeader>
                        <div className="text-center text-sm text-muted-foreground">
                            Klik tombol "Ok" untuk melihat aktivitas dan detail permintaan.
                        </div>
                        <DialogFooter className="mt-4 flex justify-center">
                            <Button onClick={() => router.visit(route('history'))} className="w-full sm:w-auto">
                                OK
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <Toaster />
        </>
    );
}
