<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Subbagian extends Model
{
    protected $primaryKey = 'kode_subbagian';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = ['kode_subbagian', 'nama_subbagian', 'kode_bagian'];

    public function bagian()
    {
        return $this->belongsTo(Bagian::class, 'kode_bagian', 'kode_bagian');
    }
}
