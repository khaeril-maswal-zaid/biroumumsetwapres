<?php

namespace Database\Seeders;

use App\Models\UnitKerja;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UnitKerjaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $datas =
            [
                [
                    "code_unit" => "biro-1",
                    "name" => "Unit Kerja A",
                    "label" => "Unit Kerja A Label"
                ],
                [
                    "code_unit" => "biro-2",
                    "name" => "Unit Kerja B",
                    "label" => "Unit Kerja B Label"
                ],
                [
                    "code_unit" => "biro-3",
                    "name" => "Unit Kerja C",
                    "label" => "Unit Kerja C Label"
                ]
            ];

        UnitKerja::insert($datas);
    }
}
