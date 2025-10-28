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
        // Schema::create('master_pegawais', function (Blueprint $table) {
        //     $table->id();
        //     $table->string('nip');
        //     $table->string('nama');
        //     $table->foreignId('instansi_id')->nullable()->constrained('instansis');
        //     $table->foreignId('unit_id')->nullable()->constrained('units');
        //     $table->foreignId('deputi_id')->nullable()->constrained('deputis');
        //     $table->foreignId('biro_id')->nullable()->constrained('biros');
        //     $table->foreignId('bagian_id')->nullable()->constrained('bagians');
        //     $table->foreignId('subbagian_id')->nullable()->constrained('subbagians');
        //     $table->timestamps();
        // });


        Schema::create('master_pegawais', function (Blueprint $table) {
            $table->id();
            $table->string('nip')->unique();
            $table->string('nama');

            // relasi berbasis kode string
            $table->string('kode_instansi')->nullable();
            $table->string('kode_unit')->nullable();
            $table->string('kode_deputi')->nullable();
            $table->string('kode_biro')->nullable();
            $table->string('kode_bagian')->nullable();
            $table->string('kode_subbagian')->nullable();

            $table->string('jabatan')->nullable();
            $table->timestamps();

            // opsional, untuk performa
            $table->index(['kode_instansi', 'kode_unit', 'kode_deputi', 'kode_biro', 'kode_bagian', 'kode_subbagian']);
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
