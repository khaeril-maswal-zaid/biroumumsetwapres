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
            $table->foreignId('instansi_id')->constrained()->cascadeOnDelete();
            $table->string('name', 250);
            $table->string('kode_atk', 250)->unique();
            $table->string('category', 250);
            $table->string('unit', 250);
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
