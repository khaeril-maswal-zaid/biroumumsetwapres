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
                'image' => 'set-1-lt-2-v1.jpg',
                'kode_ruangan' => 'RR-051',
            ],
            [
                'nama_ruangan' => 'Ruang Rapat',
                'lokasi' => 'Gedung Sekretariat I Lantai 3',
                'kapasitas' => '16+1',
                'image' => 'set-1-lt-3.jpg',
                'kode_ruangan' => 'RR-052',
            ],
            [
                'nama_ruangan' => 'Ruang Rapat',
                'lokasi' => 'Gedung Sekretariat I Lantai 4',
                'kapasitas' => '26+1',
                'image' => 'set-1-lt-4-v2.jpg',
                'kode_ruangan' => 'RR-053',
            ],
            [
                'nama_ruangan' => 'Ruang Rapat',
                'lokasi' => 'Gedung Sekretariat I Lantai 5',
                'kapasitas' => '16+1',
                'image' => 'set-1-lt-5.jpg',
                'kode_ruangan' => 'RR-054',
            ],
            [
                'nama_ruangan' => 'Ruang Rapat',
                'lokasi' => 'Gedung Sekretariat II Lantai 1',
                'kapasitas' => '34+1',
                'image' => 'set-2-lt-1-v1.jpg',
                'kode_ruangan' => 'RR-055',
            ],
            [
                'nama_ruangan' => 'HOLDING TAMU SKWP I',
                'lokasi' => 'Ruang Sinergi Gedung Sekretariat II Lantai 2',
                'kapasitas' => '6',
                'image' => 'sinergi-2-lt-2-v1.jpg',
                'kode_ruangan' => 'RR-056',
            ],
            [
                'nama_ruangan' => 'HOLDING TAMU SKWP II',
                'lokasi' => 'Ruang Sinergi Gedung Sekretariat II Lantai 2',
                'kapasitas' => '8',
                'image' => 'sinergi-2-lt-2-v2.jpg',
                'kode_ruangan' => 'HDT-057',
            ],
            [
                'nama_ruangan' => 'Ruang Rapat',
                'lokasi' => 'Gedung Sekretariat II Lantai 2',
                'kapasitas' => '12+1',
                'image' => 'set-2-lt-2-v1.jpg',
                'kode_ruangan' => 'HDT-058',
            ],
            [
                'nama_ruangan' => 'Ruang Rapat',
                'lokasi' => 'Gedung Sekretariat II Lantai 3',
                'kapasitas' => '16+1',
                'image' => 'set-2-lt-3.jpg',
                'kode_ruangan' => 'RR-059',
            ],
            [
                'nama_ruangan' => 'Ruang Rapat',
                'lokasi' => 'Gedung Sekretariat II Lantai 4',
                'kapasitas' => '26+1',
                'image' => 'set-2-lt-4-v1.jpg',
                'kode_ruangan' => 'RR-060',
            ],
            [
                'nama_ruangan' => 'Ruang Rapat',
                'lokasi' => 'Gedung Sekretariat II Lantai 5',
                'kapasitas' => '6+1',
                'image' => 'set-2-lt-5-v1.jpg',
                'kode_ruangan' => 'RR-061',
            ],
            [
                'nama_ruangan' => 'Ruang Rapat',
                'lokasi' => 'Gedung Penunjang Lantai 2',
                'kapasitas' => '8+1',
                'image' => 'penunjang-lt-2.png',
                'kode_ruangan' => 'RR-062',
            ],
        ];


        foreach ($data as $key => $value) {
            DaftarRuangan::create([
                'kode_unit' => '02',
                'nama_ruangan' => $value['nama_ruangan'],
                'kode_ruangan' => $value['kode_ruangan'],
                'lokasi' => $value['lokasi'],
                'kapasitas' => $value['kapasitas'],
                'image' => $value['image'],
                'status' => 'aktif',
                'fasilitas' => ['tv-led', 'wifi', 'ac'],
            ]);
        }
    }
}
