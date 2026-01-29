<?php

namespace Database\Seeders;

use App\Models\Unit;
use Illuminate\Database\Seeder;

class UnitSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $datas = [
            [
                'kode_unit' => '-',
                'nama_unit' => '',
                'kode_instansi' => '0',
                'kode_cabang' => '003',
            ],
            [
                'kode_unit' => '00',
                'nama_unit' => 'Sekretariat Kementerian',
                'kode_instansi' => '0',
                'kode_cabang' => '003',
            ],
            [
                'kode_unit' => '01',
                'nama_unit' => 'Sekretariat Presiden',
                'kode_instansi' => '0',
                'kode_cabang' => '000',
            ],
            [
                'kode_unit' => '02',
                'nama_unit' => 'Sekretariat Wakil Presiden',
                'kode_instansi' => '0',
                'kode_cabang' => '001',
            ],
            [
                'kode_unit' => '03',
                'nama_unit' => 'Sekretariat Militer Presiden',
                'kode_instansi' => '0',
                'kode_cabang' => '002',
            ],
            [
                'kode_unit' => '031',
                'nama_unit' => 'Sekretariat Dukungan Kabinet',
                'kode_instansi' => '0',
                'kode_cabang' => '012',
            ],
            [
                'kode_unit' => '04',
                'nama_unit' => 'Deputi Bidang Hukum dan Perundang-undangan',
                'kode_instansi' => '0',
                'kode_cabang' => '003',
            ],
            [
                'kode_unit' => '041',
                'nama_unit' => 'Deputi Bidang Perundang-undangan dan Administrasi Hukum',
                'kode_instansi' => '0',
                'kode_cabang' => '003',
            ],
            [
                'kode_unit' => '05',
                'nama_unit' => 'Deputi Bidang Hubungan  Kelembagaan dan Kemasyarakatan',
                'kode_instansi' => '0',
                'kode_cabang' => '003',
            ],
            [
                'kode_unit' => '06',
                'nama_unit' => 'Deputi Bidang Administrasi Aparatur',
                'kode_instansi' => '0',
                'kode_cabang' => '003',
            ],
            [
                'kode_unit' => '061',
                'nama_unit' => 'Badan Teknologi, Data, dan Informasi',
                'kode_instansi' => '0',
                'kode_cabang' => '003',
            ],
            [
                'kode_unit' => '07',
                'nama_unit' => 'Staf Ahli Menteri Sekretaris Negara',
                'kode_instansi' => '0',
                'kode_cabang' => '003',
            ],
            [
                'kode_unit' => '08',
                'nama_unit' => 'Staf Khusus Menteri Sekretaris Negara',
                'kode_instansi' => '0',
                'kode_cabang' => '003',
            ],
            [
                'kode_unit' => '09',
                'nama_unit' => 'Inspektorat',
                'kode_instansi' => '0',
                'kode_cabang' => '003',
            ],
            [
                'kode_unit' => '10',
                'nama_unit' => 'Pusat Pendidikan dan Pelatihan',
                'kode_instansi' => '0',
                'kode_cabang' => '003',
            ],
            [
                'kode_unit' => '11',
                'nama_unit' => 'Sekretaris Anggota Dewan Pertimbangan Presiden',
                'kode_instansi' => '1',
                'kode_cabang' => '005',
            ],
            [
                'kode_unit' => '12',
                'nama_unit' => 'Sekretariat Dewan Pertimbangan Presiden',
                'kode_instansi' => '1',
                'kode_cabang' => '005',
            ],
            [
                'kode_unit' => '13',
                'nama_unit' => 'Pusat Pengembangan Kompetensi Aparatur Sipil Negara',
                'kode_instansi' => '0',
                'kode_cabang' => '003',
            ],
            [
                'kode_unit' => '14',
                'nama_unit' => 'Kepala Pusat Pembinaan Penerjemah',
                'kode_instansi' => '0',
                'kode_cabang' => '003',
            ],
            [
                'kode_unit' => '15',
                'nama_unit' => 'Kepala Pusat Pembinaan Analis Kerja Sama',
                'kode_instansi' => '0',
                'kode_cabang' => '003',
            ],
            [
                'kode_unit' => '1670',
                'nama_unit' => 'Sekretariat Unit Kerja Presiden Pembinaan Ideologi Pancasila ',
                'kode_instansi' => '*',
                'kode_cabang' => '',
            ],
            [
                'kode_unit' => '20',
                'nama_unit' => 'Sekretariat Kantor Staf Presiden',
                'kode_instansi' => '2',
                'kode_cabang' => '006',
            ],
            [
                'kode_unit' => '21',
                'nama_unit' => 'Sekretariat Kantor Komunikasi Kepresidenan',
                'kode_instansi' => '169',
                'kode_cabang' => '011',
            ],
            [
                'kode_unit' => '22',
                'nama_unit' => 'Sekretariat Dewan Ekonomi Nasional',
                'kode_instansi' => '170',
                'kode_cabang' => '013',
            ],
            [
                'kode_unit' => '23',
                'nama_unit' => 'Sekretariat Badan Pengendalian Pembangunan dan Investigasi Khusus',
                'kode_instansi' => '173',
                'kode_cabang' => '014',
            ],
            [
                'kode_unit' => '30',
                'nama_unit' => 'Wakil Sekretaris Kabinet',
                'kode_instansi' => '3',
                'kode_cabang' => '004',
            ],
            [
                'kode_unit' => '31',
                'nama_unit' => 'Deputi Bidang Politik, Hukum, dan Keamanan',
                'kode_instansi' => '3',
                'kode_cabang' => '004',
            ],
            [
                'kode_unit' => '32',
                'nama_unit' => 'Deputi Bidang Perekonomian',
                'kode_instansi' => '3',
                'kode_cabang' => '004',
            ],
            [
                'kode_unit' => '33',
                'nama_unit' => 'Deputi Bidang Pembangunan Manusia dan Kebudayaan',
                'kode_instansi' => '3',
                'kode_cabang' => '004',
            ],
            [
                'kode_unit' => '34',
                'nama_unit' => 'Deputi Bidang Kemaritiman',
                'kode_instansi' => '3',
                'kode_cabang' => '004',
            ],
            [
                'kode_unit' => '35',
                'nama_unit' => 'Deputi Bidang Dukungan Kerja Kabinet',
                'kode_instansi' => '3',
                'kode_cabang' => '004',
            ],
            [
                'kode_unit' => '36',
                'nama_unit' => 'Deputi Bidang Administrasi',
                'kode_instansi' => '3',
                'kode_cabang' => '004',
            ],
            [
                'kode_unit' => '37',
                'nama_unit' => 'Staf Ahli Sekretaris Kabinet',
                'kode_instansi' => '3',
                'kode_cabang' => '004',
            ],
            [
                'kode_unit' => '38',
                'nama_unit' => 'Inspektorat',
                'kode_instansi' => '3',
                'kode_cabang' => '004',
            ],
            [
                'kode_unit' => '39',
                'nama_unit' => 'Pusat Data dan Teknologi Informasi',
                'kode_instansi' => '3',
                'kode_cabang' => '004',
            ],
            [
                'kode_unit' => '40',
                'nama_unit' => 'Pusat Pengelolaan Komplek Gelora Bung Karno',
                'kode_instansi' => '4',
                'kode_cabang' => NULL,
            ],
            [
                'kode_unit' => '42',
                'nama_unit' => 'Dewan Pengawas',
                'kode_instansi' => '4',
                'kode_cabang' => NULL,
            ],
            [
                'kode_unit' => '50',
                'nama_unit' => 'Direktur Utama',
                'kode_instansi' => '5',
                'kode_cabang' => '',
            ],
            [
                'kode_unit' => '51',
                'nama_unit' => 'Dewan Pengawas',
                'kode_instansi' => '5',
                'kode_cabang' => '',
            ],
            [
                'kode_unit' => '52',
                'nama_unit' => 'Direktur Utama PPK Kemayoran',
                'kode_instansi' => '5',
                'kode_cabang' => NULL,
            ],
            [
                'kode_unit' => '53',
                'nama_unit' => 'Dewan Pengawas',
                'kode_instansi' => '5',
                'kode_cabang' => NULL,
            ],
            [
                'kode_unit' => 'X00',
                'nama_unit' => 'Sekretariat Presiden',
                'kode_instansi' => '0',
                'kode_cabang' => '000',
            ],
            [
                'kode_unit' => 'X01',
                'nama_unit' => 'Sekretariat Wakil Presiden',
                'kode_instansi' => '0',
                'kode_cabang' => '001',
            ],
            [
                'kode_unit' => 'X02',
                'nama_unit' => 'Sekretariat Militer Presiden',
                'kode_instansi' => '0',
                'kode_cabang' => '002',
            ],
            [
                'kode_unit' => 'X03',
                'nama_unit' => 'Sekretariat Kementerian',
                'kode_instansi' => '0',
                'kode_cabang' => '003',
            ],
            [
                'kode_unit' => 'X04',
                'nama_unit' => 'Deputi Bidang Dukungan Kebijakan',
                'kode_instansi' => '0',
                'kode_cabang' => '003',
            ],
            [
                'kode_unit' => 'X05',
                'nama_unit' => 'Deputi Bidang Sumber Daya Manusia',
                'kode_instansi' => '0',
                'kode_cabang' => '003',
            ],
            [
                'kode_unit' => 'X06',
                'nama_unit' => 'Deputi Bidang Hubungan  Kelembagaan  dan Kemasyarakatan',
                'kode_instansi' => '0',
                'kode_cabang' => '003',
            ],
            [
                'kode_unit' => 'X07',
                'nama_unit' => 'Deputi Bidang Perundang-undangan',
                'kode_instansi' => '0',
                'kode_cabang' => '003',
            ],
            [
                'kode_unit' => 'X08',
                'nama_unit' => 'Staf Ahli Menteri Sekretaris Negara',
                'kode_instansi' => '0',
                'kode_cabang' => '003',
            ],
            [
                'kode_unit' => 'X09',
                'nama_unit' => 'Staf Khusus Menteri Sekretaris Negara',
                'kode_instansi' => '0',
                'kode_cabang' => '003',
            ],
            [
                'kode_unit' => 'X10',
                'nama_unit' => 'Inspektorat',
                'kode_instansi' => '0',
                'kode_cabang' => '003',
            ],
            [
                'kode_unit' => 'X11',
                'nama_unit' => 'Pusat Pendidikan dan Pelatihan',
                'kode_instansi' => '0',
                'kode_cabang' => '003',
            ],
            [
                'kode_unit' => 'X12',
                'nama_unit' => 'Sekretariat Dewan Pertimbangan Presiden',
                'kode_instansi' => '0',
                'kode_cabang' => '005',
            ],
            [
                'kode_unit' => 'X13',
                'nama_unit' => 'Sekretariat Unit Kerja Presiden Bidang Pengawasan dan Pengendalian Pembangunan',
                'kode_instansi' => '0',
                'kode_cabang' => '006',
            ],
            [
                'kode_unit' => 'X14',
                'nama_unit' => 'Sekretaris Anggota Dewan Pertimbangan Presiden',
                'kode_instansi' => '0',
                'kode_cabang' => '',
            ],
            [
                'kode_unit' => 'X15',
                'nama_unit' => 'Sekretariat Dewan Pertimbangan Presiden',
                'kode_instansi' => '0',
                'kode_cabang' => '005',
            ],
            [
                'kode_unit' => 'X40',
                'nama_unit' => 'Deputi Sekretaris Kabinet Bidang Pemerintahan',
                'kode_instansi' => '4',
                'kode_cabang' => '004',
            ],
            [
                'kode_unit' => 'X41',
                'nama_unit' => 'Deputi Sekretaris Kabinet Bidang Hukum',
                'kode_instansi' => '4',
                'kode_cabang' => '004',
            ],
            [
                'kode_unit' => 'X42',
                'nama_unit' => 'Deputi Sekretaris Kabinet Bidang Persidangan dan Dokumentasi',
                'kode_instansi' => '4',
                'kode_cabang' => '004',
            ],
            [
                'kode_unit' => 'X43',
                'nama_unit' => 'Deputi Sekretaris Kabinet Bidang Administrasi',
                'kode_instansi' => '4',
                'kode_cabang' => '004',
            ],
            [
                'kode_unit' => 'X44',
                'nama_unit' => 'Staf Ahli Sekretaris Kabinet',
                'kode_instansi' => '4',
                'kode_cabang' => '004',
            ],
            [
                'kode_unit' => 'X45',
                'nama_unit' => 'Staf Khusus Sekretaris Kabinet',
                'kode_instansi' => '4',
                'kode_cabang' => '004',
            ],
            [
                'kode_unit' => 'X46',
                'nama_unit' => 'Staf Khusus Presiden',
                'kode_instansi' => '4',
                'kode_cabang' => '004',
            ],
            [
                'kode_unit' => 'X47',
                'nama_unit' => 'CPNS Sekretariat Kabinet',
                'kode_instansi' => '4',
                'kode_cabang' => '004',
            ],
            [
                'kode_unit' => 'X48',
                'nama_unit' => 'Wakil Sekretaris Kabinet',
                'kode_instansi' => '4',
                'kode_cabang' => '004',
            ],
            [
                'kode_unit' => 'X99',
                'nama_unit' => 'Menteri Sekretaris Negara dan Kepala UKP4',
                'kode_instansi' => '0',
                'kode_cabang' => '',
            ],
        ];

        foreach ($datas as $key => $value) {
            Unit::create([
                'kode_unit' => $value['kode_unit'],
                'nama_unit' => $value['nama_unit'],
                'kode_instansi' => $value['kode_instansi'],
                'kode_cabang' => $value['kode_cabang'],
            ]);
        }
    }
}
