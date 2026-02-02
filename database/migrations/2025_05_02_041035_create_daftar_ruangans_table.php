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
        Schema::create('daftar_ruangans', function (Blueprint $table) {
            $table->id();
            // $table->foreignId('unit')->constrained()->cascadeOnDelete();
            $table->string('kode_unit')->nullable();
            $table->string('nama_ruangan');
            $table->string('kode_ruangan')->unique();
            $table->string('lokasi')->nullable();
            $table->string('kapasitas')->nullable();
            $table->string('kapasitas_max')->nullable();
            $table->string('image')->nullable();
            $table->enum('status', ['aktif', 'maintenance', 'nonaktif'])->nullable();
            $table->json('fasilitas')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('daftar_ruangans');
    }
};
