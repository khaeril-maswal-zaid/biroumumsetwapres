<?php

namespace App\Models;

use App\Models\Scopes\InstansiScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Attributes\ScopedBy;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

#[ScopedBy([InstansiScope::class])]
class KerusakanGedung extends Model
{
    /** @use HasFactory<\Database\Factories\KerusakanGedungFactory> */
    use HasFactory;

    protected $casts = [
        'picture' => 'array'
    ];

    protected $fillable = [
        'user_id',
        'kode_unit',
        'kategori_kerusakan_id',
        'lokasi',
        'item',
        'deskripsi',
        'picture',
        'urgensi',
        'no_hp',
        'kode_pelaporan',
        'status',
        'keterangan',
        'is_read'
    ];

    public function scopeByPermission($query)
    {
        $user = Auth::user();
        $permissions = $user->getAllPermissions()->pluck('name');

        if ($permissions->contains('view_damages')) {
            return $query;
        }

        $bangunan = $permissions->contains('view_bangunan_damages');
        $perlengkapan = $permissions->contains('view_perlengkapan_damages');

        if ($bangunan && $perlengkapan) {
            return $query->whereHas('kategori', function ($q) {
                $q->whereIn('bagian_kategori', ['Bangunan', 'Perlengkapan']);
            });
        }
        if ($bangunan) {
            return $query->whereHas('kategori', function ($q) {
                $q->where('bagian_kategori', 'Bangunan');
            });
        }
        if ($perlengkapan) {
            return $query->whereHas('kategori', function ($q) {
                $q->where('bagian_kategori', 'Perlengkapan');
            });
        }

        return $query;
    }


    public function pelapor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }


    public function kategori(): BelongsTo
    {
        return $this->belongsTo(KategoriKerusakan::class, 'kategori_kerusakan_id');
    }

    public function logProgres(): HasMany
    {
        return $this->hasMany(LogProses::class, 'kerusakan_gedung_id')->orderBy('tanggal', 'asc');
    }


    public function getPictureAttribute($value)
    {
        if (!$value) return [];

        $paths = is_array($value) ? $value : json_decode($value, true);

        return collect($paths)->map(function ($path) {
            return route('file-view', [
                'pathFromFileDB' => $path
            ]);
        })->toArray();
    }


    public function summaryData()
    {
        $query = self::byPermission();

        $totalAllTime = $query->count();
        $totalPending = (clone $query)->where('status', 'pending')->count();
        $totalInprocess = (clone $query)->where('status', 'process')->count();
        $totalConfirmed = (clone $query)->where('status', 'confirmed')->count();

        return [
            'totalReports' => [
                'value' => $totalAllTime,
                'title' => 'Total Laporan',
            ],
            'pending' => [
                'value' => $totalPending,
                'title' => 'Menunggu',
            ],
            'processed' => [
                'value' => $totalInprocess,
                'title' => 'Proses',
            ],
            'confirmed' => [
                'value' => $totalConfirmed,
                'title' => 'Selesai',
            ],
        ];
    }

    public function statusDistribution()
    {
        $query = self::byPermission();

        return [
            [
                'name'  => 'Selesai',
                'value' => (clone $query)->where('status', 'confirmed')->count(),
                'color' => '#10b981',
            ],
            [
                'name'  => 'Proses',
                'value' => (clone $query)->where('status', 'process')->count(),
                'color' => '#ef4444',
            ],
            [
                'name'  => 'Menunggu',
                'value' => (clone $query)->where('status', 'pending')->count(),
                'color' => '#f59e0b',
            ],
        ];
    }

    public function damageTypeData()
    {
        $query = self::byPermission();
        $data =  (clone $query)->with('kategori')
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
            ->sortBy('name') // urutkan berdasarkan nama kategori A-Z
            ->values(); // ubah menjadi array numerik

        return $data;
    }

    public function reporterStats()
    {
        $query = self::byPermission();
        $topReporters =  (clone $query)->with('pelapor.pegawai.biro')
            ->get()
            ->groupBy('user_id')
            ->map(function ($group) {
                $user = $group->first();
                return [
                    'name' => $user?->pelapor->pegawai->name ?? 'Tidak Diketahui',
                    'division' => $user?->pelapor->pegawai->biro->nama_biro ?? '-',
                    'reports' => $group->count(),
                ];
            })
            ->sortByDesc('reports')
            ->take(5)
            ->values();

        $divisionReports =  (clone $query)->with('pelapor.pegawai.biro')
            ->get()
            ->groupBy(fn($item) => $item?->pelapor->pegawai->biro->nama_biro  ?? 'Tidak Diketahui')
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
        $query = self::byPermission();
        return (clone $query)->get()
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
        $query = self::byPermission();
        $now = Carbon::now();

        // Siapkan array 6 bulan terakhir
        $months = collect(range(0, 5))->map(function ($i) use ($now) {
            return $now->copy()->subMonths($i)->startOfMonth();
        })->reverse();

        $monthlyData = [];

        foreach ($months as $monthStart) {
            $monthEnd = $monthStart->copy()->endOfMonth();
            $monthLabel = $monthStart->translatedFormat('F'); // atau 'F' untuk panjang

            $query =  (clone $query)->whereBetween('created_at', [$monthStart, $monthEnd]);

            $total = $query->count();
            $monthlyData[] = [
                'month' => $monthLabel,
                'requests' => $total,
            ];
        }

        // Pisah jadi dua struktur: monthlyTrend & approvalRateTrend
        return $monthlyData;
    }

    public function urgencyData()
    {
        $query = self::byPermission();
        $colors = [
            'rendah' => '#10b981',   // green
            'sedang' => '#f59e0b',   // yellow
            'tinggi' => '#ef4444',   // red
        ];

        return (clone $query)->get()
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

    protected static function booted()
    {
        static::deleting(function ($kerusakanGedung) {
            if (is_array($kerusakanGedung->picture)) {
                foreach ($kerusakanGedung->picture as $path) {
                    if ($path && Storage::disk('public')->exists($path)) {
                        Storage::disk('public')->delete($path);
                    }
                }
            }
        });
    }
}
