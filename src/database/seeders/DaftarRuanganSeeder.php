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
                'nama_ruangan' => 'Ruang Rapat Tidore',
                'lokasi' => 'Gedung Sekretariat I Lantai 1',
                'kapasitas' => '10+1',
                'kapasitas_max' => '10+1',
                'fasilitas' => ['tv-led'],
                'image' => 'set-1-lt-1.png',
                'deskripsi' => 'Pulau Tidore di Maluku Utara, dijuluki "Negeri Seribu Kearifan" dan "Kota Seribu Masjid" yang merupakan pusat budaya serta sejarah Islam yang kuat. Dikenal sebagai Titik 0 Jalur Rempah dan penghasil rempah-rempah dunia seperti cengkeh dan pala, Tidore mencerminkan kejayaan peradaban yang melegenda. Mengusung filosofi kearifan lokal yang tercermin dalam tradisi adat, penghormatan lingkungan, dan hubungan sosial yang erat, ruang ini diharapkan menjadi tempat lahirnya ide-ide bijaksana, kolaborasi yang kuat, dan keputusan yang bermartabat. Terinspirasi dari kedalaman nilai spiritual dan kekayaan sejarahnya, ruang ini merepresentasikan sinergi antara etika, kewibawaan, dan tata krama dalam mendukung peran Biro Protokol dan Kerumahtanggaan.',
                'image_desc' => 'set-1-lt-1-desc.png',
                'lokasi_desc' => 'Pulau Tidore, Maluku Utara'
            ],
            [
                'nama_ruangan' => 'Ruang Rapat Miangas',
                'lokasi' => 'Gedung Sekretariat I Lantai 2',
                'kapasitas' => '26+1',
                'kapasitas_max' => '26+1',
                'fasilitas' => ['tv-led', 'kamera',],
                'image' => 'set-1-lt-2.png',
                'deskripsi' => 'Pulau Miangas adalah titik paling utara Indonesia di Kabupaten Kepulauan Talaud, Sulawesi Utara, yang secara strategis berbatasan langsung dengan Filipina di sisi utara dan dikelilingi luasnya Samudra Pasifik. Pulau Miangas pernah diperebutkan Amerika Serikat dan Belanda pada awal abad ke-20,  sebagian penduduknya menggunakan bahasa Tagalog. Meski terpencil, pulau ini telah dilengkapi fasilitas modern seperti Bandara Miangas dan PLTS. Penggunaan nama "Miangas" membawa filosofi tentang kedaulatan, kewaspadaan strategis, dan integritas. Secara letak, ruang rapat ini berada di sisi utara Kawasan Sekretariat Wakil Presiden dan menunjang Kedeputian Bidang Administrasi dalam memberikan pelayanan kerumahtanggaan, keprotokolan, pers, dan media kepada Wakil Presiden serta koordinasi pelaksanaan tugas pemberian dukungan administrasi kepada seluruh unsur organisasi di lingkungan Sekretariat Wakil Presiden.',
                'image_desc' => 'set-1-lt-2-desc.png',
                'lokasi_desc' => 'Pulau Miangas, Sulawesi Utara'
            ],
            [
                'nama_ruangan' => 'Ruang Rapat Ndana',
                'lokasi' => 'Gedung Sekretariat I Lantai 3',
                'kapasitas' => '16+1',
                'kapasitas_max' => '26+1',
                'fasilitas' => ['tv-led'],
                'image' => 'set-1-lt-3.png',
                'deskripsi' => 'Pulau Ndana adalah titik paling selatan Indonesia yang terletak di sebelah selatan Pulau Rote, Nusa Tenggara Timur. Sebagai "Beranda Selatan Nusantara", pulau ini memiliki fakta unik berupa Danau Merah yang legendaris serta menjadi habitat bagi rusa-rusa liar, menjadikannya simbol kekayaan alam yang tangguh di batas paling ujung negeri. Meski merupakan pulau tak berpenghuni tetap, Ndana dijaga ketat oleh prajurit garda depan dan memiliki monumen Jenderal Sudirman. Nama "Ndana" membawa filosofi tentang keteguhan, pengabdian, dan titik tumpu. Ruang Rapat Set I lantai 3 berada di lingkungan Biro Perencanaan dan Keuangan yang berkaitan dengan urusan penyusunan rencana dan program anggaran serta pengelolaan perbendaharaan dan pelaksanaan akuntansi keuangan.',
                'image_desc' => 'set-1-lt-3-desc.png',
                'lokasi_desc' => 'Pulau Ndana, Nusa Tenggara Timur'
            ],
            [
                'nama_ruangan' => 'Ruang Rapat Buton',
                'lokasi' => 'Gedung Sekretariat I Lantai 4',
                'kapasitas' => '26+1',
                'kapasitas_max' => '26+1',
                'fasilitas' => ['tv-led'],
                'image' => 'set-1-lt-4.jpg',
                'deskripsi' => 'Pulau Buton terletak di tenggara Sulawesi, dikelilingi Laut Banda di sisi utara dan timur, serta berbatasan dengan Selat Buton di barat dan Laut Flores di selatan. Dikenal sebagai penghasil aspal alam terbesar di dunia, Buton juga memiliki Benteng Keraton Buton sebagai benteng terluas di dunia serta keunikan suku Cia-Cia yang menggunakan aksara Hangul untuk bahasa daerahnya. Filosofi nama "Buton" melambangkan stabilitas, ketahanan, dan kemakmuran. Ruang Rapat Set I lantai 4 berada di lingkungan Deputi Bidang Dukungan Kebijakan Perekonomian, Pariwisata, dan Transformasi Digital yang berkaitan dengan urusan Infrastruktur, sumber daya alam, dan pembangunan kewilayahan.',
                'image_desc' => 'set-1-lt-4-desc.png',
                'lokasi_desc' => 'Pulau Buton, Sulawesi Tenggara'
            ],
            [
                'nama_ruangan' => 'Ruang Rapat Penyengat',
                'lokasi' => 'Gedung Sekretariat I Lantai 5',
                'kapasitas' => '16+1',
                'kapasitas_max' => '20+1',
                'fasilitas' => ['tv-led'],
                'image' => 'set-1-lt-5.jpg',
                'deskripsi' => 'Pulau Penyengat di Kepulauan Riau, sebuah pulau kecil yang terletak di seberang Kota Tanjungpinang dan menjadi bagian penting dari jalur strategis Selat Malaka. Pulau ini dikenal sebagai pusat sejarah dan intelektual Melayu, tempat lahirnya tokoh besar seperti Raja Ali Haji serta berkembangnya bahasa Melayu yang menjadi cikal bakal bahasa Indonesia. Mengusung filosofi adab, musyawarah, dan kebijaksanaan, ruang rapat ini diharapkan menjadi wadah lahirnya gagasan bernas dan keputusan bermakna. Terinspirasi dari keunikan Pulau Penyengat (termasuk Masjid Raya Sultan Riau yang dibangun dengan campuran putih telur) serta semangat `dari pulau kecil untuk peradaban besar`, ruang ini merepresentasikan kekuatan ilmu, warisan budaya, dan identitas yang menyatukan dalam mendukung Biro Tata Usaha dan Sumber Daya Manusia melaksanakan dan mengoordinasikan pengelolaan urusan ketatausahaan, dukungan administrasi sumber daya manusia, pelaksanaan evaluasi organisasi dan tata laksana.',
                'image_desc' => 'set-1-lt-5-desc.png',
                'lokasi_desc' => 'Pulau Penyengat, Kepulauan Riau'
            ],
            [
                'nama_ruangan' => 'Ruang Rapat Enggano',
                'lokasi' => 'Gedung Sekretariat II Lantai 1',
                'kapasitas' => '34+1',
                'kapasitas_max' => '50+1',
                'fasilitas' => ['tv-led', 'tv-matador', 'kamera', 'mikrofon',],
                'image' => 'set-2-lt-1.jpg',
                'deskripsi' => 'Pulau Enggano merupakan permata terluar Indonesia yang terletak secara strategis di sebelah barat daya Pulau Sumatera, tepatnya di wilayah administrasi Kabupaten Bengkulu Utara. Enggano adalah "laboratorium alam" yang menjadi rumah bagi berbagai spesies endemik, seperti Burung Kacamata Enggano dan Celepuk Enggano, yang tidak dapat ditemukan di belahan bumi mana pun. Pulau ini dihuni oleh masyarakat adat yang terbagi dalam enam suku besar (Kauno, Kaitora, Kaahua, Kaharubi, Kaarubi, dan Kamay) hidup harmonis dalam sistem kekerabatan matrilineal serta tetap melestarikan jejak kebudayaan megalitik. Penggunaan nama "Enggano" sebagai ruang rapat membawa filosofi mendalam tentang resiliensi, orisinalitas, dan sinergi. Sedangkan secara letak, ruang rapat ini berada di sisi barat Kawasan Sekretariat Wakil Presiden.',
                'image_desc' => 'set-2-lt-1-desc.png',
                'lokasi_desc' => 'Pulau Enggano, Bengkulu'
            ],
            [
                'nama_ruangan' => 'Ruang Rapat Holding Tamu SKWP I',
                'lokasi' => 'Ruang Sinergi Gedung Sekretariat II Lantai 2',
                'kapasitas' => '6',
                'kapasitas_max' => '6',
                'fasilitas' => ['tv-led', 'kamera',],
                'image' => 'sinergi-2-lt-2-v1.jpg',
                'deskripsi' => null,
                'image_desc' => null,
                'lokasi_desc' => null
            ],
            [
                'nama_ruangan' => 'Ruang Rapat Holding Tamu SKWP II',
                'lokasi' => 'Ruang Sinergi Gedung Sekretariat II Lantai 2',
                'kapasitas' => '8',
                'kapasitas_max' => '8',
                'fasilitas' => [''],
                'image' => 'sinergi-2-lt-2-v2.jpg',
                'deskripsi' => null,
                'image_desc' => null,
                'lokasi_desc' => null
            ],
            [
                'nama_ruangan' => 'Ruang Rapat Maratua',
                'lokasi' => 'Gedung Sekretariat II Lantai 2',
                'kapasitas' => '12+1',
                'kapasitas_max' => '20+1',
                'fasilitas' => ['tv-led'],
                'image' => 'set-2-lt-2.jpg',
                'deskripsi' => 'Pulau Maratua di Kalimantan Timur, sebuah pulau terluar Indonesia yang terletak di Laut Sulawesi dan berbatasan langsung dengan perairan internasional. Dikenal sebagai bagian dari Kepulauan Derawan, Maratua menyimpan kekayaan alam laut kelas dunia dengan keanekaragaman hayati yang tinggi serta ekosistem terumbu karang yang memukau. Mengusung filosofi keseimbangan, ketenangan, dan keberlanjutan, ruang rapat diharapkan menjadi tempat lahirnya ide-ide segar dan keputusan yang visioner. Terinspirasi dari keindahan alamnya, kejernihan laguna, serta semangat menjaga warisan alam untuk generasi mendatang, ruang rapat ini merepresentasikan harmoni antara kekuatan, pemikiran jernih, dan arah masa depan yang berkelanjutan di lingkungan Staf Khusus Wakil Presiden.',
                'image_desc' => 'set-2-lt-2-desc.png',
                'lokasi_desc' => 'Pulau Maratua, Kalimantan Timur'
            ],
            [
                'nama_ruangan' => 'Ruang Rapat Gili Iyang',
                'lokasi' => 'Gedung Sekretariat II Lantai 3',
                'kapasitas' => '16+1',
                'kapasitas_max' => '20+1',
                'fasilitas' => ['tv-led'],
                'image' => 'set-2-lt-3.png',
                'deskripsi' => 'Pulau Gili Iyang di Kabupaten Sumenep, Jawa Timur, sebuah pulau kecil di kawasan Madura yang dikenal memiliki salah satu kadar oksigen tertinggi di dunia. Letaknya yang relatif terpencil justru menyimpan keunikan alam yang memberikan kualitas udara bersih dan menyegarkan, serta mendukung kehidupan masyarakat yang sehat dan harmonis. Mengusung filosofi kejernihan, vitalitas, dan keberlanjutan, ruang ini diharapkan menjadi tempat lahirnya pemikiran segar, diskusi yang jernih, dan keputusan yang bernilai. Terinspirasi dari keunggulan oksigen alaminya serta semangat hidup sehat dan seimbang, ruang ini merepresentasikan energi positif, ketenangan, dan produktivitas yang berkelanjutan dalam mendukung Kedeputian Bidang Dukungan Kebijakan Peningkatan Kesejahteraan dan Pembangunan Sumber Daya Manusia.',
                'image_desc' => 'set-2-lt-3-desc.png',
                'lokasi_desc' => 'Pulau Gili Iyang, Jawa Timur'
            ],
            [
                'nama_ruangan' => 'Ruang Rapat Natuna',
                'lokasi' => 'Gedung Sekretariat II Lantai 4',
                'kapasitas' => '26+1',
                'kapasitas_max' => '26+1',
                'fasilitas' => ['tv-led'],
                'image' => 'set-2-lt-4.jpg',
                'deskripsi' => 'Pulau Natuna di Kepulauan Riau, wilayah terdepan Indonesia yang terletak strategis di perairan Laut Natuna Utara dan menjadi garda penjaga kedaulatan negara. Dikenal dengan kekayaan sumber daya alam serta keindahan lanskap laut dan gugusan pulau yang memukau, Natuna mencerminkan keteguhan, ketahanan, dan potensi besar yang terus berkembang. Mengusung filosofi kekuatan, kewaspadaan, dan keberlanjutan, ruang ini diharapkan menjadi tempat lahirnya keputusan yang kokoh, terarah, dan visioner. Terinspirasi dari peran strategisnya sebagai beranda negeri serta semangat menjaga kedaulatan dan keseimbangan alam, ruang ini merepresentasikan sinergi antara kekuatan, kejernihan berpikir, dan masa depan yang berdaya saing pada Deputi Deputi Bidang Dukungan Kebijakan Pemerintahan dan Pemerataan Pembangunan.',
                'image_desc' => 'set-2-lt-4-desc.png',
                'lokasi_desc' => 'Pulau Natuna, Kepulauan Riau'
            ],
            [
                'nama_ruangan' => 'Ruang Rapat Nuca Molas',
                'lokasi' => 'Gedung Sekretariat II Lantai 5',
                'kapasitas' => '6+1',
                'kapasitas_max' => '10+1',
                'fasilitas' => ['tv-led'],
                'image' => 'set-2-lt-5.jpg',
                'deskripsi' => 'Pulau Nuca Molas di Nusa Tenggara Timur, sebuah pulau yang sarat makna budaya dan kearifan lokal, dikenal sebagai ‘pulau cantik’ dalam bahasa setempat. Terletak di kawasan timur Indonesia yang kaya akan tradisi dan keindahan alam, Nuca Molas mencerminkan harmoni antara manusia, alam, dan warisan leluhur. Mengusung filosofi kesederhanaan, keindahan, dan kebersamaan, ruang ini diharapkan menjadi tempat lahirnya gagasan yang tulus, kolaboratif, dan berdampak. Terinspirasi dari pesona alamnya serta nilai-nilai kehidupan masyarakatnya yang menjunjung tinggi kebersamaan, ruang ini merepresentasikan kehangatan, keseimbangan, dan semangat membangun masa depan secara berkelanjutan dalam mendukung Biro Pers, Media, dan Informasi.',
                'image_desc' => 'set-2-lt-5-desc.png',
                'lokasi_desc' => 'Pulau Nuca Molas, Nusa Tenggara Timur'
            ],
            [
                'nama_ruangan' => 'Ruang Rapat Alor',
                'lokasi' => 'Gedung Sekretariat III Lantai 2',
                'kapasitas' => '31+1',
                'kapasitas_max' => '31+1',
                'fasilitas' => ['tv-led', 'tv-matador', 'kamera', 'mikrofon',],
                'image' => 'set-3-lt-2.png',
                'deskripsi' => 'Pulau Alor merupakan permata timur Indonesia yang terletak secara strategis di ujung timur kepulauan Nusa Tenggara, tepatnya di wilayah administrasi Kabupaten Alor, Nusa Tenggara Timur. Alor adalah "surga bawah laut" yang menjadi rumah bagi ekosistem terumbu karang kelas dunia dan biota laut langka seperti dugong. Dijuluki sebagai "Negeri Seribu Moko", Alor dihuni oleh masyarakat adat dengan puluhan bahasa daerah yang berbeda serta melestarikan tradisi menenun yang bernilai seni tinggi. Penggunaan nama "Alor" sebagai ruang rapat membawa filosofi mendalam tentang kedalaman berpikir, keberagaman gagasan yang menyatu, dan ketangguhan dalam menghadapi arus perubahan zaman. Sedangkan secara letak, ruang rapat ini berada di sisi timur Kawasan Sekretariat Wakil Presiden.',
                'image_desc' => 'set-3-lt-2-desc.png',
                'lokasi_desc' => 'Pulau Alor, Nusa Tenggara Timur'
            ],
            [
                'nama_ruangan' => 'Ruang Rapat Waigeo',
                'lokasi' => 'Gedung Penunjang Lantai 2',
                'kapasitas' => '8+1',
                'kapasitas_max' => '15+1',
                'fasilitas' => ['tv-led'],
                'image' => 'penunjang-lt-2.png',
                'deskripsi' => 'Pulau Waigeo di Papua Barat Daya, pulau terbesar di gugusan Raja Ampat yang terletak di jantung Segitiga Terumbu Karang dunia. Dikenal dengan kekayaan keanekaragaman hayati laut dan darat yang luar biasa, Waigeo mencerminkan harmoni, keseimbangan, dan keindahan alam yang mendunia. Mengusung filosofi keterhubungan, kelestarian, dan eksplorasi, ruang ini diharapkan menjadi tempat lahirnya ide-ide inovatif, kolaborasi yang kuat, dan keputusan yang berwawasan luas. Terinspirasi dari kejernihan perairannya, keunikan spesies endemik, serta peran Waigeo sebagai simbol kekayaan alam Indonesia, ruang ini merepresentasikan sinergi antara kreativitas, keberagaman, dan masa depan yang berkelanjutan dalam mendukung peran Biro Umum.',
                'image_desc' => 'penunjang-lt-2-desc.png',
                'lokasi_desc' => 'Pulau Waigeo, Papua Barat Daya'
            ],
        ];

        foreach ($data as $key => $value) {
            DaftarRuangan::create([
                'kode_unit' => '02',
                'nama_ruangan' => $value['nama_ruangan'],
                'lokasi' => $value['lokasi'],
                'kapasitas' => $value['kapasitas'],
                'kapasitas_max' => $value['kapasitas_max'],
                'image' => 'images/rooms/' . $value['image'],
                'deskripsi' => $value['deskripsi'],
                'image_desc' => isset($value['image_desc']) ? 'images/rooms/' . $value['image_desc'] : null,
                'lokasi_desc' => isset($value['lokasi_desc']) ? $value['lokasi_desc'] : null,
                'status' => 'aktif',
                'fasilitas' => $value['fasilitas'],
            ]);
        }
    }
}
