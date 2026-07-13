<?php

declare(strict_types=1);

namespace App\Services\Notification;

use App\Models\NotificationLog;
use App\Models\Order;
use App\Services\Notification\Contracts\NotificationChannel;
use Illuminate\Support\Facades\Log;
use Throwable;

final class NotificationDispatcher
{
    /**
     * @param iterable<int, NotificationChannel> $channels
     */
    public function __construct(
        private readonly iterable $channels,
    ) {
    }

    public function dispatch(Order $order): void
    {
        foreach ($this->channels as $channel) {
            if (! $channel->isAvailableFor($order)) {
                continue;
            }

            $this->sendThroughChannel($channel, $order);
        }
    }

    private function sendThroughChannel(NotificationChannel $channel, Order $order): void
    {
        try {
            $sent = $channel->send($order);

            NotificationLog::query()->create([
                "order_id" => $order->id,
                "channel" => $channel->key(),
                "status" => $sent ? "sent" : "failed",
                "sent_at" => $sent ? now() : null,
            ]);
        } catch (Throwable $exception) {
            Log::error("Notification channel [{$channel->key()}] failed for order #{$order->id}: {$exception->getMessage()}");

            NotificationLog::query()->create([
                "order_id" => $order->id,
                "channel" => $channel->key(),
                "status" => "failed",
                "error_message" => $exception->getMessage(),
            ]);
        }
    }
}
