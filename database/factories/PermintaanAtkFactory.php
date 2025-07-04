<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PermintaanAtk>
 */
class PermintaanAtkFactory extends Factory
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
            'daftar_kebutuhan' =>
            collect(range(1, rand(1, 5)))->map(fn() => [
                'name' => fake()->words(2, true),
                'quantity' => (string) fake()->numberBetween(1, 100),
                'unit' => fake()->randomElement(['rim', 'pak', 'lusin', 'buah']),
            ]),
            'deskripsi' => fake()->sentence(),
            'urgensi' => fake()->randomElement(['Normal', 'Mendesak', 'Segera']),
            'no_hp' => fake()->phoneNumber(),
            'kode_pelaporan' => fake()->unique()->bothify('PL-########'),
            'status' => fake()->randomElement(['confirmed', 'pending', 'cancelled']),
            'keterangan' => fake()->text(250),
        ];
    }
}
