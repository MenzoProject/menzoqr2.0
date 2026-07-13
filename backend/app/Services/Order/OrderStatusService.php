<?php

declare(strict_types=1);

namespace App\Services\Order;

use App\Enums\OrderStatus;
use App\Events\OrderStatusChanged;
use App\Models\Order;
use App\Models\User;
use App\Repositories\Contracts\OrderRepositoryInterface;
use DomainException;
use Illuminate\Support\Facades\DB;

final class OrderStatusService
{
    public function __construct(
        private readonly OrderRepositoryInterface $orders,
    ) {
    }

    public function transitionTo(Order $order, OrderStatus $newStatus, ?User $changedBy = null): Order
    {
        $currentStatus = $order->status;

        if (! $currentStatus->canTransitionTo($newStatus)) {
            throw new DomainException(
                "Cannot transition order #{$order->id} from {$currentStatus->value} to {$newStatus->value}."
            );
        }

        return DB::transaction(function () use ($order, $newStatus, $currentStatus, $changedBy): Order {
            $updated = $this->orders->updateStatus($order, $newStatus->value);

            $updated->statusHistories()->create([
                "status" => $newStatus,
                "changed_by" => $changedBy?->id,
            ]);

            OrderStatusChanged::dispatch($updated, $currentStatus);

            return $updated;
        });
    }
}
