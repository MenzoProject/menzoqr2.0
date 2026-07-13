<?php

declare(strict_types=1);

namespace App\Enums;

enum OrderStatus: string
{
    case New = "new";
    case Accepted = "accepted";
    case Preparing = "preparing";
    case Ready = "ready";
    case Delivered = "delivered";
    case Cancelled = "cancelled";

    public function label(): string
    {
        return match ($this) {
            self::New => "Новый",
            self::Accepted => "Принят",
            self::Preparing => "Готовится",
            self::Ready => "Готов",
            self::Delivered => "Выдан",
            self::Cancelled => "Отменен",
        };
    }

    /**
     * @return array<int, self>
     */
    public function allowedTransitions(): array
    {
        return match ($this) {
            self::New => [self::Accepted, self::Cancelled],
            self::Accepted => [self::Preparing, self::Cancelled],
            self::Preparing => [self::Ready, self::Cancelled],
            self::Ready => [self::Delivered, self::Cancelled],
            self::Delivered => [],
            self::Cancelled => [],
        };
    }

    public function canTransitionTo(self $status): bool
    {
        return in_array($status, $this->allowedTransitions(), true);
    }
}
