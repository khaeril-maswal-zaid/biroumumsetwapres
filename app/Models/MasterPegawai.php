<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MasterPegawai extends Model
{
    protected $fillable = [
        'nip',
        'nama',
        'kode_instansi',
        'kode_unit',
        'kode_deputi',
        'kode_biro',
        'kode_bagian',
        'kode_subbagian',
        'jabatan'
    ];

    public function unit()
    {
        return $this->belongsTo(Unit::class, 'kode_unit', 'kode_unit');
    }

    public function biro()
    {
        return $this->belongsTo(Biro::class, 'kode_biro', 'kode_biro');
    }

    public function user()
    {
        return $this->hasOne(User::class, 'nip', 'nip');
    }
}
