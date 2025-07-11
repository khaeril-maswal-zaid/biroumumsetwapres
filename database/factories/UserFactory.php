<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    protected $model = User::class;

    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'unit_kerja' => 'Kendaraan',
            'email' => fake()->email(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'remember_token' => Str::random(10),
        ];
    }

    public function admin()
    {
        return $this->state([
            'name' => 'Admin 1',
            'email' => 'admin1@setwapres.com',
            'unit_kerja' => 'Kendaraan',
        ])->afterCreating(function (User $user) {
            $user->assignRole('admin');
        });
    }

    public function pegawai()
    {
        return $this->state([
            'name' => 'Pegawai 1',
            'email' => 'pegawai1@setwapres.com',
            'unit_kerja' => 'TUSDM',
        ])->afterCreating(function (User $user) {
            $user->assignRole('pegawai');
        });
    }

    public function atasan()
    {
        return $this->state([
            'name' => 'Atasan 1',
            'email' => 'atasan1@setwapres.com',
            'unit_kerja' => 'Umum',
        ])->afterCreating(function (User $user) {
            $user->assignRole('atasan');
        });
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn(array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
