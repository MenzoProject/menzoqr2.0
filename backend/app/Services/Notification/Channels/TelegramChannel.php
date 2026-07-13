<?php

declare(strict_types=1);

namespace App\Services\Notification\Channels;

use App\DTO\TelegramMessageData;
use App\Models\Order;
use App\Services\Notification\Contracts\NotificationChannel;
use App\Services\Telegram\OrderKeyboardBuilder;
use App\Services\Telegram\TelegramService;

final class TelegramChannel implements NotificationChannel
{
    public function __construct(
        private readonly TelegramService $telegramService,
        private readonly OrderKeyboardBuilder $keyboardBuilder,
    ) {
    }

    public function key(): string
    {
        return "telegram";
    }

    public function isAvailableFor(Order $order): bool
    {
        if (! $this->telegramService->isConfigured()) {
            return false;
        }

        $account = $order->cafe->telegramAccount;

        return $account !== null && $account->isConnected();
    }

    public function send(Order $order): bool
    {
        $chatId = $order->cafe->telegramAccount->chat_id;

        $messageId = $this->telegramService->sendMessage(
            new TelegramMessageData(
                chatId: $chatId,
                text: $this->buildMessageText($order),
                inlineKeyboard: $this->keyboardBuilder->build($order),
            )
        );

        if ($messageId !== null) {
            $order->update(["telegram_message_id" => $messageId]);
        }

        return $messageId !== null;
    }

    public function buildMessageText(Order $order): string
    {
        $lines = [
            $this->statusEmoji($order)." <b>Заказ №{$order->order_number}</b>",
            "Статус: {$order->status->label()}",
            "Кафе: {$order->cafe->name}",
            "Тип: {$order->type->label()}",
        ];

        if ($order->table !== null) {
            $lines[] = "Стол: {$order->table->number}";
        }

        $lines[] = "Клиент: {$order->customer_name}";

        if ($order->customer_phone !== null) {
            $lines[] = "Телефон: {$order->customer_phone}";
        }
        $lines[] = "";
        $lines[] = "<b>Состав заказа:</b>";

        foreach ($order->items as $item) {
            $line = "• {$item->dish->name} x{$item->quantity} — {$item->unit_price}";

            if ($item->variant !== null) {
                $line .= " ({$item->variant->name})";
            }

            $lines[] = $line;

            foreach ($item->addons as $addon) {
                $lines[] = "   + {$addon->addon->name} ({$addon->price})";
            }

            if ($item->comment !== null) {
                $lines[] = "   Комментарий: {$item->comment}";
            }
        }

        if ($order->comment !== null) {
            $lines[] = "";
            $lines[] = "Комментарий к заказу: {$order->comment}";
        }

        $lines[] = "";
        $lines[] = "<b>Итого: {$order->total_amount} {$order->cafe->currency}</b>";
        $lines[] = $order->created_at->format("d.m.Y H:i");

        return implode("\n", $lines);
    }

    private function statusEmoji(Order $order): string
    {
        return match ($order->status->value) {
            "new" => "🆕",
            "accepted" => "✅",
            "preparing" => "👨‍🍳",
            "ready" => "📦",
            "delivered" => "🎉",
            "cancelled" => "❌",
            default => "🆕",
        };
    }
}
