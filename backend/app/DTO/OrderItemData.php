<?php

declare(strict_types=1);

namespace App\DTO;

final readonly class OrderItemData
{
    /**
     * @param array<int, OrderItemAddonData> $addons
     */
    public function __construct(
        public int $dishId,
        public int $quantity,
        public ?int $dishVariantId = null,
        public ?string $comment = null,
        public array $addons = [],
    ) {
    }

    public static function fromArray(array $data): self
    {
        return new self(
            dishId: (int) $data["dish_id"],
            quantity: (int) $data["quantity"],
            dishVariantId: isset($data["dish_variant_id"]) ? (int) $data["dish_variant_id"] : null,
            comment: $data["comment"] ?? null,
            addons: array_map(
                static fn (array $addon): OrderItemAddonData => OrderItemAddonData::fromArray($addon),
                $data["addons"] ?? []
            ),
        );
    }
}
