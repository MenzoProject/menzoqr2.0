<?php

declare(strict_types=1);

namespace App\DTO;

final readonly class CafeData
{
    public function __construct(
        public int $ownerId,
        public string $name,
        public string $slug,
        public ?string $address = null,
        public ?string $phone = null,
        public string $currency = "RUB",
        public ?string $logoPath = null,
        public bool $isActive = true,
    ) {
    }

    public static function fromArray(array $data): self
    {
        return new self(
            ownerId: (int) $data["owner_id"],
            name: (string) $data["name"],
            slug: (string) $data["slug"],
            address: $data["address"] ?? null,
            phone: $data["phone"] ?? null,
            currency: $data["currency"] ?? "RUB",
            logoPath: $data["logo_path"] ?? null,
            isActive: (bool) ($data["is_active"] ?? true),
        );
    }

    public function toArray(): array
    {
        return [
            "owner_id" => $this->ownerId,
            "name" => $this->name,
            "slug" => $this->slug,
            "address" => $this->address,
            "phone" => $this->phone,
            "currency" => $this->currency,
            "logo_path" => $this->logoPath,
            "is_active" => $this->isActive,
        ];
    }
}
