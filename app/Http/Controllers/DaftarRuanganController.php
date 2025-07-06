<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreDaftarRuanganRequest;
use App\Models\DaftarRuangan;
use Illuminate\Http\Request;
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
        $path = $request->photo->store('image/rooms', 'public');

        DaftarRuangan::create([
            'nama_ruangan' => $request['nama_ruangan'],
            'kode_ruangan' => $request['kode_ruangan'],
            'lokasi' => $request['lokasi'],
            'kapasitas' => $request['kapasitas'],
            'image' => $path,
            'status' => $request['status'],
            'fasilitas' => $request['fasilitas'],
        ]);

        return to_route('rooms.index');
    }

    public function update(StoreDaftarRuanganRequest $request, DaftarRuangan $daftarRuangan) //kalau sama ji
    {
        if ($request->hasFile('photo')) {
            // Hapus file lama
            if ($daftarRuangan->image && Storage::disk('public')->exists($daftarRuangan->image)) {
                Storage::disk('public')->delete($daftarRuangan->image);
            }

            $path = $request->file('photo')->store('image/rooms', 'public');
        } else {
            $path = $daftarRuangan->image;
        }

        $daftarRuangan->update([
            'nama_ruangan' => $request->input('nama_ruangan'),
            'lokasi' => $request->input('lokasi'),
            'kapasitas' => $request->input('kapasitas'),
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
