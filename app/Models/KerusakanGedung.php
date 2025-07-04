<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class KerusakanGedung extends Model
{
    /** @use HasFactory<\Database\Factories\KerusakanGedungFactory> */
    use HasFactory;

    protected $casts = [
        'picture' => 'array'
    ];

    protected $fillable = [
        'user_id',
        'lokasi',
        'item',
        'deskripsi',
        'picture1',
        'picture2',
        'urgensi',
        'no_hp',
        'kode_pelaporan',
        'status',
        'keterangan',
    ];

    public function pelapor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
