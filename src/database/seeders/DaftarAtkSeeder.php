<?php

namespace Database\Seeders;

use App\Models\DaftarAtk;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DaftarAtkSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            [
                'kode_atk' => 'Atk-kr01',
                'name' => 'Kertas A4',
                'category' => 'Kertas',
                'satuan' => 'Rim',
            ],
            [
                'kode_atk' => 'Atk-kr02',
                'name' => 'Kertas HVS F4',
                'category' => 'Kertas',
                'satuan' => 'Rim',
            ],
            [
                'kode_atk' => 'Atk-at03',
                'name' => 'Pulpen Hitam',
                'category' => 'Alat Tulis',
                'satuan' => 'Pcs',
            ],
            [
                'kode_atk' => 'Atk-at04',
                'name' => 'Spidol Whiteboard',
                'category' => 'Alat Tulis',
                'satuan' => 'Pcs',
            ],
            [
                'kode_atk' => 'Atk-at05',
                'name' => 'Pensil 2B',
                'category' => 'Alat Tulis',
                'satuan' => 'Pcs',
            ],
            [
                'kode_atk' => 'Atk-PA06',
                'name' => 'Map Snelhecter',
                'category' => 'Perlengkapan Arsip',
                'satuan' => 'Lusin',
            ],
            [
                'kode_atk' => 'Atk-at07',
                'name' => 'Stabilo Warna',
                'category' => 'Alat Tulis',
                'satuan' => 'Pcs',
            ],
            [
                'kode_atk' => 'Atk-at08',
                'name' => 'Sticky Notes',
                'category' => 'Alat Tulis',
                'satuan' => 'Pak',
            ],
            [
                'kode_atk' => 'Atk-cp09',
                'name' => 'Tinta Printer',
                'category' => 'Consumable Printer',
                'satuan' => 'Botol',
            ],
            [
                'kode_atk' => 'Atk-ps10',
                'name' => 'Amplop Coklat A4',
                'category' => 'Perlengkapan Surat',
                'satuan' => 'Pak',
            ],
            [
                'kode_atk' => 'Atk-at11',
                'name' => 'Lem Kertas',
                'category' => 'Alat Tulis',
                'satuan' => 'Tube',
            ],
            [
                'kode_atk' => 'Atk-at12',
                'name' => 'Penghapus',
                'category' => 'Alat Tulis',
                'satuan' => 'Pcs',
            ],
            [
                'kode_atk' => 'Atk-at13',
                'name' => 'Rautan',
                'category' => 'Alat Tulis',
                'satuan' => 'Pcs',
            ],
            [
                'kode_atk' => 'Atk-pa14',
                'name' => 'Ordner',
                'category' => 'Perlengkapan Arsip',
                'satuan' => 'Pcs',
            ],
            [
                'kode_atk' => 'Atk-ps15',
                'name' => 'Label Nama',
                'category' => 'Perlengkapan Surat',
                'satuan' => 'Pak',
            ],
        ];

        foreach ($data as $key => $value) {
            DaftarAtk::create([
                'kode_unit' => '02',
                'name' => $value['name'],
                'kode_atk' => $value['kode_atk'],
                'category' => $value['category'],
                'satuan' => $value['satuan'],
            ]);
        }
    }
}
