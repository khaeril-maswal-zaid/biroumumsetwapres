<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Scopes\InstansiScope;
use Illuminate\Database\Eloquent\Attributes\ScopedBy;


#[ScopedBy([InstansiScope::class])]
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
        'kode_unit'
    ];

    public function daftarAtk()
    {
        return $this->belongsTo(DaftarAtk::class);
    }
}
