<?php

namespace Database\Factories;

use App\Models\KategoriKerusakan;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

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
        return [
            'user_id' => User::inRandomOrder()->first()?->id ?? 1,
            'lokasi' => 'Lantai ' . fake()->numberBetween(1, 5) . ', Ruang ' . fake()->numberBetween(101, 599),
            'kategori_kerusakan_id' => KategoriKerusakan::inRandomOrder()->first()?->id ?? 1,
            'item' => fake()->word(),
            'deskripsi' => fake()->sentence(),
            'picture' =>  [fake()->image('public/storage/image/kerusakan-gedung', 640, 480, null, false), fake()->image('public/storage/image/kerusakan-gedung', 640, 480, null, false)],
            'no_hp' => fake()->phoneNumber(),
            'urgensi' => fake()->randomElement(['rendah', 'sedang', 'tinggi']),
            'kode_pelaporan' => fake()->unique()->bothify('LP-########'),
            'status' => fake()->randomElement(['pending', 'confirmed', 'cancelled']),
            'keterangan' => fake()->text(250),
        ];
    }
}
