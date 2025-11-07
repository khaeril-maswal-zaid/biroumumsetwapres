<?php

// namespace App\Models;

// use Illuminate\Database\Eloquent\Model;

// class Deputi extends Model
// {
//     protected $primaryKey = 'kode_deputi';
//     public $incrementing = false;
//     protected $keyType = 'string';

//     protected $fillable = ['kode_deputi', 'nama_deputi', 'kode_unit'];

//     public function unit()
//     {
//         return $this->belongsTo(Unit::class, 'kode_unit', 'kode_unit');
//     }

//     public function biros()
//     {
//         return $this->hasMany(Biro::class, 'kode_deputi', 'kode_deputi');
//     }
// }
