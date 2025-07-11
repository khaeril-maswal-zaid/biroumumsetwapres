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
            'user_id' => 1,
            'daftar_kebutuhan' =>
            collect(range(1, rand(1, 5)))->map(fn() => [
                'id' => (string) fake()->unique()->numberBetween(1, 100),
                'name' => fake()->randomElement($atkItems),
                'requested' => fake()->numberBetween(1, 25),
                'approved' => 0,
                'unit' => fake()->randomElement(['rim', 'pak', 'lusin', 'buah']),
            ]),
            'deskripsi' => fake()->sentence(),
            'urgensi' => fake()->randomElement(['normal', 'mendesak', 'segera']),
            'no_hp' => fake()->phoneNumber(),
            'kode_pelaporan' => fake()->unique()->bothify('PL-########'),
            'status' => fake()->randomElement(['pending', 'approved', 'partial', 'rejected']),
            'keterangan' => fake()->text(250),
        ];
    }
}
