<?php

namespace App\Http\Controllers;

use App\Models\KerusakanGedung;
use App\Models\PemesananRuangRapat;
use App\Models\PermintaanAtk;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class HomeController extends Controller
{
    private $queryRapat;
    private $queryKerusakan;
    private $queryAtk;

    public function __construct()
    {
        $user = Auth::id();

        // Ambil Booking Rapat + relasi pemesan dan ruangans
        $this->queryRapat = PemesananRuangRapat::with(['pemesan', 'ruangans'])
            ->orderByDesc('created_at')
            ->get()
            ->where('user_id', $user)
            ->take(7)
            ->map(fn($r) => [
                'id'                => 'booking',
                'type'              => 'Ruangan Rapat',
                'code'              => $r->kode_booking,
                'title'             => $r->ruangans->nama_ruangan,
                'ruangans'          => $r->ruangans,
                'info'              => $r->deskripsi,
                'daftarkebutuhan'   => null,
                'subtitle'          => Carbon::parse($r->tanggal_penggunaan)->translatedFormat('d F Y'),
                'created_at'        => $r->created_at,
                'status'            => $r->status,
                'user'              => $r->pemesan,
                'no_hp'             => $r->no_hp,
                'deskripsi'         => $r->deskripsi,
                'picture'           => null,
                'keterangan'        => $r->keterangan,
                'time'              => $r->jam_mulai . ' - ' . $r->jam_selesai,
                'kategori'           => null,
            ]);

        // Ambil data kerusakan + relasi pemesan
        $this->queryKerusakan = KerusakanGedung::with(['pelapor', 'kategori'])
            ->orderByDesc('created_at')
            ->get()
            ->where('user_id', $user)
            ->take(7)
            ->map(fn($k) => [
                'id'                 => 'damage',
                'type'               => 'Kerusakan',
                'code'               => $k->kode_pelaporan,
                'title'              => $k->item,
                'ruangans'           => null,
                'info'               => $k->lokasi,
                'daftarkebutuhan'    => null,
                'subtitle'           => $k->urgensi,
                'created_at'         => $k->created_at,
                'status'             => $k->status,
                'user'               => $k->pelapor,
                'no_hp'              => $k->no_hp,
                'deskripsi'          => $k->deskripsi,
                'picture'            => $k->picture,
                'keterangan'         => $k->keterangan,
                'time'               => null,
                'kategori'           => $k->kategori,
            ]);

        // Ambil data permintaan ATK + relasi pemesan
        $this->queryAtk = PermintaanAtk::with('pemesan')
            ->orderByDesc('created_at')
            ->get()
            ->where('user_id', $user)
            ->take(7)
            ->map(fn($a) => [
                'id'                 => 'supplies',
                'type'               => 'ATK',
                'code'               => $a->kode_pelaporan,
                'title'              => count($a->daftar_kebutuhan) . ' item',
                'ruangans'           => null,
                'info'               => collect($a->daftar_kebutuhan)->map(fn($item) => "{$item['name']} {$item['requested']} {$item['unit']}")->join(', '),
                'daftarkebutuhan'    => $a->daftar_kebutuhan,
                'subtitle'           => $a->urgensi,
                'created_at'         => $a->created_at,
                'status'             => $a->status,
                'user'               => $a->pemesan,
                'no_hp'              => $a->no_hp,
                'deskripsi'          => $a->deskripsi,
                'picture'            => null,
                'keterangan'         => $a->keterangan,
                'time'               => null,
                'kategori'           => null,
            ]);

        // Gabungkan semuanya, urutkan, batasi 10
    }

    public function index()
    {
        $requestHistory = $this->queryRapat
            ->concat($this->queryKerusakan)
            ->concat($this->queryAtk)
            ->sortByDesc('created_at')
            ->take(3)
            ->values();

        return Inertia::render('biroumum/home', compact('requestHistory'));
    }

    public function admin()
    {
        $homeData = new PemesananRuangRapat();

        $today = Carbon::today();

        $dashboardStats = [
            'roomBookings' => [
                'title' => 'Booking Ruangan',
                'icon' => 'room',
                'total' => PemesananRuangRapat::count(),
                'pending' => PemesananRuangRapat::where('status', 'pending')->count(),
                'todayBookings' => PemesananRuangRapat::whereDate('tanggal_penggunaan', $today)->count(),
            ],
            'damageReports' => [
                'title' => 'Laporan Kerusakan',
                'icon' => 'damage',
                'total' => KerusakanGedung::count(),
                'pending' => KerusakanGedung::where('status', 'pending')->count(),
                'todayBookings' => KerusakanGedung::whereDate('created_at', $today)->count(),
            ],
            'suppliesRequests' => [
                'title' => 'Permintaan ATK',
                'icon' => 'supplies',
                'total' => PermintaanAtk::count(),
                'pending' => PermintaanAtk::where('status', 'pending')->count(),
                'todayBookings' => PermintaanAtk::whereDate('created_at', $today)->count(),
            ],
        ];

        $roomActivities = PemesananRuangRapat::with(['pemesan', 'ruangans'])
            ->latest()
            ->take(15)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'type' => 'room',
                    'title' => 'Permintaan ' . ($item->ruangans->nama_ruangan ?? '-'),
                    'user' => ($item->pemesan->name ?? '-') . ' - ' . ($item->pemesan->unit_kerja ?? '-'),
                    'time' => $item->created_at->diffForHumans(),
                    'status' => $item->status,
                    'created_at' => $item->created_at,
                ];
            });

        $damageActivities = KerusakanGedung::with('pelapor')
            ->latest()
            ->take(15)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'type' => 'damage',
                    'title' => 'Kerusakan ' . $item->item . ' di ' . $item->lokasi,
                    'user' => ($item->pelapor->name ?? '-') . ' - ' . ($item->pelapor->unit_kerja ?? '-'),
                    'time' => $item->created_at->diffForHumans(),
                    'status' => $item->status,
                    'created_at' => $item->created_at,
                ];
            });

        $suppliesActivities = PermintaanAtk::with('pemesan')
            ->latest()
            ->take(15)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'type' => 'supplies',
                    'title' => 'Permintaan ATK - ' . ($item->pemesan->unit_kerja ?? '-'),
                    'user' => ($item->pemesan->name ?? '-') . ' - ' . ($item->pemesan->unit_kerja ?? '-'),
                    'time' => $item->created_at->diffForHumans(),
                    'status' => $item->status,
                    'created_at' => $item->created_at,
                ];
            });

        $recentActivities = collect()
            ->merge($roomActivities)
            ->merge($damageActivities)
            ->merge($suppliesActivities)
            ->sortByDesc('created_at')
            ->take(6) // Ambil hanya 6 data terbaru
            ->values();
        // Jika pakai inertia
        return Inertia::render('admin/home', [
            'dashboardStats' => $dashboardStats,
            'recentActivities' => $recentActivities,
            'upcomingBookings' => $homeData->upcomingBookings(),
        ]);
    }

    public function history()
    {
        $requestHistory = $this->queryRapat
            ->concat($this->queryKerusakan)
            ->concat($this->queryAtk)
            ->sortByDesc('created_at')
            ->take(7)
            ->values();

        return Inertia::render('biroumum/history/page', compact('requestHistory'));
    }
}
