<?php

declare(strict_types=1);

namespace App\DTO;

final readonly class OrderItemAddonData
{
    public function __construct(
        public int $dishAddonId,
    ) {
    }

    public static function fromArray(array $data): self
    {
        return new self(dishAddonId: (int) $data["dish_addon_id"]);
    }
}
