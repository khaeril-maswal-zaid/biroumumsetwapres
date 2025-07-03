<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DaftarRuangan extends Model
{
    protected $casts = [
        'fasilitas' => 'array'
    ];
}
