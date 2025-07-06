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
                'status' => 'aktif',
                'fasilitas' => [
                    ['name' => 'Proyektor', 'icon' => 'Projector'],
                    ['name' => 'AC', 'icon' => 'Snowflake'],
                    ['name' => 'Whiteboard', 'icon' => 'PenSquare'],
                ],
            ],
            [
                'nama_ruangan' => 'Ruang Multimedia',
                'kode_ruangan' => 'RMM002',
                'lokasi' => 'Gedung B, Lantai 2',
                'kapasitas' => 20,
                'image' => 'ruang_multimedia.jpg',
                'status' => 'aktif',
                'fasilitas' => [
                    ['name' => 'TV LED', 'icon' => 'Tv'],
                    ['name' => 'Sound System', 'icon' => 'Speaker'],
                    ['name' => 'Kamera CCTV', 'icon' => 'Camera'],
                ],
            ],
            [
                'nama_ruangan' => 'Ruang Presentasi',
                'kode_ruangan' => 'RPR003',
                'lokasi' => 'Gedung C, Lantai 3',
                'kapasitas' => 25,
                'image' => 'ruang_presentasi.jpg',
                'status' => 'aktif',
                'fasilitas' => [
                    ['name' => 'LCD Proyektor', 'icon' => 'Projector'],
                    ['name' => 'Mikrofon', 'icon' => 'Mic'],
                ],
            ],
            [
                'nama_ruangan' => 'Ruang Diskusi',
                'kode_ruangan' => 'RDK004',
                'lokasi' => 'Gedung D, Lantai 1',
                'kapasitas' => 15,
                'image' => 'ruang_diskusi.jpg',
                'status' => 'aktif',
                'fasilitas' => [
                    ['name' => 'Meja Bundar', 'icon' => 'Table'],
                    ['name' => 'Papan Tulis', 'icon' => 'PenSquare'],
                ],
            ],
            [
                'nama_ruangan' => 'Ruang Pelatihan',
                'kode_ruangan' => 'RPL005',
                'lokasi' => 'Gedung A, Lantai 2',
                'kapasitas' => 40,
                'image' => 'ruang_pelatihan.jpg',
                'status' => 'aktif',
                'fasilitas' => [
                    ['name' => 'Komputer', 'icon' => 'Computer'],
                    ['name' => 'Proyektor', 'icon' => 'Projector'],
                    ['name' => 'AC', 'icon' => 'Snowflake'],
                ],
            ],
            [
                'nama_ruangan' => 'Ruang Tunggu',
                'kode_ruangan' => 'RTG006',
                'lokasi' => 'Lobi Utama',
                'kapasitas' => 10,
                'image' => 'ruang_tunggu.jpg',
                'status' => 'aktif',
                'fasilitas' => [
                    ['name' => 'Sofa', 'icon' => 'Sofa'],
                    ['name' => 'Majalah', 'icon' => 'BookOpen'],
                    ['name' => 'AC', 'icon' => 'Snowflake'],
                ],
            ],
            [
                'nama_ruangan' => 'Ruang Arsip',
                'kode_ruangan' => 'RAS007',
                'lokasi' => 'Gedung B, Basement',
                'kapasitas' => 5,
                'image' => 'ruang_arsip.jpg',
                'status' => 'aktif',
                'fasilitas' => [
                    ['name' => 'Rak Arsip', 'icon' => 'Folders'],
                    ['name' => 'Lemari Besi', 'icon' => 'Shield'],
                ],
            ],
        ];


        foreach ($data as $key => $value) {
            DaftarRuangan::create([
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
