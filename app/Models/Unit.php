<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Unit extends Model
{
    protected $primaryKey = 'kode_unit';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = ['kode_unit', 'nama_unit', 'kode_instansi', 'kode_cabang'];

    // public function instansi()
    // {
    //     return $this->belongsTo(Instansi::class, 'kode_instansi', 'kode_instansi');
    // }

    // public function deputis()
    // {
    //     return $this->hasMany(Deputi::class, 'kode_unit', 'kode_unit');
    // }
}
