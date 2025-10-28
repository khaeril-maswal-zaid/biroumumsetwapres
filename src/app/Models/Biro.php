<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Biro extends Model
{

    protected $primaryKey = 'kode_biro';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = ['kode_biro', 'nama_biro', 'kode_deputi'];

    public function deputi()
    {
        return $this->belongsTo(Deputi::class, 'kode_deputi', 'kode_deputi');
    }

    public function bagians()
    {
        return $this->hasMany(Bagian::class, 'kode_biro', 'kode_biro');
    }
}
