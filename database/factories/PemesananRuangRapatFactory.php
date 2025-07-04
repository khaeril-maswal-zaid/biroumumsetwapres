<?php

namespace Database\Factories;

use App\Models\DaftarRuangan;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PemesananRuangRapat>
 */
class PemesananRuangRapatFactory extends Factory
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
            'tanggal_penggunaan' => fake()->date(),
            'jam_mulai' => fake()->time('H:i'),
            'jam_selesai' => fake()->time('H:i'),
            'daftar_ruangan_id' => DaftarRuangan::inRandomOrder()->first()?->id ?? 1,
            'deskripsi' => fake()->sentence(),
            'no_hp' => fake()->phoneNumber(),
            'kode_booking' => fake()->unique()->bothify('BK-########'),
            'status' => fake()->randomElement(['confirmed', 'pending', 'cancelled']),
            'keterangan' => fake()->text(250),
        ];
    }
}
