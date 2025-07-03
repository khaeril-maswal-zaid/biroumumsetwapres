<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PemesananRuangRapat extends Model
{
    /** @use HasFactory<\Database\Factories\PemesananRuangRapatFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'tanggal_penggunaan',
        'jam_mulai',
        'jam_selesai',
        'daftar_ruangan_id',
        'deskripsi',
        'no_hp',
        'status',
        'keterangan',
    ];
}
