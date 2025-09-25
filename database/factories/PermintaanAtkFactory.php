<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

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
        $atkItems = [
            'Pulpen',
            'Pensil',
            'Penghapus',
            'Penggaris',
            'Spidol',
            'Stabilo',
            'Tipe-X',
            'Buku Catatan',
            'Sticky Notes',
            'Map Plastik',
            'Map Kertas',
            'Ordner',
            'Kertas HVS A4',
            'Kertas HVS F4',
            'Amplop',
            'Binder Clip',
            'Paper Clip',
            'Stapler',
            'Isi Staples',
            'Gunting',
            'Cutter',
            'Lakban',
            'Double Tape',
            'Lem Kertas',
            'Lem UHU',
            'Tinta Printer',
            'Toner',
        ];


        return [
            'user_id' => User::inRandomOrder()->first()?->id ?? 1,
            'instansi_id' => 4,
            // 'unit_kerja' => User::inRandomOrder()->first()?->unit_kerja ?? 'Biro Umum',
            'daftar_kebutuhan' =>
            collect(range(1, rand(1, 5)))->map(fn() => [
                'id' => (string) fake()->numberBetween(1, 100),
                'name' => fake()->randomElement($atkItems),
                'requested' => fake()->numberBetween(1, 25),
                'approved' => 0,
                'unit' => fake()->randomElement(['rim', 'pak', 'lusin', 'buah']),
            ]),
            'deskripsi' => '',
            // 'urgensi' => fake()->randomElement(['normal', 'mendesak', 'segera']),
            'no_hp' => fake()->phoneNumber(),
            'memo' => 'memo.pdf',
            'kode_pelaporan' => 'ATK-' . now()->format('md') . '-' . strtoupper(Str::random(3)),
            'status' => fake()->randomElement(['pending']), //['pending', 'process', 'confirmed']
            'is_read' => fake()->numberBetween(0, 1),
            'keterangan' => fake()->text(250),
        ];
    }
}
