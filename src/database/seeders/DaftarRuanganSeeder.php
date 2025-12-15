<?php

namespace Database\Seeders;

use App\Models\DaftarRuangan;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DaftarRuanganSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            [
                'nama_ruangan' => 'Ruang Rapat',
                'lokasi' => 'Gedung Sekretariat I Lantai 2',
                'kapasitas' => '26+1',
                'kapasitas_max' => '26+1',
                'fasilitas' => ['tv-led', 'kamera',],
                'image' => 'set-1-lt-2-v1.jpg'
            ],
            [
                'nama_ruangan' => 'Ruang Rapat',
                'lokasi' => 'Gedung Sekretariat I Lantai 3',
                'kapasitas' => '16+1',
                'kapasitas_max' => '26+1',
                'fasilitas' => ['tv-led'],
                'image' => 'set-1-lt-3.jpg'
            ],
            [
                'nama_ruangan' => 'Ruang Rapat',
                'lokasi' => 'Gedung Sekretariat I Lantai 4',
                'kapasitas' => '26+1',
                'kapasitas_max' => '26+1',
                'fasilitas' => ['tv-led'],
                'image' => 'set-1-lt-4-v2.jpg'
            ],
            [
                'nama_ruangan' => 'Ruang Rapat',
                'lokasi' => 'Gedung Sekretariat I Lantai 5',
                'kapasitas' => '16+1',
                'kapasitas_max' => '20+1',
                'fasilitas' => ['tv-led'],
                'image' => 'set-1-lt-5.jpg'
            ],
            [
                'nama_ruangan' => 'Ruang Rapat',
                'lokasi' => 'Gedung Sekretariat II Lantai 1',
                'kapasitas' => '34+1',
                'kapasitas_max' => '50+1',
                'fasilitas' => ['tv-led', 'tv-matador', 'kamera', 'mikrofon',],
                'image' => 'set-2-lt-1-v1.jpg'
            ],
            [
                'nama_ruangan' => 'HOLDING TAMU SKWP I',
                'lokasi' => 'Ruang Sinergi Gedung Sekretariat II Lantai 2',
                'kapasitas' => '6',
                'kapasitas_max' => '6',
                'fasilitas' => ['tv-led', 'kamera',],
                'image' => 'sinergi-2-lt-2-v1.jpg'
            ],
            [
                'nama_ruangan' => 'HOLDING TAMU SKWP II',
                'lokasi' => 'Ruang Sinergi Gedung Sekretariat II Lantai 2',
                'kapasitas' => '8',
                'kapasitas_max' => '8',
                'fasilitas' => [''],
                'image' => 'sinergi-2-lt-2-v2.jpg'
            ],
            [
                'nama_ruangan' => 'Ruang Rapat',
                'lokasi' => 'Gedung Sekretariat II Lantai 2',
                'kapasitas' => '12+1',
                'kapasitas_max' => '20+1',
                'fasilitas' => ['tv-led'],
                'image' => 'set-2-lt-2-v1.jpg'
            ],
            [
                'nama_ruangan' => 'Ruang Rapat',
                'lokasi' => 'Gedung Sekretariat II Lantai 3',
                'kapasitas' => '16+1',
                'kapasitas_max' => '20+1',
                'fasilitas' => ['tv-led'],
                'image' => 'set-2-lt-3.jpg'
            ],
            [
                'nama_ruangan' => 'Ruang Rapat',
                'lokasi' => 'Gedung Sekretariat II Lantai 4',
                'kapasitas' => '26+1',
                'kapasitas_max' => '26+1',
                'fasilitas' => ['tv-led'],
                'image' => 'set-2-lt-4-v1.jpg'
            ],
            [
                'nama_ruangan' => 'Ruang Rapat',
                'lokasi' => 'Gedung Sekretariat II Lantai 5',
                'kapasitas' => '6+1',
                'kapasitas_max' => '10+1',
                'fasilitas' => ['tv-led'],
                'image' => 'set-2-lt-5-v1.jpg'
            ],
            [
                'nama_ruangan' => 'Ruang Rapat',
                'lokasi' => 'Gedung Sekretariat III Lantai 2',
                'kapasitas' => '31+1',
                'kapasitas_max' => '31+1',
                'fasilitas' => ['tv-led', 'tv-matador', 'kamera', 'mikrofon',],
                'image' => 'set-3-lt-2.jpg'
            ],
            [
                'nama_ruangan' => 'Ruang Rapat',
                'lokasi' => 'Gedung Penunjang Lantai 2',
                'kapasitas' => '8+1',
                'kapasitas_max' => '15+1',
                'fasilitas' => ['tv-led'],
                'image' => 'penunjang-lt-2.png'
            ],
        ];


        foreach ($data as $key => $value) {
            DaftarRuangan::create([
                'kode_unit' => '02',
                'nama_ruangan' => $value['nama_ruangan'],
                'kode_ruangan' => 'RR-' . 51 + $key,
                'lokasi' => $value['lokasi'],
                'kapasitas' => $value['kapasitas'],
                'kapasitas_max' => $value['kapasitas_max'],
                'image' => 'images/rooms/' . $value['image'],
                'status' => 'aktif',
                'fasilitas' => $value['fasilitas'],
            ]);
        }
    }
}
