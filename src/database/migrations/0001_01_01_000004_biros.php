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

        Schema::create('biros', function (Blueprint $table) {
            $table->string('kode_biro')->primary();
            $table->string('nama_biro')->nullable();
            $table->string('kode_deputi')->nullable(); // FK string
            $table->timestamps();
        });

        // Schema::create('biros', function (Blueprint $table) {
        //     $table->id();
        //     $table->integer('kode_biro')->unique();
        //     $table->string('nama_biro');
        //     $table->foreignId('deputi_id')->constrained('deputis')->cascadeOnDelete();
        //     $table->timestamps();
        // });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('biros');
    }
};
