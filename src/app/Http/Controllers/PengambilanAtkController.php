<?php

namespace App\Http\Controllers;

use App\Models\PermintaanAtk;
use App\Services\PengambilanAtkService;
use Illuminate\Http\Request;

class PengambilanAtkController extends Controller
{
    public function index(PermintaanAtk $permintaanAtk)
    {
        $permintaanAtk->load('pemesan.pegawai');

        $pengambilan = $permintaanAtk
            ->pengambilans()
            ->with('details')
            // ->latest()
            ->get();

        $takenMap = $pengambilan
            ->flatMap(fn($p) => $p->details) // ambil semua detail
            ->groupBy('item_id')
            ->map(fn($items) => $items->sum('qty_diambil'));

        $items = collect($permintaanAtk->daftar_kebutuhan)
            ->map(function ($item) use ($takenMap) {
                $taken = $takenMap[$item['id']] ?? 0;
                $approved = (int) ($item['approved'] ?? 0);

                return [
                    ...$item,
                    'sudah_diambil' => $taken,
                    'sisa' => max(0, $approved - $taken),
                ];
            })->values();

        $data = [
            'pengambilans' => $pengambilan,
            'itemsSummary' => $items,
            'kodeLaporan' => $permintaanAtk->kode_pelaporan,
        ];
        return inertia('admin/pengambilanatk/page', $data);
    }


    public function indexX(PermintaanAtk $permintaanAtk)
    {
        $permintaanAtk->load('pemesan.pegawai');

        $pengambilanRaw = $permintaanAtk
            ->pengambilans()
            ->with('details')
            ->latest()
            ->get();

        $takenMap = $pengambilanRaw
            ->flatMap(fn($p) => $p->details)
            ->groupBy('item_id')
            ->map(fn($items) => $items->sum('qty_diambil'));

        $kebutuhanMap = collect($permintaanAtk->daftar_kebutuhan)
            ->keyBy('id');

        $items = $kebutuhanMap
            ->map(function ($item) use ($takenMap) {
                $taken = $takenMap[$item['id']] ?? 0;
                $approved = (int) ($item['approved'] ?? 0);

                return [
                    ...$item,
                    'sudah_diambil' => $taken,
                    'sisa' => max(0, $approved - $taken),
                ];
            })
            ->values();

        $pengambilans = $pengambilanRaw->map(function ($p) use ($takenMap, $kebutuhanMap) {
            $p->setRelation('details', collect($p->details)->map(function ($d) use ($takenMap, $kebutuhanMap) {
                $item = $kebutuhanMap[$d->item_id] ?? null;
                $approved = (int) ($item['approved'] ?? 0);
                $totalTaken = $takenMap[$d->item_id] ?? 0;

                return [
                    ...$d->toArray(),
                    'total_diambil' => $totalTaken,
                    'sisa' => max(0, $approved - $totalTaken),
                ];
            }));

            return $p;
        });

        $data = [
            'pengambilans' => $pengambilans,
            'itemsSummary' => $items,
            'kodeLaporan' => $permintaanAtk->kode_pelaporan,
        ];

        return inertia('admin/pengambilanatk/page', $data);
    }

    public function store(Request $request, PermintaanAtk $permintaanAtk, PengambilanAtkService $service)
    {
        $validated = $request->validate([
            'nama_pengambil' => 'required|string|max:255',
            'no_hp' => 'nullable|string|max:25',
            'tanggal_ambil' => 'required|date',
            'keterangan' => 'nullable|string|max:255',
            'details' => 'required|array|min:1',
            'details.*.item_id' => 'required|string',
            'details.*.qty_diambil' => 'required|integer|min:1',
        ], [
            'nama_pengambil.required' => 'Nama pengambil wajib diisi.',
            'tanggal_ambil.required' => 'Tanggal ambil wajib diisi.',
            'details.required' => 'Minimal satu item harus diambil.',
            'details.*.qty_diambil.required' => 'Qty wajib diisi.',
            'details.*.qty_diambil.min' => 'Qty minimal 1.',
        ]);

        $service->handle(
            $permintaanAtk,
            $validated['details'],
            $validated['nama_pengambil'],
            $validated['no_hp'] ?? null,
            $validated['keterangan'] ?? null
        );

        return back()->with('success', 'Pengambilan berhasil disimpan.');
    }
}
