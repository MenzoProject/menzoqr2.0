<?php

declare(strict_types=1);

namespace App\Enums;

enum UserRole: string
{
    case Owner = "owner";
    case Manager = "manager";
    case Staff = "staff";

    public function label(): string
    {
        return match ($this) {
            self::Owner => "Владелец",
            self::Manager => "Менеджер",
            self::Staff => "Персонал",
        };
    }
}
