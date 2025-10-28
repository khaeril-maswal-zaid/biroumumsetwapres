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
        // Schema::create('units', function (Blueprint $table) {
        //     $table->id();
        //     $table->integer('kode_unit')->unique();
        //     $table->string('nama_unit');
        //     $table->integer('kode_instansi');
        //     $table->integer('kode_cabang');
        //     $table->timestamps();
        // });

        Schema::create('units', function (Blueprint $table) {
            $table->id();
            $table->integer('kode_unit')->unique();
            $table->string('nama_unit');
            $table->foreignId('instansi_id')->constrained('instansis')->cascadeOnDelete();
            $table->integer('kode_cabang')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('units');
    }
};
