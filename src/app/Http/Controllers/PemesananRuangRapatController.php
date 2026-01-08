<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

use App\Models\PemesananRuangRapat;
use App\Http\Requests\StorePemesananRuangRapatRequest;
use App\Http\Requests\UpdatePemesananRuangRapatRequest;
use App\Models\DaftarRuangan;
use App\Models\Notification;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Response;

class PemesananRuangRapatController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $data = [
            'bookingRooms' => PemesananRuangRapat::with('ruangans')->with('pemesan.pegawai')->latest()->paginate(50)
        ];

        return Inertia::render('admin/bookings/page', $data);
    }

    public function create(): Response
    {
        return Inertia::render('biroumum/booking/page');
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePemesananRuangRapatRequest $request)
    {

        // Ambil ruangan dari DB
        $room = DaftarRuangan::where('kode_ruangan', $request['room_code'])->first();

        //Cek apakah nama ruangan dari request itu sama dengan nama ruangan hasil query dari id request
        if (Str::lower(Str::slug($room->nama_ruangan)) !== Str::lower(Str::slug($request->room_name))) {
            return back()->withErrors(['room_name' => 'Nama ruangan tidak sesuai.']);
        }

        // Cek apakah ruangan tersedia
        $isConflict = PemesananRuangRapat::where('daftar_ruangan_id', $room->id)
            ->where('tanggal_penggunaan', $request['date'])
            ->where(function ($q) use ($request) {
                $q->whereBetween('jam_mulai', [$request['startTime'], $request['endTime']])
                    ->orWhereBetween('jam_selesai', [$request['startTime'], $request['endTime']])
                    ->orWhere(function ($q2) use ($request) {
                        $q2->where('jam_mulai', '<=', $request['startTime'])
                            ->where('jam_selesai', '>=', $request['endTime']);
                    });
            })
            ->exists();

        if ($isConflict) {
            return back()->withErrors(['room' => 'Ruangan tidak tersedia pada waktu tersebut']);
        }

        $permintaan = PemesananRuangRapat::create([
            'user_id' => Auth::id(),
            'kode_unit' => Auth::user()->pegawai?->unit?->kode_unit,
            'tanggal_penggunaan' => $request->date,
            'jam_mulai' => $request->startTime,
            'jam_selesai' => $request->endTime,
            'daftar_ruangan_id' => $room->id,
            'deskripsi' => $request->purpose,
            'jenis_rapat' => $request->jenisRapat,
            'no_hp' => $request->contact,
            'kode_booking' => 'RRT-' . now()->format('md') . '-' . strtoupper(Str::random(3)),
            'status' => 'approved',
            'is_hybrid' => $request->isHybrid,
            'is_ti_support' => $request->needItSupport,
        ]);

        $pegawai = $permintaan->pemesan->pegawai;
        $message = "Pemesanan ruang rapat {$permintaan->ruangans->nama_ruangan} oleh {$pegawai->name} ({$pegawai->jabatan}) menunggu peninjauan.";

        // Buat notifikasi
        Notification::create([
            'kode_unit'   => $permintaan->kode_unit,
            'permissions' => ['view_bookings'],
            'type'        => 'new',
            'category'    => 'room',
            'title'       => 'Pemesanan Ruang Rapat Baru',
            'message'     =>  $message,
            'priority'    => 'medium',
            'action_url'  => route('ruangrapat.show', $permintaan->kode_booking, false),
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(PemesananRuangRapat $pemesananRuangRapat)
    {
        $pemesananRuangRapat->update(([
            'is_read' => true
        ]));

        return Inertia::render('admin/bookings/review', [
            'selectedBooking' => $pemesananRuangRapat->load('ruangans', 'pemesan.pegawai.biro'),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(PemesananRuangRapat $pemesananRuangRapat)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePemesananRuangRapatRequest $request, PemesananRuangRapat $pemesananRuangRapat)
    {
        // Ambil ruangan dari DB
        $room = DaftarRuangan::where('kode_ruangan', $request['room_code'])->first();

        //Cek apakah nama ruangan dari request itu sama dengan nama ruangan hasil query dari id request
        if (Str::lower(Str::slug($room->nama_ruangan)) !== Str::lower(Str::slug($request->room_name))) {
            return back()->withErrors(['room_name' => 'Nama ruangan tidak sesuai.']);
        }

        // Cek apakah ruangan tersedia
        $isConflict = PemesananRuangRapat::where('daftar_ruangan_id', $room->id)
            ->where('tanggal_penggunaan', $request['date'])
            ->where(function ($q) use ($request) {
                $q->whereBetween('jam_mulai', [$request['startTime'], $request['endTime']])
                    ->orWhereBetween('jam_selesai', [$request['startTime'], $request['endTime']])
                    ->orWhere(function ($q2) use ($request) {
                        $q2->where('jam_mulai', '<=', $request['startTime'])
                            ->where('jam_selesai', '>=', $request['endTime']);
                    });
            })
            ->exists();

        if ($isConflict) {
            return back()->withErrors(['room' => 'Ruangan tidak tersedia pada waktu tersebut']);
        }

        $pemesananRuangRapat->update([
            'user_id' => Auth::id(),
            'instansi_id' => Auth::user()->instansi_id,
            'tanggal_penggunaan' => $request->date,
            'jam_mulai' => $request->startTime,
            'jam_selesai' => $request->endTime,
            'daftar_ruangan_id' => $room->id,
            'deskripsi' => $request->purpose,
            'no_hp' => $request->contact,
            'jenis_rapat' => $request->jenisRapat,
            'is_hybrid' => $request->isHybrid,
            'is_ti_support' => $request->needItSupport,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PemesananRuangRapat $pemesananRuangRapat)
    {
        //
    }

    public function status(PemesananRuangRapat $pemesananRuangRapat, Request $request)
    {
        $validated = $request->validate(
            [
                'action'  => 'required|in:approved,rejected',
                'message' => 'required_if:action,rejected|nullable|string|max:255',
            ],
            [
                'action.required'  => 'Aksi wajib dipilih.',
                'action.in'        => 'Aksi yang dipilih tidak valid.',

                'message.required_if' => 'Pesan wajib diisi jika permintaan ditolak.',
                'message.string'      => 'Pesan harus berupa teks.',
                'message.max'         => 'Pesan maksimal 255 karakter.',
            ]
        );


        $pemesananRuangRapat->update([
            'status' => $validated['action'],
            'keterangan' => $validated['message'] ?? '',
        ]);
    }

    public function reports()
    {
        $reportsData = new PemesananRuangRapat();

        $startOfWeek = Carbon::now()->startOfWeek(); // Senin 00:00
        $endOfWeek = Carbon::now()->endOfWeek();     // Minggu 23:59:59

        $roomSchedules = $reportsData
            ->where('status', 'confirmed')
            ->whereNotBetween('tanggal_penggunaan', [$startOfWeek, $endOfWeek])
            ->with(['pemesan.pegawai.biro', 'ruangans'])
            ->get();



        // Kirim ke Inertia
        return Inertia::render('admin/reportsbooking/page', [
            'summaryData'        => $reportsData->summaryData(),
            'peakHours'          => $reportsData->peakHours(),
            'weeklyPattern'      => $reportsData->weeklyPattern(),
            'monthlyTrend'       => $reportsData->monthlyTrend(),
            'topUsers'           => $reportsData->topUsers(),
            'divisionUsage'      => $reportsData->divisionUsage(),
            'penggunaanRuangan'  => $reportsData->penggunaanRuangan(),
            'statusDistribution' => $reportsData->statusDistribution(),
            'weeklySchedule'     => $reportsData->weeklySchedule(),
            'rooms'              => DaftarRuangan::select('nama_ruangan')->get(),
            'roomSchedules' =>  $roomSchedules
        ]);
    }

    public function getAvailableRooms(Request $request)
    {
        $pemesananRuangRapat = new PemesananRuangRapat();
        return back()->with('availableRoom', $pemesananRuangRapat->availableRooms($request));
    }
}
