<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

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
        'kode_booking',
        'status',
        'keterangan',
    ];

    public function ruangans(): BelongsTo
    {
        return $this->belongsTo(DaftarRuangan::class, 'daftar_ruangan_id');
    }

    public function pemesan(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
