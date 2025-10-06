<?php

namespace Database\Seeders;

use App\Models\Instansi;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class InstansiSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            [
                'nama' => 'Sekretariat Dukungan Kabinet',
                'alamat' => 'Jl. Medan Merdeka Utara No. 7, Jakarta Pusat',
            ],
            [
                'nama' => 'Sekretariat Militer Presiden',
                'alamat' => 'Jl. Veteran No. 17, Jakarta Pusat',
            ],
            [
                'nama' => 'Sekretariat Wakil Presiden',
                'alamat' => 'Jl. Medan Merdeka Selatan No. 6, Jakarta Pusat',
            ],
            [
                'nama' => 'Sekretariat Kementerian',
                'alamat' => 'Jl. Veteran No. 18, Jakarta Pusat',
            ],
            [
                'nama' => 'Sekretariat Presiden',
                'alamat' => 'Jl. Medan Merdeka Utara No. 1, Jakarta Pusat',
            ],
            [
                'nama' => 'Sekretariat Dukungan Kabinet',
                'alamat' => 'Jl. Medan Merdeka Barat No. 3, Jakarta Pusat',
            ],
        ];

        foreach ($data as $item) {
            Instansi::insert($item);
        }
    }
}
