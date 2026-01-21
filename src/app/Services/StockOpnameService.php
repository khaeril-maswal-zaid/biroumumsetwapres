<?php

namespace App\Services;

use App\Models\DaftarAtk;
use App\Models\StockOpname;

class StockOpnameService
{
    public function consume(
        int $daftarAtkId,
        int $quantity,
        int $permintaanAtkId,
        ?string $kodeUnit
    ): void {
        if ($quantity <= 0) return;

        $qtyToConsume = $quantity;

        // FIFO perolehan
        $perolehans = StockOpname::where('daftar_atk_id', $daftarAtkId)
            ->where('type', 'Perolehan')
            ->where('remaining_quantity', '>', 0)
            ->orderBy('id')
            ->lockForUpdate()
            ->get();

        foreach ($perolehans as $per) {
            if ($qtyToConsume <= 0) break;

            $available = (int) $per->remaining_quantity;
            if ($available <= 0) continue;

            $take = min($available, $qtyToConsume);

            StockOpname::create([
                'kode_unit'             => $kodeUnit,
                'daftar_atk_id'         => $daftarAtkId,
                'quantity'              => $take,
                'remaining_quantity'    => null,
                'type'                  => 'Pemakaian',
                'permintaan_atk_id'     => $permintaanAtkId,
                'source_stockopname_id' => $per->id,
                'unit_price'            => $per->unit_price,
                'total_price'           => $per->unit_price * $take,
            ]);

            $per->remaining_quantity = max(0, $per->remaining_quantity - $take);
            $per->save();

            $qtyToConsume -= $take;
        }

        // fallback jika stok kurang
        if ($qtyToConsume > 0) {
            StockOpname::create([
                'kode_unit'             => $kodeUnit,
                'daftar_atk_id'         => $daftarAtkId,
                'quantity'              => $qtyToConsume,
                'remaining_quantity'    => null,
                'type'                  => 'Pemakaian',
                'permintaan_atk_id'     => $permintaanAtkId,
                'source_stockopname_id' => null,
                'unit_price'            => 0,
                'total_price'           => 0,
            ]);
        }

        // update master stok
        $daftarAtk = DaftarAtk::lockForUpdate()->find($daftarAtkId);
        if ($daftarAtk) {
            $daftarAtk->decrement('quantity', $quantity);
        }
    }
}
