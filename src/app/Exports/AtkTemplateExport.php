<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use App\Models\DaftarAtk;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class AtkTemplateExport implements FromCollection, WithHeadings, WithMapping, WithStyles, ShouldAutoSize
{
    /**
     * @return \Illuminate\Support\Collection
     */

    public function collection()
    {
        return DaftarAtk::orderBy('name', 'asc')
            ->with('kategoriAtk:id,nama_kategori')
            ->get();
    }

    public function headings(): array
    {
        return [
            'No',
            'Kode ATK',
            'Nama ATK',
            'Kategori',
            'Satuan',
            'Perolehan',
            // 'Pemakaian',
            'Harga Satuan',
        ];
    }

    public function map($atk): array
    {
        static $no = 1;

        return [
            $no++,
            $atk->kode_atk,
            $atk->name,
            $atk->kategoriAtk?->nama_kategori,
            $atk->satuan,
            '',
            // '',
            '',
        ];
    }

    public function styles(Worksheet $sheet)
    {
        // Lock hanya kolom A–E
        // $sheet->getStyle('A1:E1000')->getProtection()->setLocked(true);

        // Unlock kolom F–G
        // $sheet->getStyle('F2:G1000')->getProtection()->setLocked(false);

        $sheet->setAutoFilter('A1:G1000');

        // Aktifkan proteksi
        // $protection = $sheet->getProtection();
        // $protection->setSheet(true);

        // IZINKAN AKSI YANG KAMU MAU
        // $protection->setDeleteRows(true);     // bisa delete row
        // $protection->setInsertRows(true);     // bisa tambah row
        // $protection->setAutoFilter(true);     // bisa filter
        // $protection->setSort(true);           // bisa sort

        return [
            1 => ['font' => ['bold' => true]],
        ];
    }
}
