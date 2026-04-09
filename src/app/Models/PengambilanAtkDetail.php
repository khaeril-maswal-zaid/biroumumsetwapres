<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PengambilanAtkDetail extends Model
{
    protected $fillable = [
        'pengambilan_atk_id',
        'item_id',
        'item_name',
        'satuan',
        'qty_diambil',
    ];

    public function pengambilanAtk()
    {
        return $this->belongsTo(PengambilanAtk::class);
    }
}
