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
        Schema::create('permintaan_atks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('kode_unit')->nullable();
            $table->json('daftar_kebutuhan')->nullable();
            $table->string('deskripsi', 255); //from pengadu
            $table->string('no_hp', 25);
            // $table->string('memo', 255);
            $table->string('kode_pelaporan', 50)->unique();
            $table->enum('status', ['pending', 'partial', 'rejected', 'confirmed']);
            $table->string('keterangan', 255)->default(''); //from admin
            $table->boolean('is_read')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('permintaan_atks');
    }
};
