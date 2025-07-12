<?php

namespace Database\Factories;

use App\Models\DaftarRuangan;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use Carbon\Carbon;

class PemesananRuangRapatFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => 1,
            'tanggal_penggunaan' => function () {

                $bulanIni = Carbon::now()->startOfMonth();
                $duaBulanLalu = Carbon::now()->subMonths(2)->startOfMonth();

                $startDate = fake()->randomElement([$bulanIni, $duaBulanLalu]);

                return fake()->dateTimeBetween($startDate, $startDate->copy()->endOfMonth())->format('Y-m-d');
            },
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
