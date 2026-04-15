<?php

namespace App\Http\Controllers;

use App\Models\PengambilanAtk;
use App\Models\PermintaanAtk;
use App\Services\PengambilanAtkService;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;

class PengambilanAtkController extends Controller
{
    public function index(PermintaanAtk $permintaanAtk)
    {
        $permintaanAtk->load('pemesan.pegawai');

        $pengambilan = $permintaanAtk
            ->pengambilans()
            ->with('details')
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


    public function tandaTerima(PengambilanAtk $pengambilanAtk)
    {
        $data = [
            'penerima' => $pengambilanAtk->nama_pengambil ?? '____________________',
            'items' => $pengambilanAtk->details,
        ];

        $pdf = Pdf::loadView('pdf.tanda-terima-atk', $data)
            ->setPaper('A4', 'portrait');

        return $pdf->stream();
        return $pdf->download("buku-persediaan-{$bulan}-{$tahun}.pdf");
    }
}
