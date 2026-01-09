<?php

namespace App\Models;

use App\Models\Scopes\InstansiScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Attributes\ScopedBy;

#[ScopedBy([InstansiScope::class])]
class PermintaanAtk extends Model
{
    /** @use HasFactory<\Database\Factories\PermintaanAtkFactory> */
    use HasFactory;

    protected $casts = [
        'daftar_kebutuhan' => 'array'
    ];

    protected $fillable = [
        'user_id',
        'kode_unit',
        'daftar_kebutuhan',
        'deskripsi',
        'no_hp',
        'memo',
        'kode_pelaporan',
        'status',
        'keterangan',
        'is_read'
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
            'pending' => 'Menunggu',
            'process' => 'Proses',
            'confirmed' => 'Selesai',
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

            $monthlyData[] = [
                'month' => $monthLabel,
                'requests' => $total,
            ];
        }

        // Pisah jadi dua struktur: monthlyTrend & approvalRateTrend
        return $monthlyData;
    }

    public function topUsersStats()
    {
        $data = $this->with('pemesan.pegawai.biro')
            ->get()
            ->groupBy('user_id')
            ->map(function ($rows, $userId) {
                $user = $rows->first();
                $requests = $rows->count();
                $approved = $rows->where('status', 'approved')->count();
                $rate = $requests > 0 ? round(($approved / $requests) * 100) : 0;

                return [
                    'name' => $user?->pemesan->pegawai->name ?? 'Tidak diketahui',
                    'division' => $user?->pemesan->pegawai->biro->nama_biro ?? '-',
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
        $data = $this->with('pemesan.pegawai.biro')
            ->get()
            ->filter(fn($row) => $row->pemesan && $row->pemesan->pegawai->biro->nama_biro) // filter yang punya divisi
            ->groupBy(fn($row) => $row->pemesan->pegawai->biro->nama_biro)
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
            'confirmed' => ['name' => 'Selesai', 'color' => '#10b981'],
            // 'partial'  => ['name' => 'Sebagian', 'color' => '#f59e0b'],
            'pending'  => ['name' => 'Menunggu', 'color' => '#3b82f6'],
            // 'rejected' => ['name' => 'Ditolak', 'color' => '#ef4444'],
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

    public function urgencyData()
    {
        $colors = [
            'normal' => '#10b981',   // green
            'mendesak' => '#f59e0b',   // yellow
            'segera' => '#ef4444',   // red
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
