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
        // Schema::create('deputis', function (Blueprint $table) {
        //     $table->string('kode_deputi')->primary();
        //     $table->string('nama_deputi')->nullable();
        //     $table->string('kode_unit')->nullable(); // FK string
        //     $table->timestamps();
        // });;
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('deputis');
    }
};
