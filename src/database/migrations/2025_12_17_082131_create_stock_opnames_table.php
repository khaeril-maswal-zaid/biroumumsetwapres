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
        Schema::create('stock_opnames', function (Blueprint $table) {
            $table->id();
            $table->string('kode_unit')->nullable();
            $table->foreignId('daftar_atk_id')->nullable()->constrained()->nullOnDelete();
            $table->integer('quantity');
            $table->enum('type', ['Perolehan', 'Pemakaian']);
            $table->foreignId('permintaan_atk_id')->nullable()->constrained()->nullOnDelete();
            $table->integer('unit_price');
            $table->integer('total_price');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stock_opnames');
    }
};
