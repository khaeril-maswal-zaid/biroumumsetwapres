<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;

class PermintaanAtk extends Model
{
    /** @use HasFactory<\Database\Factories\PermintaanAtkFactory> */
    use HasFactory;

    protected $casts = [
        'daftar_kebutuhan' => 'array'
    ];

    protected $fillable = [
        'user_id',
        'daftar_kebutuhan',
        'deskripsi',
        'urgensi',
        'no_hp',
        'kode_pelaporan',
        'status',
        'keterangan',
    ];

    public function pemesan(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function summaryData()
    {
        $now = Carbon::now();
        $startOfThisMonth = $now->copy()->startOfMonth();
        $startOfLastMonth = $now->copy()->subMonth()->startOfMonth();
        $endOfLastMonth = $now->copy()->subMonth()->endOfMonth();

        $statuses = [
            'approved' => 'Disetujui',
            'partial' => 'Sebagian',
            'pending' => 'Menunggu',
            'rejected' => 'Ditolak',
        ];

        $totalAllTime = $this->count();
        $thisMonthTotal = $this->whereBetween('created_at', [$startOfThisMonth, $now])->count();
        $lastMonthTotal = $this->whereBetween('created_at', [$startOfLastMonth, $endOfLastMonth])->count();

        $result = [
            'totalRequests' => [
                'title' => 'Total Permintaan',
                'value' => $totalAllTime,
                'change' => $thisMonthTotal - $lastMonthTotal,
                'trend' => ($thisMonthTotal - $lastMonthTotal) >= 0 ? 'up' : 'down',
            ]
        ];

        foreach ($statuses as $status => $label) {
            $total = $this->where('status', $status)->count();
            $thisMonth = $this->where('status', $status)->whereBetween('created_at', [$startOfThisMonth, $now])->count();
            $lastMonth = $this->where('status', $status)->whereBetween('created_at', [$startOfLastMonth, $endOfLastMonth])->count();

            $result[$status] = [
                'title' => $label,
                'value' => $total,
                'change' => $thisMonth - $lastMonth,
                'trend' => ($thisMonth - $lastMonth) >= 0 ? 'up' : 'down',
            ];
        }

        return $result;
    }

    public function itemComparison()
    {
        $items = [];

        $this->select('daftar_kebutuhan')
            ->whereNotNull('daftar_kebutuhan')
            ->get()
            ->each(function ($row) use (&$items) {
                $kebutuhan = $row->daftar_kebutuhan;

                foreach ($kebutuhan as $item) {
                    $name = $item['name'];
                    $requested = (int) $item['requested'];
                    $approved = (int) $item['approved'];

                    if (!isset($items[$name])) {
                        $items[$name] = ['requested' => 0, 'approved' => 0];
                    }

                    $items[$name]['requested'] += $requested;
                    $items[$name]['approved'] += $approved;
                }
            });

        // Konversi ke bentuk final
        return collect($items)->map(function ($item, $name) {
            $requested = $item['requested'];
            $approved = $item['approved'];
            $rate = $requested > 0 ? round(($approved / $requested) * 100) : 0;

            return [
                'name' => $name,
                'requested' => $requested,
                'approved' => $approved,
                'approvalRate' => $rate,
            ];
        })->sortByDesc('requested')->values();
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
            $monthLabel = $monthStart->translatedFormat('M'); // atau 'F' untuk panjang

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

    public function topUsersStats()
    {
        $data = $this->with('pemesan')
            ->get()
            ->groupBy('user_id')
            ->map(function ($rows, $userId) {
                $user = $rows->first()->pemesan;
                $requests = $rows->count();
                $approved = $rows->where('status', 'approved')->count();
                $rate = $requests > 0 ? round(($approved / $requests) * 100) : 0;

                return [
                    'name' => $user->name ?? 'Tidak diketahui',
                    'division' => $user->unit_kerja ?? '-',
                    'requests' => $requests,
                    'approved' => $approved,
                    'rate' => $rate,
                ];
            })
            ->sortByDesc('requests')
            ->values()
            ->take(5); // ambil 5 teratas

        return $data;
    }

    public function divisionStats()
    {
        $data = $this->with('pemesan')
            ->get()
            ->filter(fn($row) => $row->pemesan && $row->pemesan->unit_kerja) // filter yang punya divisi
            ->groupBy(fn($row) => $row->pemesan->unit_kerja)
            ->map(function ($rows, $division) {
                $requests = $rows->count();
                $approved = $rows->where('status', 'approved')->count();
                $rate = $requests > 0 ? round(($approved / $requests) * 100) : 0;

                return [
                    'division' => $division,
                    'requests' => $requests,
                    'approved' => $approved,
                    'rate' => $rate,
                ];
            })
            ->sortByDesc('requests')
            ->values();

        return $data;
    }

    public function statusDistribution()
    {
        $labels = [
            'approved' => ['name' => 'Disetujui', 'color' => '#10b981'],
            'partial'  => ['name' => 'Sebagian', 'color' => '#f59e0b'],
            'pending'  => ['name' => 'Menunggu', 'color' => '#3b82f6'],
            'rejected' => ['name' => 'Ditolak', 'color' => '#ef4444'],
        ];

        return collect($labels)->map(function ($label, $status) {
            $value = $this->where('status', $status)->count();

            return [
                'name' => $label['name'],
                'value' => $value,
                'color' => $label['color'],
            ];
        })->values(); // ubah ke array biasa
    }
}
