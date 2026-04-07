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
        // Pilih tanggal antara bulan ini atau bulan lalu
        $bulanIni = Carbon::now()->startOfMonth();
        $bulanLalu = Carbon::now()->subMonth()->startOfMonth();

        $startDate = fake()->randomElement([$bulanIni, $bulanLalu]);

        $tanggalPenggunaan = Carbon::instance(
            fake()->dateTimeBetween($startDate, $startDate->copy()->endOfMonth())
        );

        // Jam antara 07:00 - 17:00
        $jamMulai = Carbon::instance(
            fake()->dateTimeBetween(
                $tanggalPenggunaan->copy()->setTime(7, 0),
                $tanggalPenggunaan->copy()->setTime(16, 0)
            )
        );

        // Durasi 30 - 180 menit
        $jamSelesai = (clone $jamMulai)->addMinutes(rand(30, 180));

        // Pastikan tidak lewat jam 17:00
        if ($jamSelesai->gt($tanggalPenggunaan->copy()->setTime(17, 0))) {
            $jamSelesai = $tanggalPenggunaan->copy()->setTime(17, 0);
        }

        $user = User::inRandomOrder()->first();

        $isHybrid = fake()->boolean();
        $isTiSupport = fake()->boolean();

        return [
            'user_id' => $user?->id ?? 1,
            'kode_unit' => $user?->pegawai?->unit?->kode_unit,

            'tanggal_penggunaan' => $tanggalPenggunaan->format('Y-m-d'),
            'jam_mulai' => $jamMulai->format('H:i'),
            'jam_selesai' => $jamSelesai->format('H:i'),

            'daftar_ruangan_id' => DaftarRuangan::inRandomOrder()->first()?->id ?? 1,

            'jumlah_peserta' => fake()->numberBetween(2, 50),
            'deskripsi' => fake()->sentence(),
            'jenis_rapat' => fake()->randomElement(['internal', 'external']),
            'no_hp' => fake()->phoneNumber(),

            'kode_booking' => 'RRT-' . now()->format('md') . '-' . strtoupper(Str::random(3)),

            'status' => fake()->randomElement(['booked', 'rescheduled', 'rejected']),

            'is_hybrid' => $isHybrid,
            'hybrid_detail' => $isHybrid ? fake()->sentence() : null,

            'is_ti_support' => $isTiSupport,
            'ti_support_detail' => $isTiSupport ? fake()->sentence() : null,

            'is_read' => fake()->boolean(),
            'keterangan' => fake()->sentence(),
        ];
    }
}
