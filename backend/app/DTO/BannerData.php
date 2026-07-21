<?php

declare(strict_types=1);

namespace App\DTO;

final readonly class BannerData
{
    public function __construct(
        public int $cafeId,
        public string $imagePath,
        public ?string $title = null,
        public ?string $subtitle = null,
        public int $sortOrder = 0,
        public bool $isActive = true,
    ) {
    }

    public static function fromArray(array $data): self
    {
        return new self(
            cafeId: (int) $data["cafe_id"],
            imagePath: (string) $data["image_path"],
            title: $data["title"] ?? null,
            subtitle: $data["subtitle"] ?? null,
            sortOrder: (int) ($data["sort_order"] ?? 0),
            isActive: (bool) ($data["is_active"] ?? true),
        );
    }

    public function toArray(): array
    {
        return [
            "cafe_id" => $this->cafeId,
            "image_path" => $this->imagePath,
            "title" => $this->title,
            "subtitle" => $this->subtitle,
            "sort_order" => $this->sortOrder,
            "is_active" => $this->isActive,
        ];
    }
}
