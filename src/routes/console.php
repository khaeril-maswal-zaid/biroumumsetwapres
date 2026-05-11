<?php

use App\Services\NotificationCleanupService;
use App\Services\NotificationService;
use Illuminate\Support\Facades\Schedule;

/*
|--------------------------------------------------------------------------
| Notification Auto Cleanup (05:00)
|--------------------------------------------------------------------------
*/

Schedule::call(function () {
    app(NotificationCleanupService::class)->clearAutoNotifications();
})->dailyAt('05:00')->name('clear-auto-notifications');


/*
|--------------------------------------------------------------------------
| Generate Notifications (06:00)
|--------------------------------------------------------------------------
*/
Schedule::call(function () {
    $service = app(NotificationService::class);

    $service->sendRoomReminders();
    $service->sendPendingOverdueNotifications();
    $service->sendLowStockNotifications();
})->dailyAt('06:00')->name('generate-notifications');
