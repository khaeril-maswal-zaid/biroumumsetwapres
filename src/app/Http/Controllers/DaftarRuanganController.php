<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreDaftarRuanganRequest;
use App\Models\DaftarRuangan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class DaftarRuanganController extends Controller
{
    protected $ruangans;

    public function __construct()
    {
        $this->ruangans = DaftarRuangan::latest()->paginate(15);
    }

    public function index()
    {
        return Inertia::render('admin/rooms/page', [
            'ruangans' => $this->ruangans
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreDaftarRuanganRequest $request)
    {
        $path = $request->photo->store('images/rooms', 'public');

        DaftarRuangan::create([
            'kode_unit' => Auth::user()->pegawai?->unit?->kode_unit,
            'nama_ruangan' => $request->nama_ruangan,
            'kode_ruangan' => $request->kode_ruangan,
            'lokasi' => $request->lokasi,
            'kapasitas' => $request->kapasitas,
            'image' => $path,
            'status' => $request->status,
            'fasilitas' => $request->fasilitas,
        ]);

        return to_route('rooms.index');
    }

    public function update(Request $request, DaftarRuangan $daftarRuangan) //kalau sama ji
    {
        if ($request->hasFile('photo')) {
            // Hapus file lama
            if ($daftarRuangan->image && Storage::disk('public')->exists($daftarRuangan->image)) {
                Storage::disk('public')->delete($daftarRuangan->image);
            }

            $path = $request->file('photo')->store('images/rooms', 'public');
        } else {
            $path = $daftarRuangan->image;
        }

        $daftarRuangan->update([
            'nama_ruangan' => $request->input('nama_ruangan'),
            'lokasi' => $request->input('lokasi'),
            'kapasitas' => $request->input('kapasitas'),
            'kapasitas_max' => $request->input('kapasitas_max'),
            'image' => $path,
            'status' => $request->input('status'),
            'fasilitas' => $request->input('fasilitas'),
        ]);

        return redirect(route('rooms.index'));
    }

    public function destroy(DaftarRuangan $daftarRuangan)
    {
        if ($daftarRuangan->image && Storage::disk('public')->exists($daftarRuangan->image)) {
            Storage::disk('public')->delete($daftarRuangan->image);
        }


        // Hapus data daftarRuangan
        $daftarRuangan->delete();

        return to_route('rooms.index');
    }
}
