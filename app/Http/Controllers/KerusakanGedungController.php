<?php

namespace App\Http\Controllers;

use App\Models\KerusakanGedung;
use App\Http\Requests\StoreKerusakanGedungRequest;
use App\Http\Requests\UpdateKerusakanGedungRequest;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;

class KerusakanGedungController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $data = [
            'kerusakan' => KerusakanGedung::with('pelapor')->latest()->paginate(15)
        ];

        return Inertia::render('admin/damages/page', $data);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('biroumum/damage/page');
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

        KerusakanGedung::create([
            'user_id' => Auth::id(),
            'lokasi' => $request->location,
            'item' => $request->damageType,
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
}
