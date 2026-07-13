<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Models\Order;
use App\Services\Notification\NotificationDispatcher;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

final class SendOrderNotificationJob implements ShouldQueue
{
    use Dispatchable;
    use InteractsWithQueue;
    use Queueable;
    use SerializesModels;

    public int $tries = 3;

    public int $backoff = 10;

    public function __construct(
        public readonly Order $order,
    ) {
    }

    public function handle(NotificationDispatcher $dispatcher): void
    {
        $dispatcher->dispatch($this->order->fresh(["items.dish", "items.variant", "items.addons.addon", "table", "cafe.telegramAccount"]));
    }
}
