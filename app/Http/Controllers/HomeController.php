<?php

namespace App\Http\Controllers;

use App\Models\KerusakanGedung;
use App\Models\PemesananRuangRapat;
use App\Models\PermintaanAtk;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class HomeController extends Controller
{
    private $queryRapat;
    private $queryKerusakan;
    private $queryAtk;

    public function __construct()
    {
        // Ambil Booking Rapat + relasi pemesan dan ruangans
        $this->queryRapat = PemesananRuangRapat::with(['pemesan', 'ruangans'])
            ->orderByDesc('created_at')
            ->get()
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
            ]);

        // Ambil data kerusakan + relasi pemesan
        $this->queryKerusakan = KerusakanGedung::with('pelapor')
            ->orderByDesc('created_at')
            ->get()
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
            ]);

        // Ambil data permintaan ATK + relasi pemesan
        $this->queryAtk = PermintaanAtk::with('pemesan')
            ->orderByDesc('created_at')
            ->get()
            ->map(fn($a) => [
                'id'                 => 'supplies',
                'type'               => 'ATK',
                'code'               => $a->kode_pelaporan,
                'title'              => count($a->daftar_kebutuhan) . ' item',
                'ruangans'           => null,
                'info'               => collect($a->daftar_kebutuhan)->map(fn($item) => "{$item['name']} {$item['quantity']} {$item['unit']}")->join(', '),
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
        return Inertia::render('admin/home');
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

    public function sementara()
    {


        return Inertia::render('admin/permissions/page');
    }
}
