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
            // $table->foreignId('unit')->constrained()->cascadeOnDelete();
            $table->string('kode_unit')->nullable();
            $table->string('name', 250);
            $table->string('kode_atk', 250)->unique();
            $table->string('category', 250);
            $table->string('satuan', 250);
            $table->integer('quantity')->default(0);
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
