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
        $user = User::inRandomOrder()->first();

        $jumlahItem = rand(1, 5);

        $items = collect(range(1, $jumlahItem))->map(function () {
            $requested = rand(1, 20);
            $approved = rand(0, $requested);

            return [
                'id' => rand(1, 100),
                'name' => fake()->randomElement([
                    'Pulpen',
                    'Pensil',
                    'Kertas A4',
                    'Map Folder',
                    'Stapler',
                    'Spidol',
                    'Lakban',
                ]),
                'satuan' => fake()->randomElement([
                    'pcs',
                    'box',
                    'rim',
                    'pack',
                ]),
                'status' => fake()->randomElement([
                    'available',
                    'limited',
                    'empty',
                ]),
                'requested' => $requested,
                'approved' => $approved,
            ];
        })->values()->toArray();

        return [
            'user_id' => $user?->id ?? 1,
            'kode_unit' => $user?->pegawai?->unit?->kode_unit,

            'daftar_kebutuhan' => $items,

            'deskripsi' => fake()->sentence(),
            'no_hp' => fake()->phoneNumber(),

            'kode_pelaporan' => 'ATK-' . now()->format('md') . '-' . strtoupper(Str::random(3)),

            'status' => fake()->randomElement([
                'pending',
                'partial',
                'rejected',
                'confirmed',
            ]),

            'keterangan' => fake()->sentence(),
            'is_read' => fake()->boolean(),
        ];
    }
}
