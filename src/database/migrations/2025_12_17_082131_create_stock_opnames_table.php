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

            // jumlah event (masuk / keluar)
            $table->integer('quantity');

            // sisa stok per batch (KHUSUS Perolehan)
            $table->integer('remaining_quantity')->nullable();

            $table->enum('type', ['Perolehan', 'Pemakaian']);
            $table->foreignId('permintaan_atk_id')->nullable()->constrained()->nullOnDelete();

            // relasi FIFO (Pemakaian → Perolehan)
            $table->foreignId('source_stockopname_id')->nullable();

            $table->integer('unit_price');
            $table->integer('total_price');

            $table->index(['daftar_atk_id', 'type']);
            $table->index(['daftar_atk_id', 'type', 'remaining_quantity']);

            $table->timestamps();
        });

        Schema::table('stock_opnames', function (Blueprint $table) {
            $table->foreign('source_stockopname_id')
                ->references('id')
                ->on('stock_opnames')
                ->nullOnDelete();
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
