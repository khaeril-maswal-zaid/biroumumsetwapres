<?php

namespace Database\Factories;

use App\Models\DaftarRuangan;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use Carbon\Carbon;

class PemesananRuangRapatFactory extends Factory
{
    public function definition(): array
    {
        $bulanIni = Carbon::now()->startOfMonth();
        $duaBulanLalu = Carbon::now()->subMonths(1)->startOfMonth();
        $startDate = fake()->randomElement([$bulanIni, $duaBulanLalu]);
        $tanggalPenggunaan = fake()->dateTimeBetween($startDate, $startDate->copy()->endOfMonth())->format('Y-m-d');

        $baseDate = Carbon::today();

        $startLimit = $baseDate->copy()->setTime(7, 0);
        $endLimit   = $baseDate->copy()->setTime(17, 0);

        $jamMulai = Carbon::instance(
            fake()->dateTimeBetween($startLimit, $endLimit->copy()->subMinutes(30))
        );

        $jamSelesai = (clone $jamMulai)->addMinutes(
            rand(30, $endLimit->diffInMinutes($jamMulai))
        );


        return [
            'user_id' => User::inRandomOrder()->first()?->id ?? 1,
            'instansi_id' => 4,
            // 'unit_kerja' => User::inRandomOrder()->first()?->unit_kerja ?? 'Biro Umum',
            'tanggal_penggunaan' => $tanggalPenggunaan,
            'jam_mulai' => '10:37',
            'jam_selesai' => '13:43',
            'daftar_ruangan_id' => DaftarRuangan::inRandomOrder()->first()?->id ?? 1,
            'deskripsi' => fake()->text(250),
            'no_hp' => fake()->phoneNumber(),
            'kode_booking' => 'RRT-' . now()->format('md') . '-' . strtoupper(Str::random(3)),
            'status' => fake()->randomElement(['pending', 'confirmed', 'cancelled']),
            'is_read' => fake()->boolean(),
            'keterangan' => fake()->text(250),
        ];
    }
}
