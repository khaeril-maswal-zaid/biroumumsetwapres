<?php

namespace App\Models;

use App\Models\Scopes\InstansiScope;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\ScopedBy;
use Illuminate\Support\Str;

#[ScopedBy([InstansiScope::class])]

class DaftarAtk extends Model
{
    protected $fillable = [
        'name',
        'instansi_id',
        'kode_atk',
        'kategori_atk_id',
        'satuan',
        'kode_unit',
        'quantity',
        'available_stock',
    ];

    protected static function booted()
    {
        static::creating(function ($layanan) {
            do {
                $random = strtoupper(Str::random(5));
                $code = 'ATK-' . $random;
            } while (self::where('kode_atk', $code)->exists());

            $layanan->kode_atk = $code;
        });
    }

    public function kategoriAtk()
    {
        return $this->belongsTo(KategoriAtk::class, 'kategori_atk_id');
    }

    public function stockOpnames()
    {
        return $this->hasMany(StockOpname::class);
    }
}
