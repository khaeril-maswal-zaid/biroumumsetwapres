<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LogProses extends Model
{
    /** @use HasFactory<\Database\Factories\LogProsesFactory> */
    use HasFactory;

    protected $fillable = [
        'tanggal',
        'kerusakan_gedung_id',
        'title',
    ];
}
