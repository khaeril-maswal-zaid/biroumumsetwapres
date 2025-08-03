<?php

namespace App\Http\Controllers;

use App\Models\KerusakanGedung;
use App\Http\Requests\StoreKerusakanGedungRequest;
use App\Http\Requests\UpdateKerusakanGedungRequest;
use App\Models\KategoriKerusakan;
use App\Models\UnitKerja;
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
        $data = [
            'kerusakan' => KerusakanGedung::with('pelapor')->with('kategori')->latest()->paginate(50)
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
            'unitKerja' => UnitKerja::select('label')->pluck('label')->all(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreKerusakanGedungRequest $request)
    {
        $photoPaths = [];

        foreach ($request->photos as $photo) {
            $photoPaths[] = $photo->store('image/kerusakan-gedung', 'public');
        }

        $idKat  = KategoriKerusakan::where('kode_kerusakan', $request->kategori)->value('id');

        KerusakanGedung::create([
            'user_id' => Auth::id(),
            'instansi_id' => Auth::user()->instansi_id,
            'unit_kerja' => $request->unit_kerja,
            'kategori_kerusakan_id' => $idKat,
            'lokasi' => $request->location,
            'item' => $request->damageType,
            'deskripsi' => $request->description,
            'picture' => $photoPaths,
            'urgensi' => $request->urgency,
            'kode_pelaporan' => 'KGD-' . now()->format('md') . '-' . strtoupper(Str::random(3)),
            'no_hp' => $request->contact,
            'status' => 'pending',
            'keterangan' => $request->location,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(KerusakanGedung $kerusakanGedung)
    {
        //
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
        //
    }

    public function status(KerusakanGedung $kerusakanGedung, Request $request)
    {
        $validated = $request->validate([
            'action' => 'required|in:pending,process,confirmed,cancelled',
            'message' => 'required_if:action,cancelled|string|max:255',
        ]);

        if ($validated['action'] ==  'process') {
            $status = 'process';
        } else {
            $status = 'confirmed';
        }

        $updateData = collect([
            'status' => $status,
        ]);

        if (isset($validated['message'])) {
            $updateData->put('keterangan', $validated['message']);
        }

        $kerusakanGedung->update($updateData->all());
    }

    public function reports()
    {
        $reportsData = new KerusakanGedung();

        $data = [
            'summaryData' =>  $reportsData->summaryData(),
            'locationData' =>  $reportsData->locationData(),
            'statusDistribution' =>  $reportsData->statusDistribution(),
            'damageTypeData' =>  $reportsData->damageTypeData(),
            'urgencyData' =>  $reportsData->urgencyData(),
            'topReportersData' =>  $reportsData->reporterStats()['topReportersData'],
            'divisionReports' =>  $reportsData->reporterStats()['divisionReports'],
            'monthlyTrend' => $reportsData->monthlyTrends(),
        ];

        return Inertia::render('admin/reportsdamages/page', $data);
    }
}
