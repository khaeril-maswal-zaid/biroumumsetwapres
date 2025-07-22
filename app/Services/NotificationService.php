<?php

namespace App\Services;

use App\Models\PemesananRuangRapat;
use App\Models\PermintaanAtk;
use App\Models\KerusakanGedung;
use App\Models\Notification;
use Carbon\Carbon;
use Illuminate\Support\Str;

class NotificationService
{
    public function generateOverdueNotifications()
    {
        $this->checkPendingRooms();
        $this->checkPendingAtk();
        $this->checkPendingDamages();
    }

    public function generateReminderNotifications()
    {
        $this->checkRoomReminders();
    }

    public function destroyOldNotifications()
    {
        $this->deleteOldReadNotifications();
    }


    protected function checkPendingRooms()
    {
        $threshold = Carbon::now()->subHours(20);
        $bookings = PemesananRuangRapat::with('pemesan')
            ->where('status', 'pending')
            ->where('created_at', '<=', $threshold)
            ->get();

        //dd()

        foreach ($bookings as $booking) {
            $this->createNotification([
                'category' => 'room',
                'type' => 'overdue',
                'title' => 'Permintaan Ruang Tertunda',
                'message' => "Permintaan ruang {$booking->ruangans->nama_ruangan} oleh {$booking->pemesan->name} belum ditanggapi sejak lebih dari 20 jam",
                'priority' => 'high',
                'action_url' => '/admin/bookings',
            ]);
        }
    }

    protected function checkPendingAtk()
    {
        $threshold = Carbon::now()->subHours(20);
        $requests = PermintaanAtk::with('pemesan')
            ->where('status', 'pending')
            ->where('created_at', '<=', $threshold)
            ->get();

        foreach ($requests as $request) {
            $this->createNotification([
                'category' => 'supplies',
                'type' => 'overdue',
                'title' => 'Permintaan ATK Tertunda',
                'message' => "Permintaan ATK dari {$request->pemesan->unit_kerja} belum ditanggapi lebih dari 20 jam",
                'priority' => 'high',
                'action_url' => '/admin/supplies',
            ]);
        }
    }

    protected function checkPendingDamages()
    {
        $threshold = Carbon::now()->subHours(20);
        $reports = KerusakanGedung::with('pelapor')
            ->where('status', 'pending')
            ->where('created_at', '<=', $threshold)
            ->get();

        foreach ($reports as $report) {
            $this->createNotification([
                'category' => 'damage',
                'type' => 'overdue',
                'title' => 'Laporan Kerusakan Tertunda',
                'message' => "Laporan kerusakan {$report->item} di {$report->lokasi} belum ditanggapi sejak lebih dari 20 jam",
                'priority' => 'high',
                'action_url' => '/admin/damages',
            ]);
        }
    }

    protected function checkRoomReminders()
    {
        $today = Carbon::today();

        foreach ([1, 2] as $daysAhead) {
            $targetDate = $today->copy()->addDays($daysAhead);

            $bookings = PemesananRuangRapat::with(['pemesan', 'ruangans'])
                ->where('status', 'confirmed')
                ->whereDate('tanggal_penggunaan', $targetDate)
                ->get();

            foreach ($bookings as $booking) {
                $this->createNotification([
                    'category' => 'room',
                    'type' => 'reminder',
                    'title' => "Pengingat Ruangan H-{$daysAhead}",
                    'message' => "Ruang {$booking->ruangans->nama_ruangan} akan digunakan pada {$targetDate->translatedFormat('d M')} pukul {$booking->jam_mulai} oleh {$booking->pemesan->name}",
                    'priority' => 'medium',
                    'action_url' => '/admin/bookings',
                ]);
            }
        }
    }

    protected function createNotification(array $data)
    {
        // Hindari duplikasi (bisa pakai hash dari message atau unique key)
        $exists = Notification::where('message', $data['message'])->whereDate('created_at', Carbon::today())->exists();

        if (!$exists) {
            Notification::create([
                'type' => $data['type'],
                'category' => $data['category'],
                'title' => $data['title'],
                'message' => $data['message'],
                'priority' => $data['priority'],
                'action_url' => $data['action_url'] ?? null,
                'is_read' => false,
            ]);
        }
    }

    protected function deleteOldReadNotifications()
    {
        Notification::truncate();
    }
}
