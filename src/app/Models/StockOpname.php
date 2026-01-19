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
        'permintaan_atk_id',
        'daftar_atk_id',
        'quantity',
        'type',
        'source_stockopname_id',
        'remaining_quantity',
        'unit_price',
        'total_price',
        'kode_unit'
    ];

    public function daftarAtk()
    {
        return $this->belongsTo(DaftarAtk::class);
    }

    public function permintaanAtk()
    {
        return $this->belongsTo(PermintaanAtk::class, 'permintaan_atk_id');
    }
}
