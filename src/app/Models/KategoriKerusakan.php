<?php

namespace App\Models;

use App\Models\Scopes\InstansiScope;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\ScopedBy;
use Illuminate\Support\Str;

#[ScopedBy([InstansiScope::class])]
class KategoriKerusakan extends Model
{
    protected $fillable  = [
        'name',
        'kode_unit',
        'kode_kerusakan',
        'sub_kategori',
        'bagian_kategori'
    ];

    protected $casts = [
        'sub_kategori' => 'array',
    ];

    protected static function booted()
    {
        static::creating(function ($param) {
            do {
                $random = strtoupper(Str::random(5)); // 5 huruf/angka acak
                $code = 'KRN-' . $random;
            } while (self::where('kode_kerusakan', $code)->exists());

            $param->kode_kerusakan = $code;
        });
    }
}
