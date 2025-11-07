<?php

// namespace App\Models;

// use Illuminate\Database\Eloquent\Model;

// class Bagian extends Model
// {

//     protected $primaryKey = 'kode_bagian';
//     public $incrementing = false;
//     protected $keyType = 'string';

//     protected $fillable = ['kode_bagian', 'nama_bagian', 'kode_biro'];

//     public function biro()
//     {
//         return $this->belongsTo(Biro::class, 'kode_biro', 'kode_biro');
//     }

//     public function subbagians()
//     {
//         return $this->hasMany(Subbagian::class, 'kode_bagian', 'kode_bagian');
//     }
// }
