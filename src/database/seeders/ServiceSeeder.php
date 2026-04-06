<?php

namespace Database\Seeders;

use App\Models\Service;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $services = [
            [
                'name' => 'Pemesanan Ruang Rapat',
                'contact' => '081-234-5678',
                'url' => 'ruangrapat.create',
                'icon' => 'Users',
                'permission' => 'create_booking',
                'is_main' => false,
                'is_active' => true,
            ],
            [
                'name' => 'Perbaikan Sarpras',
                'contact' => '081-234-5678',
                'url' => 'kerusakangedung.create',
                'icon' => 'Wrench',
                'permission' => 'create_damage',
                'is_main' => false,
                'is_active' => true,
            ],
            [
                'name' => 'Permintaan ATK',
                'contact' => '081-234-5678',
                'url' => 'permintaanatk.create',
                'icon' => 'PenTool',
                'permission' => 'create_supplies',
                'is_main' => false,
                'is_active' => true,
            ],
            [
                'name' => 'Permintaan Kendaraan',
                'contact' => '081-234-5678',
                'url' => 'permintaankendaraan.create', // sementara
                'icon' => 'Car',
                'permission' => 'create_vehicle',
                'is_main' => false,
                'is_active' => true,
            ],
            [
                'name' => 'Help Desk Biro Umum',
                'contact' => '(021) 3842780',
                'url' => 'home',
                'icon' => 'Headphones',
                'permission' => 'view_homepage',
                'is_main' => true,
                'is_active' => false,
            ],
        ];

        foreach ($services as $service) {
            Service::create($service);
        }
    }
}
