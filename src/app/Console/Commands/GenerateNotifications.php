<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\NotificationService;

//Command generate notifikasi ini hanya untuk testing manual, karena sebenarnya sudah dijadwalkan di routes/console.php tanpa perlu dijalankan command ini.

class GenerateNotifications extends Command
{
    protected $signature = 'notifications:send';
    protected $description = 'Kirim notifikasi pengingat rapat dan overdue pending items';

    protected NotificationService $service;

    public function __construct(NotificationService $service)
    {
        parent::__construct();
        $this->service = $service;
    }

    public function handle()
    {
        $this->info('Mulai proses pengiriman notifikasi...');

        $countReminders = $this->service->sendRoomReminders();
        $this->info("Room reminders created: {$countReminders}");

        $countOverdue = $this->service->sendPendingOverdueNotifications();
        $this->info("Pending overdue notifications created: {$countOverdue}");

        $countLowStock = $this->service->sendLowStockNotifications();
        $this->info("Low stock notifications created: {$countLowStock}");

        $this->info('Selesai.');
        return 0;
    }
}
