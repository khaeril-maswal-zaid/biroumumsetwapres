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
        'instansi_id',
        'kode_ruangan',
        'lokasi',
        'kapasitas',
        'image',
        'status',
        'fasilitas',
    ];
}
