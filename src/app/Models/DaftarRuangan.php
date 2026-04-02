<?php

namespace App\Models;

use App\Models\Scopes\InstansiScope;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\ScopedBy;
use Illuminate\Support\Str;

#[ScopedBy([InstansiScope::class])]

class DaftarRuangan extends Model
{
    protected $casts = [
        'fasilitas' => 'array'
    ];

    // Di model Ruangan.php (misalnya)
    protected $fillable = [
        'nama_ruangan',
        'kode_unit',
        'kode_ruangan',
        'lokasi',
        'kapasitas',
        'kapasitas_max',
        'image',
        'status',
        'fasilitas',
    ];

    public function unit()
    {
        return $this->belongsTo(Unit::class, 'kode_unit', 'kode_unit');
    }

    public function pemesanRupat()
    {
        return $this->hasMany(PemesananRuangRapat::class, 'daftar_ruangan_id');
    }

    protected static function booted()
    {
        static::creating(function ($param) {
            do {
                $random = strtoupper(Str::random(5)); // 5 huruf/angka acak
                $code = 'KRN-' . $random;
            } while (self::where('kode_ruangan', $code)->exists());

            $param->kode_ruangan = $code;
        });
    }
}
