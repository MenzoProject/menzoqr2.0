<?php

declare(strict_types=1);

namespace App\Enums;

enum DishTag: string
{
    case New = "new";
    case Hit = "hit";
    case Spicy = "spicy";
    case Halal = "halal";
    case Vegetarian = "vegetarian";

    public function label(): string
    {
        return match ($this) {
            self::New => "Новинка",
            self::Hit => "Хит",
            self::Spicy => "Острое",
            self::Halal => "Халяль",
            self::Vegetarian => "Вегетарианское",
        };
    }
}
