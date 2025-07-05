<?php

namespace Database\Factories;

use App\Models\DaftarRuangan;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

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
            'kode_booking' => 'BK-' . now()->format('Ymd') . '-' . strtoupper(Str::random(6)),
            'status' => fake()->randomElement(['pending', 'confirmed', 'cancelled']),
            'keterangan' => fake()->text(250),
        ];
    }
}
