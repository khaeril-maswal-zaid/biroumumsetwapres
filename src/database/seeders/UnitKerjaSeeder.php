<?php

namespace Database\Seeders;

use App\Models\UnitKerja;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class UnitKerjaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // $datas =
        //     [
        //         "Biro Tata Usaha dan Sumber Daya Manusia",
        //         "Biro Umum",
        //         "Biro Perencanaan dan Keuangan",
        //         "Biro Protokol dan Kerumahtanggaan",
        //         "label" => "Unit Kerja C Label",
        //         "Biro Pers, Media, dan Informasi",
        //     ];

        // foreach ($datas as $key => $value) {
        //     UnitKerja::create([
        //         'kode_unit' => '02',
        //         'name' => Str::slug($value, '-'),
        //         'label' => $value,
        //     ]);
        // }
    }
}
