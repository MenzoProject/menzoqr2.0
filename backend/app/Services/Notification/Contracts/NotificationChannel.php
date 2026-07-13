<?php

declare(strict_types=1);

namespace App\Services\Notification\Contracts;

use App\Models\Order;

interface NotificationChannel
{
    /**
     * Unique channel identifier, e.g. "telegram", "whatsapp", "push", "email", "sms".
     */
    public function key(): string;

    /**
     * Whether this channel is configured and ready to send for the given order's cafe.
     */
    public function isAvailableFor(Order $order): bool;

    /**
     * Send the order notification through this channel. Returns true on success.
     */
    public function send(Order $order): bool;
}
