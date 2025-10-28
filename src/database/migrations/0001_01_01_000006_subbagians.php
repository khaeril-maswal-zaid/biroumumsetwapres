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
        Schema::create('subbagians', function (Blueprint $table) {
            $table->string('kode_subbagian')->primary();
            $table->string('nama_subbagian')->nullable();
            $table->string('kode_bagian')->nullable(); // FK string
            $table->timestamps();
        });

        // Schema::create('subbagians', function (Blueprint $table) {
        //     $table->id();
        //     $table->integer('kode_subbagian')->unique();
        //     $table->string('nama_subbagian');
        //     $table->foreignId('bagian_id')->constrained('bagians')->cascadeOnDelete();
        //     $table->timestamps();
        // });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('subbagians');
    }
};
