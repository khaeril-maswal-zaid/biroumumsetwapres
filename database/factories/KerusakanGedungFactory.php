<?php

namespace Database\Factories;

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
            'user_id' => 1,
            'lokasi' => 'Lantai ' . fake()->numberBetween(1, 5) . ', Ruang ' . fake()->numberBetween(101, 599),
            'item' => fake()->word(),
            'deskripsi' => fake()->sentence(),
            'picture' =>  [fake()->image('public/storage/foto-kerusakan', 640, 480, null, false), fake()->image('public/storage/foto-kerusakan', 640, 480, null, false)],
            'no_hp' => fake()->phoneNumber(),
            'urgensi' => fake()->randomElement(['Tinggi', 'Sedang', 'Rendah']),
            'kode_pelaporan' => fake()->unique()->bothify('LP-########'),
            'status' => fake()->randomElement(['confirmed', 'pending', 'cancelled']),
            'keterangan' => fake()->text(250),
        ];
    }
}
