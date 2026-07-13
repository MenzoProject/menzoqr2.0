<?php

declare(strict_types=1);

namespace App\Services\Telegram;

use App\Enums\OrderStatus;
use App\Models\Order;

/**
 * Builds the Telegram inline keyboard for an order based on its *current*
 * status, so the same logic can render the initial notification keyboard
 * and rebuild it after each status transition triggered from the chat.
 */
final class OrderKeyboardBuilder
{
    public function build(Order $order): array
    {
        return match ($order->status) {
            OrderStatus::New => [
                [
                    ["text" => "✅ Принять", "callback_data" => "order:{$order->id}:accepted"],
                    ["text" => "❌ Отменить", "callback_data" => "order:{$order->id}:cancelled"],
                ],
            ],
            OrderStatus::Accepted => [
                [
                    ["text" => "👨‍🍳 Готовится", "callback_data" => "order:{$order->id}:preparing"],
                    ["text" => "❌ Отменить", "callback_data" => "order:{$order->id}:cancelled"],
                ],
            ],
            OrderStatus::Preparing => [
                [
                    ["text" => "📦 Готов", "callback_data" => "order:{$order->id}:ready"],
                    ["text" => "❌ Отменить", "callback_data" => "order:{$order->id}:cancelled"],
                ],
            ],
            OrderStatus::Ready => [
                [
                    ["text" => "✅ Выдан", "callback_data" => "order:{$order->id}:delivered"],
                ],
            ],
            OrderStatus::Delivered, OrderStatus::Cancelled => [],
        };
    }
}
