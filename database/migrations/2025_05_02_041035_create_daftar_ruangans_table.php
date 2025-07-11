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

            $table->string('nama_ruangan');
            $table->string('kode_ruangan')->unique();
            $table->string('lokasi')->nullable();
            $table->integer('kapasitas')->nullable();
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
