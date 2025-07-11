<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DaftarAtk extends Model
{
    protected $fillable = [
        'name',
        'kode_atk',
        'category',
        'unit',
    ];
}
