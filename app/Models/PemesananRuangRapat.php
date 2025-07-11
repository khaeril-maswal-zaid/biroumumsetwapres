<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PemesananRuangRapat extends Model
{
    /** @use HasFactory<\Database\Factories\PemesananRuangRapatFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'tanggal_penggunaan',
        'jam_mulai',
        'jam_selesai',
        'daftar_ruangan_id',
        'deskripsi',
        'no_hp',
        'kode_booking',
        'status',
        'keterangan',
    ];

    public function ruangans(): BelongsTo
    {
        return $this->belongsTo(DaftarRuangan::class, 'daftar_ruangan_id');
    }

    public function pemesan(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function summaryData(): array
    {
        $now = Carbon::now();
        $startOfThisMonth = $now->copy()->startOfMonth();
        $startOfLastMonth = $now->copy()->subMonth()->startOfMonth();
        $endOfLastMonth = $now->copy()->subMonth()->endOfMonth();

        // Total data all time
        $totalAllTime = $this->count();
        $totalApproved = $this->where('status', 'confirmed')->count();
        $totalRejected = $this->where('status', 'cancelled')->count();
        $totalPending  = $this->where('status', 'pending')->count();

        // Data bulan ini
        $thisMonthTotal = $this->whereBetween('tanggal_penggunaan', [$startOfThisMonth, $now])->count();
        $thisMonthApproved = $this->where('status', 'confirmed')->whereBetween('tanggal_penggunaan', [$startOfThisMonth, $now])->count();
        $thisMonthRejected = $this->where('status', 'cancelled')->whereBetween('tanggal_penggunaan', [$startOfThisMonth, $now])->count();
        $thisMonthPending  = $this->where('status', 'pending')->whereBetween('tanggal_penggunaan', [$startOfThisMonth, $now])->count();

        // Data bulan lalu
        $lastMonthTotal = $this->whereBetween('tanggal_penggunaan', [$startOfLastMonth, $endOfLastMonth])->count();
        $lastMonthApproved = $this->where('status', 'confirmed')->whereBetween('tanggal_penggunaan', [$startOfLastMonth, $endOfLastMonth])->count();
        $lastMonthRejected = $this->where('status', 'cancelled')->whereBetween('tanggal_penggunaan', [$startOfLastMonth, $endOfLastMonth])->count();
        $lastMonthPending  = $this->where('status', 'pending')->whereBetween('tanggal_penggunaan', [$startOfLastMonth, $endOfLastMonth])->count();

        // Hitung change dan trend
        return  [
            'totalBookings' => [
                'value' => $totalAllTime,
                'change' => $thisMonthTotal - $lastMonthTotal,
                'trend' => ($thisMonthTotal - $lastMonthTotal) >= 0 ? 'up' : 'down',
                'title' => 'Total Pemesanan',
            ],
            'approved' => [
                'value' => $totalApproved,
                'change' => $thisMonthApproved - $lastMonthApproved,
                'trend' => ($thisMonthApproved - $lastMonthApproved) >= 0 ? 'up' : 'down',
                'title' => 'Disetujui',
            ],
            'rejected' => [
                'value' => $totalRejected,
                'change' => $thisMonthRejected - $lastMonthRejected,
                'trend' => ($thisMonthRejected - $lastMonthRejected) >= 0 ? 'up' : 'down',
                'title' => 'Ditolak',
            ],
            'pending' => [
                'value' => $totalPending,
                'change' => $thisMonthPending - $lastMonthPending,
                'trend' => ($thisMonthPending - $lastMonthPending) >= 0 ? 'up' : 'down',
                'title' => 'Menunggu',
            ],
        ];
    }

    public function peakHours()
    {
        // Pakai array biasa
        $hours = [];
        foreach (range(8, 16) as $h) {
            $hours[str_pad($h, 2, '0', STR_PAD_LEFT) . ':00'] = 0;
        }

        $bookings = $this->all(['jam_mulai', 'jam_selesai']);

        foreach ($bookings as $booking) {
            $start = Carbon::parse($booking->jam_mulai);
            $end = Carbon::parse($booking->jam_selesai);

            while ($start < $end) {
                $hourKey = $start->format('H:00');
                if (isset($hours[$hourKey])) {
                    $hours[$hourKey]++;
                }
                $start->addHour();
            }
        }

        // Kembalikan dalam format collection untuk FE
        return collect($hours)->map(function ($count, $hour) {
            return [
                'hour' => $hour,
                'bookings' => $count,
            ];
        })->values();
    }

    public function weeklyPattern()
    {
        // Inisialisasi hari Senin–Minggu
        $hari = [
            'Senin' => 0,
            'Selasa' => 0,
            'Rabu' => 0,
            'Kamis' => 0,
            'Jumat' => 0,
            'Sabtu' => 0,
            'Minggu' => 0,
        ];

        $data = $this->all(['tanggal_penggunaan']);

        foreach ($data as $item) {
            $tanggal = Carbon::parse($item->tanggal_penggunaan);
            $namaHari = $tanggal->translatedFormat('l'); // Misalnya "Monday"
            $indoHari = match ($namaHari) {
                'Monday' => 'Senin',
                'Tuesday' => 'Selasa',
                'Wednesday' => 'Rabu',
                'Thursday' => 'Kamis',
                'Friday' => 'Jumat',
                'Saturday' => 'Sabtu',
                'Sunday' => 'Minggu',
            };
            $hari[$indoHari]++;
        }

        return collect($hari)->map(function ($count, $day) {
            return [
                'day' => $day,
                'bookings' => $count,
            ];
        })->values();
    }

    public function monthlyTrend()
    {
        $bulan = [
            1 => 'Jan',
            2 => 'Feb',
            3 => 'Mar',
            4 => 'Apr',
            5 => 'Mei',
            6 => 'Jun',
            7 => 'Jul',
            8 => 'Agu',
            9 => 'Sep',
            10 => 'Okt',
            11 => 'Nov',
            12 => 'Des',
        ];

        $data = $this->all(['tanggal_penggunaan', 'status']);

        // Awal tahun hingga akhir bulan sekarang
        $grouped = $data->groupBy(function ($item) {
            return Carbon::parse($item->tanggal_penggunaan)->month;
        });

        $result = [];

        // foreach (range(1, 12) as $i) {
        foreach (range(1, now()->month) as $i) {

            $records = $grouped[$i] ?? collect();
            $bookings = $records->count();
            $approved = $records->where('status', 'confirmed')->count();
            $rejected = $records->where('status', 'cancelled')->count();

            $result[] = [
                'month' => $bulan[$i],
                'bookings' => $bookings,
                'approved' => $approved,
                'rejected' => $rejected,
            ];
        }

        return collect($result);
    }

    public function topUsers($limit = 7)
    {
        $data = $this->with('pemesan')
            ->whereNotNull('user_id')
            ->get()
            ->groupBy('user_id')
            ->map(function ($items) {
                $user = $items->first()->pemesan;
                $bookings = $items->count();

                // Hitung total jam
                $hours = $items->sum(function ($item) {
                    $start = Carbon::parse($item->jam_mulai);
                    $end = Carbon::parse($item->jam_selesai);
                    return $end->floatDiffInHours($start);
                });

                return [
                    'name' => $user->name,
                    'division' => $user->unit_kerja,
                    'bookings' => $bookings,
                    'hours' => round($hours),
                    'avgDuration' => round($hours / $bookings, 1),
                ];
            })
            ->sortByDesc('bookings')
            ->take($limit)
            ->values();

        return $data;
    }

    public function divisionUsage()
    {
        $data = $this->with('pemesan')
            ->whereNotNull('user_id')
            ->get();

        $grouped = $data->groupBy(fn($item) => $item->pemesan->unit_kerja);

        $result = $grouped->map(function ($items, $division) {
            $bookings = $items->count();

            $hours = $items->sum(function ($item) {
                $start = Carbon::parse($item->jam_mulai);
                $end = Carbon::parse($item->jam_selesai);
                return $end->floatDiffInHours($start);
            });

            return [
                'division' => $division,
                'bookings' => $bookings,
                'hours' => round($hours),
            ];
        });

        return $result->sortByDesc('bookings')->values();
    }

    public function penggunaanRuangan()
    {
        $data = $this->with('ruangans')
            ->whereNotNull('daftar_ruangan_id')
            ->get();

        // Group by ruangan
        $grouped = $data->groupBy('daftar_ruangan_id');

        // Total bookings dari semua ruangan
        $totalBookings = $data->count();

        $result = $grouped->map(function ($items) use ($totalBookings) {
            $room = $items->first()->ruangans;
            $bookings = $items->count();

            $hours = $items->sum(function ($item) {
                $start = Carbon::parse($item->jam_mulai);
                $end = Carbon::parse($item->jam_selesai);
                return $end->floatDiffInHours($start);
            });

            $percent = $totalBookings > 0 ? round(($bookings / $totalBookings) * 100) : 0;

            return [
                'room' => $room->nama_ruangan,
                'bookings' => $bookings,
                'hours' => round($hours),
                'percent' => $percent,
                'capacity' => $room->kapasitas,
            ];
        });

        return $result->sortByDesc('bookings')->values();
    }

    public function statusDistribution()
    {
        return [
            [
                'name'  => 'Disetujui',
                'value' => $this->where('status', 'confirmed')->count(),
                'color' => '#10b981',
            ],
            [
                'name'  => 'Ditolak',
                'value' => $this->where('status', 'cancelled')->count(),
                'color' => '#ef4444',
            ],
            [
                'name'  => 'Menunggu',
                'value' => $this->where('status', 'pending')->count(),
                'color' => '#f59e0b',
            ],
        ];
    }
}
