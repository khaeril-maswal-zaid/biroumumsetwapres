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
                'image' => 'ruang_rapat_utama.jpg',
                'fasilitas' => json_encode(['Proyektor', 'AC', 'Whiteboard'])
            ],
            [
                'nama_ruangan' => 'Ruang Multimedia',
                'kode_ruangan' => 'RMM002',
                'lokasi' => 'Gedung B, Lantai 2',
                'kapasitas' => 20,
                'image' => 'ruang_multimedia.jpg',
                'fasilitas' => json_encode(['TV LED', 'Sound System', 'Kamera CCTV'])
            ],
            [
                'nama_ruangan' => 'Ruang Presentasi',
                'kode_ruangan' => 'RPR003',
                'lokasi' => 'Gedung C, Lantai 3',
                'kapasitas' => 25,
                'image' => 'ruang_presentasi.jpg',
                'fasilitas' => json_encode(['LCD Proyektor', 'Mikrofon'])
            ],
            [
                'nama_ruangan' => 'Ruang Diskusi',
                'kode_ruangan' => 'RDK004',
                'lokasi' => 'Gedung D, Lantai 1',
                'kapasitas' => 15,
                'image' => 'ruang_diskusi.jpg',
                'fasilitas' => json_encode(['Meja Bundar', 'Papan Tulis'])
            ],
            [
                'nama_ruangan' => 'Ruang Pelatihan',
                'kode_ruangan' => 'RPL005',
                'lokasi' => 'Gedung A, Lantai 2',
                'kapasitas' => 40,
                'image' => 'ruang_pelatihan.jpg',
                'fasilitas' => json_encode(['Komputer', 'Proyektor', 'AC'])
            ],
            [
                'nama_ruangan' => 'Ruang Tunggu',
                'kode_ruangan' => 'RTG006',
                'lokasi' => 'Lobi Utama',
                'kapasitas' => 10,
                'image' => 'ruang_tunggu.jpg',
                'fasilitas' => json_encode(['Sofa', 'Majalah', 'AC'])
            ],
            [
                'nama_ruangan' => 'Ruang Arsip',
                'kode_ruangan' => 'RAS007',
                'lokasi' => 'Gedung B, Basement',
                'kapasitas' => 5,
                'image' => 'ruang_arsip.jpg',
                'fasilitas' => json_encode(['Rak Arsip', 'Lemari Besi'])
            ],
        ];

        foreach ($data as $key => $value) {
            DaftarRuangan::create([
                'nama_ruangan' => $value['nama_ruangan'],
                'kode_ruangan' => $value['kode_ruangan'],
                'lokasi' => $value['lokasi'],
                'kapasitas' => $value['kapasitas'],
                'image' => $value['image'],
                'fasilitas' => $value['fasilitas'],
            ]);
        }
    }
}
