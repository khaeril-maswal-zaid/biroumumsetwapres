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
        Schema::create('kerusakan_gedungs', function (Blueprint $table) {
            $table->id();
            $table->string('kode_unit')->nullable();
            $table->foreignId('kategori_kerusakan_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('lokasi', 255);
            $table->string('item', 255);
            $table->string('deskripsi', 255);  //from pengadu
            $table->json('picture', 255);
            // $table->enum('urgensi', ['rendah', 'sedang', 'tinggi']);
            $table->string('no_hp', 25);
            $table->string('kode_pelaporan', 50)->unique();
            $table->enum('status', ['pending', 'process', 'confirmed']);
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
        Schema::dropIfExists('kerusakan_gedungs');
    }
};
