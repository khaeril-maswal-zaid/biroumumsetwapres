<?php

namespace Database\Factories;

use App\Models\KategoriKerusakan;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\KerusakanGedung>
 */
class KerusakanGedungFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $user = User::inRandomOrder()->first();

        $kategori = KategoriKerusakan::inRandomOrder()->first();

        $pictures = [
            'images/kerusakan-gedung/' . fake()->uuid() . '.jpg',
            'images/kerusakan-gedung/' . fake()->uuid() . '.jpg',
        ];

        return [
            'user_id' => $user?->id ?? 1,
            'kode_unit' => $user?->pegawai?->unit?->kode_unit,

            'kategori_kerusakan_id' => $kategori?->id ?? 1,

            'lokasi' => fake()->randomElement([
                'Ruang Rapat Utama',
                'Lantai 2 Koridor Timur',
                'Toilet Selatan',
                'Area Parkir Belakang',
                'Gudang Arsip',
            ]),

            'item' => fake()->randomElement([
                'Lampu mati',
                'AC bocor',
                'Plafon rusak',
                'Kran bocor',
                'Pintu rusak',
            ]),

            'deskripsi' => fake()->sentence(),

            'picture' => $pictures,

            'urgensi' => fake()->randomElement([
                'rendah',
                'sedang',
                'tinggi',
                null,
            ]),

            'no_hp' => fake()->phoneNumber(),

            'kode_pelaporan' => 'KGD-' . now()->format('md') . '-' . strtoupper(fake()->unique()->bothify('???')),

            'status' => fake()->randomElement([
                'pending',
                'process',
                'confirmed',
            ]),

            'keterangan' => fake()->sentence(),

            'is_read' => fake()->boolean(),
        ];
    }
}
