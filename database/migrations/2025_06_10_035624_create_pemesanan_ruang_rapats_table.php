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
        Schema::create('pemesanan_ruang_rapats', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->date('tanggal_penggunaan');
            $table->time('jam_mulai');
            $table->time('jam_selesai');
            $table->foreignId('daftar_ruangan_id')->nullable()->constrained()->nullOnDelete();
            $table->string('deskripsi', 255); //from pengadu
            $table->string('status', 255);
            $table->string('keterangan', 255); //from admin
            $table->string('no_hp', 15);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pemesanan_ruang_rapats');
    }
};
