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

    // public function instansi()
    // {
    //     return $this->belongsTo(Instansi::class, 'kode_instansi', 'kode_instansi');
    // }

    public function unit()
    {
        return $this->belongsTo(Unit::class, 'kode_unit', 'kode_unit');
    }

    // public function deputi()
    // {
    //     return $this->belongsTo(Deputi::class, 'kode_deputi', 'kode_deputi');
    // }

    public function biro()
    {
        return $this->belongsTo(Biro::class, 'kode_biro', 'kode_biro');
    }

    // public function bagian()
    // {
    //     return $this->belongsTo(Bagian::class, 'kode_bagian', 'kode_bagian');
    // }

    // public function subbagian()
    // {
    //     return $this->belongsTo(Subbagian::class, 'kode_subbagian', 'kode_subbagian');
    // }

    public function user()
    {
        return $this->hasOne(User::class, 'nip', 'nip');
    }
}
