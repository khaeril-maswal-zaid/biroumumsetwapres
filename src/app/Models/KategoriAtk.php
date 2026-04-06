<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class KategoriAtk extends Model
{
    protected $fillable = [
        'kode_kategori',
        'nama_kategori'
    ];

    /** @use HasFactory<\Database\Factories\KategoriAtkFactory> */
    use HasFactory;

    protected static function booted()
    {
        static::creating(function ($param) {
            do {
                $random = strtoupper(Str::random(5)); // 5 huruf/angka acak
                $code = 'KRG-' . $random;
            } while (self::where('kode_kategori', $code)->exists());

            $param->kode_kategori = $code;
        });
    }
}
