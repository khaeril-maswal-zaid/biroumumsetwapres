<?php

namespace App\Console\Commands;

use App\Services\NotificationService;
use Illuminate\Console\Command;

class GenerateNotifications extends Command
{
    protected $signature = 'notifications:generateX';
    protected $description = 'Generate overdue and reminder notifications.';


    /**
     * Execute the console command.
     */
    // Method yang dijalankan saat command dipanggil
    public function handle(NotificationService $notificationService)
    {
        $notificationService->generateOverdueNotifications();
        $notificationService->generateReminderNotifications();
        $notificationService->destroyOldNotifications();

        $this->info('Notifications generated & old read notifications cleaned up.');
    }
}
