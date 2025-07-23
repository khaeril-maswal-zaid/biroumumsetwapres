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
        return [
            'user_id' => User::inRandomOrder()->first()?->id ?? 1,
            'lokasi' => 'Lantai ' . fake()->numberBetween(1, 5) . ', Ruang ' . fake()->numberBetween(101, 599),
            'kategori_kerusakan_id' => KategoriKerusakan::inRandomOrder()->first()?->id ?? 1,
            'item' => fake()->word(),
            'deskripsi' => '',
            'picture' =>  [fake()->image('public/storage/image/kerusakan-gedung', 640, 480, null, false), fake()->image('public/storage/image/kerusakan-gedung', 640, 480, null, false)],
            'no_hp' => fake()->phoneNumber(),
            'urgensi' => fake()->randomElement(['rendah', 'sedang', 'tinggi']),
            'kode_pelaporan' => 'KGD-' . now()->format('md') . '-' . strtoupper(Str::random(3)),
            'status' => fake()->randomElement(['pending',]), //['pending', 'process', 'confirmed']
            'keterangan' => fake()->text(250),
        ];
    }
}
