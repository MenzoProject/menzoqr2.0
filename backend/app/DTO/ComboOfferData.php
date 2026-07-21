<?php

declare(strict_types=1);

namespace App\DTO;

final readonly class ComboOfferData
{
    public function __construct(
        public int $cafeId,
        public string $title,
        public float $price,
        public ?string $description = null,
        public ?string $imagePath = null,
        public ?float $originalPrice = null,
        public int $sortOrder = 0,
        public bool $isActive = true,
    ) {
    }

    public static function fromArray(array $data): self
    {
        return new self(
            cafeId: (int) $data["cafe_id"],
            title: (string) $data["title"],
            price: (float) $data["price"],
            description: $data["description"] ?? null,
            imagePath: $data["image_path"] ?? null,
            originalPrice: isset($data["original_price"]) ? (float) $data["original_price"] : null,
            sortOrder: (int) ($data["sort_order"] ?? 0),
            isActive: (bool) ($data["is_active"] ?? true),
        );
    }

    public function toArray(): array
    {
        return [
            "cafe_id" => $this->cafeId,
            "title" => $this->title,
            "price" => $this->price,
            "description" => $this->description,
            "image_path" => $this->imagePath,
            "original_price" => $this->originalPrice,
            "sort_order" => $this->sortOrder,
            "is_active" => $this->isActive,
        ];
    }
}
