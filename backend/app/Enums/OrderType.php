<?php

declare(strict_types=1);

namespace App\Enums;

enum OrderType: string
{
    case Takeaway = "takeaway";
    case Table = "table";

    public function label(): string
    {
        return match ($this) {
            self::Takeaway => "Самовывоз",
            self::Table => "В заведении",
        };
    }
}
