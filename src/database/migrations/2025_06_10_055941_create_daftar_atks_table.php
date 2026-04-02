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
        Schema::create('daftar_atks', function (Blueprint $table) {
            $table->id();
            $table->string('kode_unit')->nullable();
            $table->string('name', 250);
            $table->string('kode_atk', 250)->unique();
            $table->foreignId('kategori_atks_id')->nullable()->constrained()->nullOnDelete();
            $table->string('satuan', 250);
            $table->integer('quantity')->default(0);
            $table->integer('available_stock')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('daftar_atks');
    }
};
