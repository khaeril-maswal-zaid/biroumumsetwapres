<?php

namespace App\Services;

use App\Models\PermintaanAtk;
use App\Models\PengambilanAtk;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class PengambilanAtkService
{

    public function handle(
        PermintaanAtk $permintaan,
        array $details,
        string $namaPengambil,
        ?string $noHp = null,
        ?string $keterangan = null
    ): PengambilanAtk {
        return DB::transaction(function () use (
            $permintaan,
            $details,
            $namaPengambil,
            $noHp,
            $keterangan
        ) {
            $pengambilan = PengambilanAtk::create([
                'permintaan_atk_id' => $permintaan->id,
                'nama_pengambil' => $namaPengambil,
                'no_hp' => $noHp,
                'tanggal_ambil' => now(),
                'keterangan' => $keterangan,
            ]);

            $items = collect($permintaan->daftar_kebutuhan)->keyBy('id');

            foreach ($details as $detail) {
                $itemId = (string) $detail['item_id'];
                $qty = (int) $detail['qty_diambil'];

                if (!isset($items[$itemId])) continue;

                $item = $items[$itemId];

                $approved = (int) ($item['approved'] ?? 0);

                $alreadyTaken = $permintaan->pengambilanDetails()
                    ->where('item_id', $itemId)
                    ->sum('qty_diambil');

                if (($alreadyTaken + $qty) > $approved) {
                    throw ValidationException::withMessages([
                        'qty' => "Qty {$item['name']} melebihi approved"
                    ]);
                }

                $pengambilan->details()->create([
                    'item_id' => $itemId,
                    'item_name' => $item['name'],
                    'satuan' => $item['satuan'] ?? null,
                    'qty_diambil' => $qty,
                ]);
            }

            return $pengambilan;
        });
    }
}
