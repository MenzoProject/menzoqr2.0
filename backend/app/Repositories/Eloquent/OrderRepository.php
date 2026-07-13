<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Models\Order;
use App\Repositories\Contracts\OrderRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;

final class OrderRepository implements OrderRepositoryInterface
{
    public function find(int $id): ?Order
    {
        return Order::query()->with(["items.dish", "items.variant", "items.addons.addon", "table"])->find($id);
    }

    public function findByNumber(string $orderNumber): ?Order
    {
        return Order::query()
            ->with(["items.dish", "items.variant", "items.addons.addon", "table"])
            ->where("order_number", $orderNumber)
            ->first();
    }

    public function paginateForCafe(int $cafeId, int $perPage = 20): LengthAwarePaginator
    {
        return Order::query()
            ->where("cafe_id", $cafeId)
            ->with(["items.dish", "items.variant", "items.addons.addon", "table"])
            ->orderByDesc("created_at")
            ->paginate($perPage);
    }

    public function create(array $attributes): Order
    {
        return Order::query()->create($attributes);
    }

    public function updateStatus(Order $order, string $status): Order
    {
        $order->update(["status" => $status]);

        return $order->refresh();
    }
}
