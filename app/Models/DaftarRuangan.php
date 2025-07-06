<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DaftarRuangan extends Model
{
    protected $casts = [
        'fasilitas' => 'array'
    ];

    // Di model Ruangan.php (misalnya)
    protected $fillable = [
        'nama_ruangan',
        'kode_ruangan',
        'lokasi',
        'kapasitas',
        'image',
        'status',
        'fasilitas',
    ];
}
