<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KerusakanGedung extends Model
{
    /** @use HasFactory<\Database\Factories\KerusakanGedungFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'lokasi',
        'item',
        'deskripsi',
        'picture1',
        'picture2',
        'urgensi',
        'no_hp',
        'keterangan',
    ];
}
