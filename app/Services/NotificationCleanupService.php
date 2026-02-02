<?php

namespace App\Services;

use App\Models\Notification;

class NotificationCleanupService
{
    public function clearAutoNotifications(): int
    {
        return Notification::whereIn('type', ['overdue', 'reminder'])->delete();
    }
}
