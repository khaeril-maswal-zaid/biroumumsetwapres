<?php

namespace App\Models;

use App\Models\Scopes\InstansiScope;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\ScopedBy;

#[ScopedBy([InstansiScope::class])]

class DaftarAtk extends Model
{
    protected $fillable = [
        'name',
        'instansi_id',
        'kode_atk',
        'category',
        'unit',
    ];
}
