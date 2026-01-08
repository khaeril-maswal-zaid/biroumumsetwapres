<?php

use App\Services\NotificationCleanupService;
use App\Services\NotificationService;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
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
})->dailyAt('06:00')->name('generate-notifications');
