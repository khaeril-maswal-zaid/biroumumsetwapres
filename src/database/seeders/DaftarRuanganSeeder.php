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
                'nama_ruangan' => 'Ruang Rapat Utama',
                'kode_ruangan' => 'RRU001',
                'lokasi' => 'Gedung A, Lantai 1',
                'kapasitas' => 30,
                'image' => 'image/rooms/1.jpg',
                'status' => 'aktif',
                'fasilitas' => ['proyektor', 'ac', 'whiteboard'],
            ],
            [
                'nama_ruangan' => 'Ruang Multimedia',
                'kode_ruangan' => 'RMM002',
                'lokasi' => 'Gedung B, Lantai 2',
                'kapasitas' => 20,
                'image' => 'image/rooms/2.jpg',
                'status' => 'aktif',
                'fasilitas' => ['tv-led', 'sound-system', 'kamera-cctv'],
            ],
            [
                'nama_ruangan' => 'Ruang Presentasi',
                'kode_ruangan' => 'RPR003',
                'lokasi' => 'Gedung C, Lantai 3',
                'kapasitas' => 25,
                'image' => 'image/rooms/3.jpg',
                'status' => 'aktif',
                'fasilitas' => ['lcd-proyektor', 'mikrofon'],
            ],
            [
                'nama_ruangan' => 'Ruang Diskusi',
                'kode_ruangan' => 'RDK004',
                'lokasi' => 'Gedung D, Lantai 1',
                'kapasitas' => 15,
                'image' => 'image/rooms/4.jpg',
                'status' => 'aktif',
                'fasilitas' => ['meja-bundar', 'papan-tulis'],
            ],
            [
                'nama_ruangan' => 'Ruang Pelatihan',
                'kode_ruangan' => 'RPL005',
                'lokasi' => 'Gedung A, Lantai 2',
                'kapasitas' => 40,
                'image' => 'image/rooms/5.jpg',
                'status' => 'aktif',
                'fasilitas' => ['komputer', 'proyektor', 'ac'],
            ],
            [
                'nama_ruangan' => 'Ruang Tunggu',
                'kode_ruangan' => 'RTG006',
                'lokasi' => 'Lobi Utama',
                'kapasitas' => 10,
                'image' => 'image/rooms/6.jpg',
                'status' => 'aktif',
                'fasilitas' => ['sofa', 'majalah', 'ac'],
            ],
            [
                'nama_ruangan' => 'Ruang Arsip',
                'kode_ruangan' => 'RAS007',
                'lokasi' => 'Gedung B, Basement',
                'kapasitas' => 5,
                'image' => 'image/rooms/7.jpg',
                'status' => 'aktif',
                'fasilitas' => ['rak-arsip', 'lemari-besi'],
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
                'status' => $value['status'],
                'fasilitas' => $value['fasilitas'],
            ]);
        }
    }
}
