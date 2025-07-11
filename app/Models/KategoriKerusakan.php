<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class KategoriKerusakan extends Model
{
    protected $fillable  = [
        'name',
        'kode_kerusakan'
    ];
}
