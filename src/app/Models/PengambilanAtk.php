<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PengambilanAtk extends Model
{
    protected $fillable = [
        'permintaan_atk_id',
        'nama_pengambil',
        'no_hp',
        'tanggal_ambil',
        'keterangan'
    ];

    public function permintaanAtk()
    {
        return $this->belongsTo(PermintaanAtk::class);
    }

    public function details()
    {
        return $this->hasMany(PengambilanAtkDetail::class);
    }
}
