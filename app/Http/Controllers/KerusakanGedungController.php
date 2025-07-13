<?php

namespace App\Http\Controllers;

use App\Models\KerusakanGedung;
use App\Http\Requests\StoreKerusakanGedungRequest;
use App\Http\Requests\UpdateKerusakanGedungRequest;
use App\Models\KategoriKerusakan;
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
            'kategoriKerusakan' => KategoriKerusakan::all()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreKerusakanGedungRequest $request, KategoriKerusakan $kategoriKerusakan)
    {
        $photoPaths = [];

        foreach ($request->photos as $photo) {
            $photoPaths[] = $photo->store('image/kerusakan-gedung', 'public');
        }

        $idKat  = KategoriKerusakan::where('kode_kerusakan', $request->kategori)->value('id');

        KerusakanGedung::create([
            'user_id' => Auth::id(),
            'kategori_kerusakan_id' => $kategoriKerusakan->id,
            'lokasi' => $request->location,
            'item' => $request->damageType,
            'kategori' =>  $idKat,
            'deskripsi' => $request->description,
            'picture' => $photoPaths,
            'urgensi' => $request->urgency,
            'kode_pelaporan' => 'Kgd-' . now()->format('Ymd') . '-' . strtoupper(Str::random(5)),
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
            'action' => 'required|in:confirmed,in_progress,cancelled',
            'message' => 'required_unless:action,confirmed|string|max:255',
        ]);


        $updateData = collect([
            'status' => $validated['action'],
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
            'monthlyTrend' => $reportsData->monthlyTrends()['monthlyTrend'],
            'approvalRateTrend' => $reportsData->monthlyTrends()['approvalRateTrend'],
        ];

        return Inertia::render('admin/reportsdamages/page', $data);
    }
}
