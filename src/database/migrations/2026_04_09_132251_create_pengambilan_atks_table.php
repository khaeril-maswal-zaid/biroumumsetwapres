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
        Schema::create('pengambilan_atks', function (Blueprint $table) {
            $table->id();

            $table->foreignId('permintaan_atk_id')->constrained()->cascadeOnDelete();
            $table->string('nama_pengambil');
            $table->string('no_hp', 25)->nullable();
            $table->date('tanggal_ambil');
            $table->string('keterangan')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pengambilan_atks');
    }
};
