<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('master_pegawais', function (Blueprint $table) {
            $table->id();
            $table->string('nip')->unique();
            $table->string('name');

            // relasi berbasis kode string
            $table->string('kode_instansi', 50)->nullable();
            $table->string('kode_unit', 50)->nullable();
            $table->string('kode_deputi', 50)->nullable();
            $table->string('kode_biro', 50)->nullable();
            $table->string('kode_bagian', 50)->nullable();
            $table->string('kode_subbagian', 50)->nullable();

            $table->string('jabatan')->nullable();
            $table->timestamps();

            // opsional, untuk performa
            $table->index(
                ['kode_instansi', 'kode_unit', 'kode_deputi', 'kode_biro', 'kode_bagian', 'kode_subbagian'],
                'idx_kode_unitstruktur'
            );
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('master_pegawais');
    }
};
