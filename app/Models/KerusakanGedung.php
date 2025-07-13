<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;
use Illuminate\Support\Str;

class KerusakanGedung extends Model
{
    /** @use HasFactory<\Database\Factories\KerusakanGedungFactory> */
    use HasFactory;

    protected $casts = [
        'picture' => 'array'
    ];

    protected $fillable = [
        'user_id',
        'lokasi',
        'item',
        'deskripsi',
        'picture',
        'urgensi',
        'no_hp',
        'kode_pelaporan',
        'status',
        'keterangan',
    ];

    public function pelapor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }


    public function kategori(): BelongsTo
    {
        return $this->belongsTo(KategoriKerusakan::class, 'kategori_kerusakan_id');
    }

    public function summaryData()
    {
        $now = Carbon::now();
        $startOfThisMonth = $now->copy()->startOfMonth();
        $startOfLastMonth = $now->copy()->subMonth()->startOfMonth();
        $endOfLastMonth = $now->copy()->subMonth()->endOfMonth();

        // Total semua data
        $totalAllTime = $this->count();
        $totalPending = $this->where('status', 'pending')->count();
        $totalConfirmed = $this->where('status', 'confirmed')->count();
        $totalCancelled = $this->where('status', 'cancelled')->count();

        // Bulan ini
        $thisMonthTotal = $this->whereBetween('created_at', [$startOfThisMonth, $now])->count();
        $thisMonthPending = $this->where('status', 'pending')->whereBetween('created_at', [$startOfThisMonth, $now])->count();
        $thisMonthConfirmed = $this->where('status', 'confirmed')->whereBetween('created_at', [$startOfThisMonth, $now])->count();
        $thisMonthCancelled = $this->where('status', 'cancelled')->whereBetween('created_at', [$startOfThisMonth, $now])->count();

        // Bulan lalu
        $lastMonthTotal = $this->whereBetween('created_at', [$startOfLastMonth, $endOfLastMonth])->count();
        $lastMonthPending = $this->where('status', 'pending')->whereBetween('created_at', [$startOfLastMonth, $endOfLastMonth])->count();
        $lastMonthConfirmed = $this->where('status', 'confirmed')->whereBetween('created_at', [$startOfLastMonth, $endOfLastMonth])->count();
        $lastMonthCancelled = $this->where('status', 'cancelled')->whereBetween('created_at', [$startOfLastMonth, $endOfLastMonth])->count();

        return [
            'totalReports' => [
                'value' => $totalAllTime,
                'change' => $thisMonthTotal - $lastMonthTotal,
                'trend' => ($thisMonthTotal - $lastMonthTotal) >= 0 ? 'up' : 'down',
                'title' => 'Total Laporan',
            ],
            'pending' => [
                'value' => $totalPending,
                'change' => $thisMonthPending - $lastMonthPending,
                'trend' => ($thisMonthPending - $lastMonthPending) >= 0 ? 'up' : 'down',
                'title' => 'Menunggu',
            ],
            'confirmed' => [
                'value' => $totalConfirmed,
                'change' => $thisMonthConfirmed - $lastMonthConfirmed,
                'trend' => ($thisMonthConfirmed - $lastMonthConfirmed) >= 0 ? 'up' : 'down',
                'title' => 'Selesai',
            ],
            'cancelled' => [
                'value' => $totalCancelled,
                'change' => $thisMonthCancelled - $lastMonthCancelled,
                'trend' => ($thisMonthCancelled - $lastMonthCancelled) >= 0 ? 'up' : 'down',
                'title' => 'Dibatalkan',
            ],
        ];
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

    public function damageTypeData()
    {
        $data = $this->with('kategori')
            ->get()
            ->groupBy('kategori_kerusakan_id')
            ->map(function ($items) {
                $kategori = $items->first()->kategori;
                return [
                    'name' => $kategori?->name ?? 'Tanpa Kategori',
                    'value' => $items->count(),
                    'color' => '#' . substr(md5($kategori?->name ?? Str::random(5)), 0, 6),
                ];
            })
            ->values(); // biar hasilnya array numerik

        return $data;
    }

    public function reporterStats()
    {
        $topReporters = $this->with('pelapor')
            ->get()
            ->groupBy('user_id')
            ->map(function ($group) {
                $user = $group->first()->pelapor;
                return [
                    'name' => $user?->name ?? 'Tidak Diketahui',
                    'division' => $user?->unit_kerja ?? '-',
                    'reports' => $group->count(),
                ];
            })
            ->sortByDesc('reports')
            ->take(5)
            ->values();

        $divisionReports = $this->with('pelapor')
            ->get()
            ->groupBy(fn($item) => $item->pelapor?->unit_kerja ?? 'Tidak Diketahui')
            ->map(function ($group, $division) {
                return [
                    'division' => $division,
                    'reports' => $group->count(),
                    'resolved' => $group->where('status', 'confirmed')->count(),
                ];
            })
            ->values();

        return [
            'topReportersData' => $topReporters,
            'divisionReports' => $divisionReports,
        ];
    }

    public function locationData()
    {
        return $this->get()
            ->groupBy('lokasi')
            ->sortByDesc('reports')
            ->map(function ($group, $location) {
                return [
                    'location' => $location,
                    'reports' => $group->count(),
                    'resolved' => $group->where('status', 'confirmed')->count(),
                ];
            })
            ->values();
    }

    public function monthlyTrends()
    {
        $now = Carbon::now();

        // Siapkan array 6 bulan terakhir
        $months = collect(range(0, 5))->map(function ($i) use ($now) {
            return $now->copy()->subMonths($i)->startOfMonth();
        })->reverse();

        $monthlyData = [];

        foreach ($months as $monthStart) {
            $monthEnd = $monthStart->copy()->endOfMonth();
            $monthLabel = $monthStart->translatedFormat('F'); // atau 'F' untuk panjang

            $query = $this->whereBetween('created_at', [$monthStart, $monthEnd]);

            $total = $query->count();
            $approved = $query->where('status', 'approved')->count();
            $rejected = $query->where('status', 'rejected')->count();

            $monthlyData[] = [
                'month' => $monthLabel,
                'requests' => $total,
                'approved' => $approved,
                'rejected' => $rejected,
                'rate' => $total > 0 ? round(($approved / $total) * 100) : 0,
            ];
        }

        // Pisah jadi dua struktur: monthlyTrend & approvalRateTrend
        return [
            'monthlyTrend' => collect($monthlyData)->map(function ($item) {
                return [
                    'month' => $item['month'],
                    'requests' => $item['requests'],
                    'approved' => $item['approved'],
                    'rejected' => $item['rejected'],
                ];
            }),

            'approvalRateTrend' => collect($monthlyData)->map(function ($item) {
                return [
                    'month' => $item['month'],
                    'rate' => $item['rate'],
                ];
            }),
        ];
    }

    public function urgencyData()
    {
        $colors = [
            'rendah' => '#10b981',   // green
            'sedang' => '#f59e0b',   // yellow
            'tinggi' => '#ef4444',   // red
        ];

        return $this->get()
            ->groupBy('urgensi')
            ->map(function ($group, $urgensi) use ($colors) {
                return [
                    'name' => ucfirst($urgensi),
                    'value' => $group->count(),
                    'color' => $colors[$urgensi] ?? '#999999',
                ];
            })
            ->values();
    }
}
