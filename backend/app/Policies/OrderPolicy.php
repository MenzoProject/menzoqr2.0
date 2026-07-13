<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\Order;
use App\Models\User;

final class OrderPolicy
{
    public function view(User $user, Order $order): bool
    {
        return $this->belongsToCafe($user, $order);
    }

    public function updateStatus(User $user, Order $order): bool
    {
        return $this->belongsToCafe($user, $order);
    }

    private function belongsToCafe(User $user, Order $order): bool
    {
        $cafe = $order->cafe;

        if ($cafe->owner_id === $user->id) {
            return true;
        }

        return $cafe->staff()->where("users.id", $user->id)->exists();
    }
}
