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
        Schema::create('pengambilan_atk_details', function (Blueprint $table) {
            $table->id();

            $table->foreignId('pengambilan_atk_id')->constrained()->cascadeOnDelete();
            $table->string('item_id');
            $table->string('item_name');
            $table->string('satuan')->nullable();
            $table->integer('qty_diambil');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pengambilan_atk_details');
    }
};
