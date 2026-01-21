<?php

namespace App\DataTransferObjects;

class AtkRequestItem
{
    public function __construct(
        public string|int $id,
        public string $name,
        public string $satuan,
        public int $requested,
        public int $approved,
        public string $status,
        public ?int $replacedBy = null,
        public ?string $originId = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            id: (string) $data['id'],
            name: $data['name'] ?? '',
            satuan: $data['satuan'] ?? '',
            requested: (int) ($data['requested'] ?? 0),
            approved: (int) ($data['approved'] ?? 0),
            status: $data['status'] ?? 'custom',
            replacedBy: $data['replacedBy'] ?? null,
            originId: $data['origin_id'] ?? null,
        );
    }

    public function addApproved(int $qty): void
    {
        $this->approved = min($this->requested, $this->approved + $qty);
    }

    public function markReplaced(int $replacementId): void
    {
        $this->status = 'replaced';
        $this->replacedBy = $replacementId;
    }

    public function toArray(): array
    {
        return [
            'id'         => $this->id,
            'name'       => $this->name,
            'satuan'     => $this->satuan,
            'requested'  => $this->requested,
            'approved'   => $this->approved,
            'status'     => $this->status,
            'replacedBy' => $this->replacedBy,
            'origin_id'  => $this->originId,
        ];
    }
}
