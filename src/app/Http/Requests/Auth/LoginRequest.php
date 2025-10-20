<?php

namespace App\Http\Requests\Auth;

use Illuminate\Auth\Events\Lockout;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use LdapRecord\Container;
use LdapRecord\Models\ActiveDirectory\User as LdapUser;
use LdapRecord\Laravel\Auth\BindException;

class LoginRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'email' => ['required', 'string',],
            'password' => ['required', 'string'],
        ];
    }

    /**
     * Attempt to authenticate the request's credentials.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    // public function authenticate(): void
    // {
    //     $this->ensureIsNotRateLimited();

    //     if (! Auth::attempt($this->only('email', 'password'), $this->boolean('remember'))) {
    //         RateLimiter::hit($this->throttleKey());

    //         throw ValidationException::withMessages([
    //             'email' => __('auth.failed'),
    //         ]);
    //     }

    //     RateLimiter::clear($this->throttleKey());
    // }



    /**
     * Ensure the login request is not rate limited.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function ensureIsNotRateLimited(): void
    {
        if (! RateLimiter::tooManyAttempts($this->throttleKey(), 5)) {
            return;
        }

        event(new Lockout($this));

        $seconds = RateLimiter::availableIn($this->throttleKey());

        throw ValidationException::withMessages([
            'email' => __('auth.throttle', [
                'seconds' => $seconds,
                'minutes' => ceil($seconds / 60),
            ]),
        ]);
    }

    /**
     * Get the rate limiting throttle key for the request.
     */
    public function throttleKey(): string
    {
        return Str::transliterate(Str::lower($this->string('email')) . '|' . $this->ip());
    }


    //----------------------------------------------------------------
    public function authenticate(): void
    {
        $this->ensureIsNotRateLimited();

        $credentials = $this->only('email', 'password');
        $remember = $this->boolean('remember');

        // 1️⃣ Coba login ke database lokal dulu
        if (Auth::attempt($credentials, $remember)) {
            RateLimiter::clear($this->throttleKey());
            return;
        }

        $this->ensureIsNotRateLimited();

        $credentials = $this->only('email', 'password');

        try {
            $ldapUser = LdapUser::where('mail', '=', $credentials['email'])->first();

            if ($ldapUser) {
                $connection = Container::getDefaultConnection();

                // Coba autentikasi ke LDAP server
                if ($connection->auth()->attempt($ldapUser->getDn(), $credentials['password'])) {
                    // Autentikasi LDAP BERHASIL 🎉

                    // Sinkronisasi user LDAP ke database lokal
                    $localUser = \App\Models\User::firstOrCreate(
                        ['email' => $credentials['email']],
                        [
                            'name' => $ldapUser->getFirstAttribute('cn'),
                            'password' => bcrypt(Str::random(16)), // dummy password
                        ]
                    );

                    Auth::login($localUser, $this->boolean('remember'));
                    RateLimiter::clear($this->throttleKey());
                    return;
                }
            }
        } catch (\Exception $e) {
            logger('LDAP login failed: ' . $e->getMessage());
        }

        // Kalau LDAP gagal, anggap autentikasi gagal
        RateLimiter::hit($this->throttleKey());

        throw ValidationException::withMessages([
            'email' => __('auth.failed'),
        ]);
    }
}
