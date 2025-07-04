<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PermintaanAtk extends Model
{
    /** @use HasFactory<\Database\Factories\PermintaanAtkFactory> */
    use HasFactory;

    protected $casts = [
        'daftar_kebutuhan' => 'array'
    ];

    protected $fillable = [
        'user_id',
        'daftar_kebutuhan',
        'deskripsi',
        'urgensi',
        'no_hp',
        'kode_pelaporan',
        'status',
        'keterangan',
    ];

    public function pemesan(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
