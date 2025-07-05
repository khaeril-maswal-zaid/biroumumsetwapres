<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

use App\Models\PemesananRuangRapat;
use App\Http\Requests\StorePemesananRuangRapatRequest;
use App\Http\Requests\UpdatePemesananRuangRapatRequest;
use App\Models\DaftarRuangan;
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
            'bookingRooms' => PemesananRuangRapat::with('ruangans')->with('pemesan')->latest()->paginate(15)
        ];

        return Inertia::render('admin/bookings/page', $data);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request): Response
    {
        $result = [];

        if ($request->filled(['tanggal', 'jam_mulai', 'jam_selesai'])) {
            $validated = $request->validate([
                'tanggal'     => 'required|date',
                'jam_mulai'   => 'required|date_format:H:i',
                'jam_selesai' => 'required|date_format:H:i|after:jam_mulai',
            ]);

            $tanggal    = $validated['tanggal'];
            $jamMulai   = $validated['jam_mulai'];
            $jamSelesai = $validated['jam_selesai'];

            // Deteksi hari & jam sibuk
            $dayOfWeek  = Carbon::parse($tanggal)->dayOfWeek;
            $isWeekend  = in_array($dayOfWeek, [Carbon::SATURDAY, Carbon::SUNDAY]);
            $hourStart  = Carbon::createFromFormat('H:i', $jamMulai)->hour;
            $isPeakHour = $hourStart >= 9 && $hourStart <= 16;

            // Ambil ruangan
            $ruangans = DaftarRuangan::select(['id', 'nama_ruangan', 'kode_ruangan', 'lokasi', 'kapasitas', 'image', 'fasilitas'])->get();

            // Ambil booking hanya jika weekday & peak
            $bookings = collect();
            if (! $isWeekend && $isPeakHour) {
                $bookings = PemesananRuangRapat::where('tanggal_penggunaan', $tanggal)
                    ->where('jam_mulai', '<', $jamSelesai)
                    ->where('jam_selesai', '>', $jamMulai)
                    ->get();
            }

            $result = $ruangans->map(function ($r) use ($isWeekend, $isPeakHour, $bookings) {
                $myBookings = $bookings->filter(fn($b) => $b->daftar_ruangan_id == $r->id);
                $slots = $myBookings->map(
                    fn($b) => Carbon::parse($b->jam_mulai)->format('H:i') . '-' . Carbon::parse($b->jam_selesai)->format('H:i')
                )->values()->all();

                return [
                    'id'           => $r->kode_ruangan,
                    'nama_ruangan' => $r->nama_ruangan,
                    'kode_ruangan' => $r->kode_ruangan,
                    'kapasitas'    => $r->kapasitas,
                    'lokasi'       => $r->lokasi,
                    'status'       => count($slots) ? 'booked' : 'available',
                    'bookedSlots'  => $slots,
                    'image'        => $r->image,
                    'facilities'   => $r->fasilitas,
                ];
            });
        }

        return Inertia::render('biroumum/booking/page', [
            'tersedia' => $result,
        ]);
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

        PemesananRuangRapat::create([
            'user_id' => Auth::id(),
            'tanggal_penggunaan' => $request->date,
            'jam_mulai' => $request->startTime,
            'jam_selesai' => $request->endTime,
            'daftar_ruangan_id' => $room->id,
            'deskripsi' => $request->purpose,
            'no_hp' => $request->contact,
            'kode_booking' => 'BK-' . now()->format('Ymd') . '-' . strtoupper(Str::random(6)),
            'keterangan' => '',
            'status' => 'pending',
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(PemesananRuangRapat $pemesananRuangRapat)
    {
        //
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
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PemesananRuangRapat $pemesananRuangRapat)
    {
        //
    }

    public function status(PemesananRuangRapat $pemesananruangrapat, Request $request)
    {
        $validated = $request->validate([
            'action' => 'required|in:confirmed,cancelled',
            'message' => 'required|string|max:255',
        ]);

        $pemesananruangrapat->update([
            'status' => $validated['action'],
            'keterangan' => $validated['message'],
        ]);
    }
}
