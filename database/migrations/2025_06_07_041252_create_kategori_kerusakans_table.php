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
        Schema::create('kategori_kerusakans', function (Blueprint $table) {
            $table->foreignId('instansi_id')->constrained()->cascadeOnDelete();
            $table->id();
            $table->string('kode_kerusakan', 50)->unique();
            $table->string('name', 250);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kategori_kerusakans');
    }
};
