<?php

namespace App\Services;

use App\Models\DaftarAtk;
use App\Models\Notification;
use App\Models\PemesananRuangRapat;
use App\Models\PermintaanAtk;
use App\Models\KerusakanGedung;
use Carbon\Carbon;

class NotificationService
{
    // mapping permissions per category
    protected array $permissionMap = [
        'room' => ['view_bookings'],
        'supplies' => ['view_supplies'],
        'damage' => ['view_damages'],
    ];

    //Mengirim notifikasi pengingat untuk penggunaan ruang rapat pada H-1 dan hari H sesuai jadwal pemesanan
    //kategori: 2
    public function sendRoomReminders(): int
    {
        $now = Carbon::now();
        $today = $now->toDateString();
        $tomorrow = $now->copy()->addDay()->toDateString();

        // Booking H-1 => tanggal_penggunaan = tomorrow
        $h1Bookings = PemesananRuangRapat::where('status', 'approved')
            ->whereDate('tanggal_penggunaan', $tomorrow)
            ->get();

        // Booking Hari H => tanggal_penggunaan = today AND jam_selesai > now
        $todayBookings = PemesananRuangRapat::where('status', 'approved')
            ->whereDate('tanggal_penggunaan', $today)
            ->whereTime('jam_selesai', '>', $now->toTimeString())
            ->get();

        $count = 0;
        foreach ($h1Bookings as $b) {
            $payload = $this->buildRoomReminderPayload($b, 'H-1');
            Notification::create($payload);
            $count++;
        }

        foreach ($todayBookings as $b) {
            $payload = $this->buildRoomReminderPayload($b, 'Harian');
            Notification::create($payload);
            $count++;
        }

        return $count;
    }

    //kategori: 2
    protected function buildRoomReminderPayload(PemesananRuangRapat $booking, string $when): array
    {
        $title = sprintf("Pengingat Jadwal Rapat — %s", $booking->kode_booking);
        $message = sprintf(
            "%s: Rapat di %s pada %s %s — %s sampai %s. Kontak: %s",
            $when === 'H-1' ? 'Besok' : 'Hari ini',
            optional($booking->daftar_ruangan)->name ?? 'Ruang Rapat',
            Carbon::parse($booking->tanggal_penggunaan)->translatedFormat('d M Y'),
            $booking->jenis_rapat === 'external' ? '(External)' : '(Internal)',
            Carbon::parse($booking->jam_mulai)->format('H:i'),
            Carbon::parse($booking->jam_selesai)->format('H:i'),
            $booking->no_hp
        );

        return [
            'kode_unit' => $booking->kode_unit,
            'permissions' => $this->permissionMap['room'],
            'type' => 'reminder',
            'category' => 'room',
            'title' => $title,
            'message' => $message,
            'priority' => 'medium',
            'action_url' => route('ruangrapat.show', $booking, false),
            'is_read' => false,
        ];
    }

    //Mengirim notifikasi overdue untuk permintaan yang belum ditindaklanjuti selama 2 hari atau lebih sejak diajukan dan masih berstatus pending
    //kategori: 3
    public function sendPendingOverdueNotifications(): int
    {
        $limitDate = Carbon::now()->subDays(2);
        $count = 0;

        // ATK
        $atkItems = PermintaanAtk::where('status', 'pending')
            ->where('created_at', '<=', $limitDate)
            ->get();

        foreach ($atkItems as $item) {
            Notification::create($this->buildAtkOverduePayload($item));
            $count++;
        }

        // Kerusakan Gedung
        $damageItems = KerusakanGedung::where('status', 'pending')
            ->where('created_at', '<=', $limitDate)
            ->get();

        foreach ($damageItems as $d) {
            Notification::create($this->buildDamageOverduePayload($d));
            $count++;
        }

        // Pemesanan Ruang Rapat (pending > 2 hari)
        $bookingItems = PemesananRuangRapat::where('status', 'pending')
            ->where('created_at', '<=', $limitDate)
            ->get();

        foreach ($bookingItems as $b) {
            Notification::create($this->buildBookingOverduePayload($b));
            $count++;
        }

        return $count;
    }

    //kategori: 3
    protected function buildAtkOverduePayload(PermintaanAtk $item): array
    {
        $title = "Permintaan ATK Belum Ditindaklanjuti";
        $message = sprintf(
            "Permintaan ATK (%s) diajukan pada %s belum mendapat tindakan. Silakan ditindaklanjuti.",
            $item->kode_pelaporan,
            Carbon::parse($item->created_at)->translatedFormat('d M Y')
        );

        return [
            'kode_unit' => $item->kode_unit,
            'permissions' => $this->permissionMap['supplies'],
            'type' => 'overdue',
            'category' => 'supplies',
            'title' => $title,
            'message' => $message,
            'priority' => 'high',
            'action_url' => route('permintaanatk.show', $item, false),
            'is_read' => false,
        ];
    }

    //kategori: 3
    protected function buildDamageOverduePayload(KerusakanGedung $d): array
    {
        $title = "Laporan Kerusakan Belum Ditindaklanjuti";
        $message = sprintf(
            "Laporan kerusakan (%s) di %s, diajukan pada %s, belum mendapat tindakan. Silakan ditindaklanjuti.",
            $d->kode_pelaporan,
            $d->lokasi,
            Carbon::parse($d->created_at)->translatedFormat('d M Y')
        );

        return [
            'kode_unit' => $d->kode_unit,
            'permissions' => $this->permissionMap['damage'],
            'type' => 'overdue',
            'category' => 'damage',
            'title' => $title,
            'message' => $message,
            'priority' => 'high',
            'action_url' => route('kerusakangedung.show', $d, false),
            'is_read' => false,
        ];
    }

    //kategori: 3
    protected function buildBookingOverduePayload(PemesananRuangRapat $b): array
    {
        $title = "Pemesanan Ruang Belum Ditindaklanjuti";
        $message = sprintf(
            "Pemesanan (kode: %s) untuk tanggal %s diajukan pada %s masih berstatus pending. Silakan ditindaklanjuti.",
            $b->kode_booking,
            Carbon::parse($b->tanggal_penggunaan)->translatedFormat('d M Y'),
            Carbon::parse($b->created_at)->translatedFormat('d M Y')
        );

        return [
            'kode_unit' => $b->kode_unit,
            'permissions' => $this->permissionMap['room'],
            'type' => 'overdue',
            'category' => 'room',
            'title' => $title,
            'message' => $message,
            'priority' => 'high',
            'action_url' => route('ruangrapat.show', $b, false),
            'is_read' => false,
        ];
    }

    //kategori: 4
    // public function sendLowStockNotifications(): int
    // {
    //     $atkItems = DaftarAtk::where('quantity', '<', 'available_stock')->get();
    //     $count = 0;
    //     foreach ($atkItems as $item) {
    //         $title = "Stok ATK Menipis";
    //         $message = sprintf(
    //             "Stok ATK (%s) saat ini %d, sudah mencapai atau di bawah threshold (%d). Silakan lakukan pengadaan.",
    //             $item->nama_barang,
    //             $item->stok,
    //             $item->threshold
    //         );
    //         Notification::create([
    //             'kode_unit' => $item->kode_unit,
    //             'permissions' => $this->permissionMap['supplies'],
    //             'type' => 'low_stock',
    //             'category' => 'supplies',
    //             'title' => $title,
    //             'message' => $message,
    //             'priority' => 'medium',
    //             'action_url' => route('permintaanatk.show', $item, false),
    //             'is_read' => false,
    //         ]);
    //         $count++;
    //     }
    //     return $count;
    // }
}
