<?php

namespace App\Support;

use App\DataTransferObjects\AtkRequestItem;

class AtkItemNormalizer
{
    /**
     * Normalize item dari DB (daftar_kebutuhan)
     */
    public static function fromDatabase(array $item): AtkRequestItem
    {
        $id = $item['id'] ?? '';

        return new AtkRequestItem(
            id: $id,
            name: $item['name'] ?? null,
            satuan: $item['satuan'] ?? null,
            requested: (int) ($item['requested'] ?? 0),
            approved: (int) ($item['approved'] ?? 0),
            status: self::defaultStatus($id, $item['status'] ?? null),
            originId: $item['origin_id'] ?? null,
            replacedBy: isset($item['replacedBy']) ? (int) $item['replacedBy'] : null
        );
    }

    /**
     * Normalize item dari newRequests (hasil konversi lain-lain)
     */
    public static function fromNewRequest(array $nr): AtkRequestItem
    {
        $requested = (int) ($nr['requested'] ?? 0);
        $approved  = min($requested, (int) ($nr['approved'] ?? 0));

        return new AtkRequestItem(
            id: (int) $nr['id'],
            name: $nr['name'] ?? null,
            satuan: $nr['satuan'] ?? null,
            requested: $requested,
            approved: $approved,
            status: 'replacement',
            originId: $nr['originalItemId'] ?? null
        );
    }

    /**
     * Tentukan status default item
     */
    private static function defaultStatus(string|int $id, ?string $existing): string
    {
        if ($existing) return $existing;

        return is_numeric($id) && (int) $id > 0
            ? 'normal'
            : 'custom';
    }

    /**
     * Normalize collection → array
     */
    public static function toArray(iterable $items): array
    {
        return collect($items)
            ->map(fn(AtkRequestItem $item) => $item->toArray())
            ->values()
            ->all();
    }

    public static function fromArray(array $raw): AtkRequestItem
    {
        return AtkRequestItem::fromArray($raw);
    }
}
