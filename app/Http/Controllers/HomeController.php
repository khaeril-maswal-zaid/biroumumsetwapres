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
    public function index()
    {
        return Inertia::render('biroumum/home');
    }

    public function admin()
    {
        return Inertia::render('admin/home');
    }

    public function historyX()
    {

        // $rapat = PemesananRuangRapat::selectRaw("
        //     kode_booking as code,
        //     daftar_ruangan_id as title,
        //     deskripsi as info,
        //     tanggal_penggunaan as subtitle,
        //     created_at,
        //     status,
        //     user_id,
        //     no_hp,

        //     NULL as deskripsi,

        //     jam_mulai,
        //     jam_selesai,

        //     'booking' as type
        // ");

        // $kerusakan = KerusakanGedung::selectRaw("
        //     kode_pelaporan as code,
        //     item as title,
        //     lokasi as info,
        //     urgensi as subtitle,
        //     created_at,
        //     status,
        //     user_id,
        //     no_hp,

        //     deskripsi,

        //     NULL as jam_mulai,
        //     NULL as jam_selesai,

        //     'damage' as type
        // ");

        // $atk = PermintaanAtk::selectRaw("
        //     kode_pelaporan as code,
        //     status as title,
        //     daftar_kebutuhan as info,
        //     urgensi as subtitle,
        //     created_at,
        //     status,
        //     user_id,
        //     no_hp,

        //     deskripsi,

        //     NULL as jam_mulai,
        //     NULL as jam_selesai,

        //     'supplies' as type
        // ");


        // $unionQuery = $rapat->unionAll($kerusakan)->unionAll($atk);

        // $rawLogs = DB::table(DB::raw("({$unionQuery->toSql()}) as logs"))
        //     ->mergeBindings($unionQuery->getQuery())
        //     ->orderByDesc('created_at')
        //     ->limit(10)
        //     ->get();

        // $requestHistory = $rawLogs->map(function ($item) {
        //     switch ($item->type) {
        //         case 'booking':
        //             return [
        //                 'id' => 'booking',
        //                 'type' => 'Ruangan Rapat',
        //                 'code' =>  $item->code,
        //                 'title' => $item->title,
        //                 'info' => $item->info,
        //                 'subtitle' => $item->subtitle,

        //                 'created_at' => $item->created_at,
        //                 'status' => $item->status,

        //                 'user' => $item->user_id,
        //                 'no_hp' => $item->no_hp,
        //                 'deskripsi' => $item->deskripsi,

        //                 'time' => $item->jam_mulai . ' - ' . $item->jam_selesai,
        //             ];

        //         case 'damage':
        //             return [
        //                 'id' => 'damage',
        //                 'type' => 'Kerusakan',
        //                 'code' =>  $item->code,
        //                 'title' => $item->title,
        //                 'info' => $item->info,
        //                 'subtitle' => $item->subtitle,

        //                 'created_at' => $item->created_at,
        //                 'status' => $item->status,

        //                 'user' => $item->user_id,
        //                 'no_hp' => $item->no_hp,
        //                 'deskripsi' => $item->deskripsi,
        //             ];

        //         case 'supplies':
        //             return [
        //                 'id' => 'supplies',
        //                 'type' => 'ATK',
        //                 'code' =>  $item->code,
        //                 'title' => $item->title,
        //                 'info' => $item->info,
        //                 'subtitle' => $item->subtitle,

        //                 'created_at' => $item->created_at,
        //                 'status' => $item->status,

        //                 'user' => $item->user_id,
        //                 'no_hp' => $item->no_hp,
        //                 'deskripsi' => $item->deskripsi,
        //             ];
        //     }
        // });

        // Kirim ke Inertia
        return Inertia::render('biroumum/history/page', compact('requestHistory'));
    }

    public function history()
    {
        // Ambil Booking Rapat + relasi pemesan dan ruangans
        $rapat = PemesananRuangRapat::with(['pemesan', 'ruangans'])
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
                'keterangan'        => $r->keterangan,
                'time'              => $r->jam_mulai . ' - ' . $r->jam_selesai,
            ]);

        // Ambil data kerusakan + relasi pemesan
        $kerusakan = KerusakanGedung::with('pelapor')
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
                'keterangan'         => $k->keterangan,
                'time'               => null,
            ]);

        // Ambil data permintaan ATK + relasi pemesan
        $atk = PermintaanAtk::with('pemesan')
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
                'keterangan'         => $a->keterangan,
                'time'               => null,
            ]);

        // Gabungkan semuanya, urutkan, batasi 10
        $requestHistory = $rapat
            ->concat($kerusakan)
            ->concat($atk)
            ->sortByDesc('created_at')
            ->take(10)
            ->values();

        return Inertia::render('biroumum/history/page', compact('requestHistory'));
    }
}
