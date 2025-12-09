<?php

namespace App\Models;

use App\Models\Scopes\InstansiScope;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\ScopedBy;

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
        'image',
        'status',
        'fasilitas',
    ];

    public function unit()
    {
        return $this->belongsTo(Unit::class, 'kode_unit', 'kode_unit');
    }
}
