<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Jenis Notifikasi:
     * 1. New Request
     *    Menampilkan seluruh permintaan baru yang masih berstatus *pending*.
     *    (Ditangani langsung oleh controller)
     *
     * 2. Reminder
     *    Pengingat penggunaan ruang rapat pada H-1 dan hari H sesuai jadwal pemesanan.
     *    (Dijalankan oleh scheduler setiap hari pukul 06:00)
     *
     * 3. Overdue
     *    Notifikasi untuk permintaan yang belum ditindaklanjuti selama 2 hari atau lebih sejak diajukan
     *    dan masih berstatus *pending*.
     *    (Dijalankan oleh scheduler setiap hari pukul 06:00)
     */

    public function up(): void
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->string('kode_unit')->nullable();
            $table->json('permissions')->nullable();
            $table->string('type'); // overdue, reminder, new
            $table->string('category'); // room, supplies, damage
            $table->string('title');
            $table->text('message');
            $table->string('priority')->default('medium'); // high, medium, low
            $table->string('action_url')->nullable();
            $table->boolean('is_read')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
