<?php

declare(strict_types=1);

namespace App\DTO;

final readonly class DishData
{
    /**
     * @param array<int, string> $tags
     */
    public function __construct(
        public int $categoryId,
        public string $name,
        public float $price,
        public ?string $description = null,
        public ?string $imagePath = null,
        public int $sortOrder = 0,
        public bool $isActive = true,
        public bool $isAvailable = true,
        public array $tags = [],
    ) {
    }

    public static function fromArray(array $data): self
    {
        return new self(
            categoryId: (int) $data["category_id"],
            name: (string) $data["name"],
            price: (float) $data["price"],
            description: $data["description"] ?? null,
            imagePath: $data["image_path"] ?? null,
            sortOrder: (int) ($data["sort_order"] ?? 0),
            isActive: (bool) ($data["is_active"] ?? true),
            isAvailable: (bool) ($data["is_available"] ?? true),
            tags: $data["tags"] ?? [],
        );
    }

    public function toArray(): array
    {
        return [
            "category_id" => $this->categoryId,
            "name" => $this->name,
            "price" => $this->price,
            "description" => $this->description,
            "image_path" => $this->imagePath,
            "sort_order" => $this->sortOrder,
            "is_active" => $this->isActive,
            "is_available" => $this->isAvailable,
            "tags" => $this->tags,
        ];
    }
}
