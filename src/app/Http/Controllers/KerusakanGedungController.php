<?php

namespace App\Http\Controllers;

use App\Models\KerusakanGedung;
use App\Http\Requests\StoreKerusakanGedungRequest;
use App\Http\Requests\UpdateKerusakanGedungRequest;
use App\Models\KategoriKerusakan;
use App\Models\Notification;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Http\Request;

class KerusakanGedungController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $permission = Auth::user()->getAllPermissions()->pluck('name');

        if ($permission->contains('view_bangunan_damages')) {

            $kerusakan = KerusakanGedung::whereHas('kategori', function ($query) {
                $query->where('bagian_kategori', 'Bangunan');
            });

            $typeTitle = '- Bangunan';
        } elseif ($permission->contains('view_perlengkapan_damages')) {
            $kerusakan = KerusakanGedung::whereHas('kategori', function ($query) {
                $query->where('bagian_kategori', 'Perlengkapan');
            });

            $typeTitle = '- Perlengkapan';
        } else {
            $kerusakan = KerusakanGedung::query();
            $typeTitle = '';
        }

        $data = [
            'kerusakan' => $kerusakan->with('pelapor.pegawai')->with('kategori')->latest()->paginate(150),
            'typeTitle' => $typeTitle,
        ];

        return Inertia::render('admin/damages/page', $data);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {

        return Inertia::render('biroumum/damage/page', [
            'kategoriKerusakan' => KategoriKerusakan::all(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreKerusakanGedungRequest $request)
    {
        $photoPaths = [];

        foreach ($request->photos as $photo) {
            $mime = $photo->getMimeType();
            if (str_starts_with($mime, 'image/')) {
                $path = $photo->store('images/kerusakan-gedung', 'public');
            } elseif (str_starts_with($mime, 'video/')) {
                $path = $photo->store('video/kerusakan-gedung', 'public');
            }
            $photoPaths[] = $path;
        }

        $idKat  = KategoriKerusakan::where('kode_kerusakan', $request->kategori)->value('id');

        $laporan = KerusakanGedung::create([
            'user_id' => Auth::id(),
            'kode_unit' => Auth::user()->pegawai?->unit?->kode_unit,
            'kategori_kerusakan_id' => $idKat,
            'lokasi' => $request->location,
            'item' => $request->damageType,
            'deskripsi' => $request->description,
            'picture' => $photoPaths,
            'urgensi' => null,
            'kode_pelaporan' => 'KGD-' . now()->format('md') . '-' . strtoupper(Str::random(3)),
            'no_hp' => $request->contact,
            'status' => 'pending',
        ]);

        $pegawai = $laporan->pelapor->pegawai;
        $message = "Permintaan perbaikan sarpras oleh {$pegawai->name} ({$pegawai->jabatan}) memerlukan peninjauan.";

        $isBangunan = $laporan->kategori->bagian_kategori == 'Bangunan';
        if ($isBangunan) {
            $permissions = ['view_admin_damages', 'view_bangunan_damages'];
        } else {
            $permissions = ['view_admin_damages', 'view_perlengkapan_damages'];
        }

        // Buat notifikasi
        Notification::create([
            'kode_unit'   => $laporan->kode_unit,
            'permissions' => $permissions,
            'type'        => 'new',
            'category'    => 'damage',
            'title'       => 'Permintaan Perbaikan Sarpras Baru',
            'message'     =>  $message,
            'priority'    => 'medium',
            'action_url'  => route('kerusakangedung.show', $laporan->kode_pelaporan, false),
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(KerusakanGedung $kerusakanGedung)
    {
        $kerusakanGedung->update(([
            'is_read' => true
        ]));

        return Inertia::render('admin/damages/review', [
            'selectedDamage' => $kerusakanGedung->load('kategori', 'pelapor.pegawai.biro', 'logProgres'),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(KerusakanGedung $kerusakanGedung)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateKerusakanGedungRequest $request, KerusakanGedung $kerusakanGedung)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(KerusakanGedung $kerusakanGedung)
    {
        $kerusakanGedung->delete();
    }

    public function status(KerusakanGedung $kerusakanGedung, Request $request)
    {
        $validated = $request->validate([
            'action' => 'required|in:pending,process,confirmed,cancelled',
            'message' => 'required_if:action,cancelled|string|max:255',
        ]);

        $status = $validated['action'] === 'process' ? 'process' : 'confirmed';

        $updateData = collect([
            'status' => $status,
        ]);

        if (isset($validated['message'])) {
            $updateData->put('keterangan', $validated['message']);
        }

        $kerusakanGedung->update($updateData->all());
    }

    public function reports(KerusakanGedung $kerusakanGedung)
    {
        $data = [
            'summaryData' =>  $kerusakanGedung->summaryData(),
            'locationData' =>  $kerusakanGedung->locationData(),
            'statusDistribution' =>  $kerusakanGedung->statusDistribution(),
            'damageTypeData' =>  $kerusakanGedung->damageTypeData(),
            'urgencyData' =>  $kerusakanGedung->urgencyData(),
            'topReportersData' =>  $kerusakanGedung->reporterStats()['topReportersData'],
            'divisionReports' =>  $kerusakanGedung->reporterStats()['divisionReports'],
            'monthlyTrend' => $kerusakanGedung->monthlyTrends(),
        ];

        return Inertia::render('admin/reportsdamages/page', $data);
    }

    public function urgensi(KerusakanGedung $kerusakanGedung, Request $request)
    {
        $validated = $request->validate([
            'urgensi' => 'required|in:tinggi,rendah',
        ]);

        $kerusakanGedung->update($validated);
    }
}
