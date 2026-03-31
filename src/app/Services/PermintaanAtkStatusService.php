<?php

namespace App\Services;

use App\Models\PermintaanAtk;
use App\DataTransferObjects\AtkRequestItem;
use App\Support\AtkItemNormalizer;
use Illuminate\Validation\ValidationException;

class PermintaanAtkStatusService
{
    public function handle(
        PermintaanAtk $permintaan,
        array $items = [],
        array $newRequests = [],
        array $partialApprovals = [],
    ): array {
        if ($permintaan->status === 'confirmed') {
            throw ValidationException::withMessages([
                'status' => 'Permintaan sudah confirmed dan tidak bisa diubah.'
            ]);
        }

        $currentStatus = $permintaan->status;

        /** 1) Normalisasi item existing */
        $existingItems = collect($permintaan->daftar_kebutuhan ?? [])
            ->map(fn($raw) => AtkItemNormalizer::fromArray($raw))
            ->keyBy(fn(AtkRequestItem $i) => (string) $i->id);

        /** 2) Tentukan sumber approval (MUTUALLY EXCLUSIVE) */
        if ($currentStatus === 'pending') {
            $approvalSource = $items; // itemId => delta
        } elseif ($currentStatus === 'partial') {
            $approvalSource = collect($partialApprovals)->mapWithKeys(
                fn($v, $k) => [(string) $k => (int) ($v['approve'] ?? 0)]
            )->toArray();
        } else {
            $approvalSource = [];
        }

        /** 3) Apply approval (DELTA, capped by requested) */
        foreach ($approvalSource as $itemId => $qty) {
            if (!isset($existingItems[$itemId])) continue;
            $existingItems[$itemId]->addApproved($qty);
        }

        /** 4) Proses newRequests (append + replace marker) */
        foreach ($newRequests as $nr) {
            $originId = (string) ($nr['originalItemId'] ?? null);

            // determine origin name (if original id points to an existing item)
            $originName = null;
            if ($originId && isset($existingItems[$originId])) {
                $originName = $existingItems[$originId]->name;

                // mark the original item as replaced using the replacement's name
                $existingItems[$originId]->markReplaced($nr['name'] ?? (string) $nr['id']);
            }

            $newItem = AtkItemNormalizer::fromArray([
                'id'        => (int) $nr['id'],
                'name'      => $nr['name'] ?? null,
                'satuan'    => $nr['satuan'] ?? null,
                'requested' => (int) $nr['requested'],
                'approved'  => (int) $nr['approved'],
                'status'    => 'replacement',
                // store origin as name instead of ATK id
                'origin_id' => $originName,
            ]);

            $existingItems->put((string) $newItem->id, $newItem);
        }

        /** 5) Return final daftar_kebutuhan */
        return $existingItems
            ->values()
            ->map(fn(AtkRequestItem $i) => $i->toArray())
            ->all();
    }
}
