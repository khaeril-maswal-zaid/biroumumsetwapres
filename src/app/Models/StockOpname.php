<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StockOpname extends Model
{
    /** @use HasFactory<\Database\Factories\StockOpnameFactory> */
    use HasFactory;

    protected $fillable = [
        'daftar_atk_id',
        'quantity',
        'type',
        'unit_price',
        'total_price',
    ];

    public function daftarAtk()
    {
        return $this->belongsTo(DaftarAtk::class);
    }
}
