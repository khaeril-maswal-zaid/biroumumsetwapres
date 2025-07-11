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
                'unit' => 'Rim',
            ],
            [
                'kode_atk' => 'Atk-kr02',
                'name' => 'Kertas HVS F4',
                'category' => 'Kertas',
                'unit' => 'Rim',
            ],
            [
                'kode_atk' => 'Atk-at03',
                'name' => 'Pulpen Hitam',
                'category' => 'Alat Tulis',
                'unit' => 'Pcs',
            ],
            [
                'kode_atk' => 'Atk-at04',
                'name' => 'Spidol Whiteboard',
                'category' => 'Alat Tulis',
                'unit' => 'Pcs',
            ],
            [
                'kode_atk' => 'Atk-at05',
                'name' => 'Pensil 2B',
                'category' => 'Alat Tulis',
                'unit' => 'Pcs',
            ],
            [
                'kode_atk' => 'Atk-PA06',
                'name' => 'Map Snelhecter',
                'category' => 'Perlengkapan Arsip',
                'unit' => 'Lusin',
            ],
            [
                'kode_atk' => 'Atk-at07',
                'name' => 'Stabilo Warna',
                'category' => 'Alat Tulis',
                'unit' => 'Pcs',
            ],
            [
                'kode_atk' => 'Atk-at08',
                'name' => 'Sticky Notes',
                'category' => 'Alat Tulis',
                'unit' => 'Pak',
            ],
            [
                'kode_atk' => 'Atk-cp09',
                'name' => 'Tinta Printer',
                'category' => 'Consumable Printer',
                'unit' => 'Botol',
            ],
            [
                'kode_atk' => 'Atk-ps10',
                'name' => 'Amplop Coklat A4',
                'category' => 'Perlengkapan Surat',
                'unit' => 'Pak',
            ],
            [
                'kode_atk' => 'Atk-at11',
                'name' => 'Lem Kertas',
                'category' => 'Alat Tulis',
                'unit' => 'Tube',
            ],
            [
                'kode_atk' => 'Atk-at12',
                'name' => 'Penghapus',
                'category' => 'Alat Tulis',
                'unit' => 'Pcs',
            ],
            [
                'kode_atk' => 'Atk-at13',
                'name' => 'Rautan',
                'category' => 'Alat Tulis',
                'unit' => 'Pcs',
            ],
            [
                'kode_atk' => 'Atk-pa14',
                'name' => 'Ordner',
                'category' => 'Perlengkapan Arsip',
                'unit' => 'Pcs',
            ],
            [
                'kode_atk' => 'Atk-ps15',
                'name' => 'Label Nama',
                'category' => 'Perlengkapan Surat',
                'unit' => 'Pak',
            ],
        ];

        foreach ($data as $key => $value) {
            DaftarAtk::create([
                'name' => $value['name'],
                'kode_atk' => $value['kode_atk'],
                'category' => $value['category'],
                'unit' => $value['unit'],
            ]);
        }
    }
}
