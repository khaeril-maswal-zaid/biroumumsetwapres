<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\NotificationService;

class SendNotifications extends Command
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

        $this->info('Selesai.');
        return 0;
    }
}
