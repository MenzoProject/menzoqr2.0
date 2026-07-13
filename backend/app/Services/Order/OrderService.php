<?php

declare(strict_types=1);

namespace App\Services\Order;

use App\DTO\OrderData;
use App\Enums\OrderStatus;
use App\Events\OrderCreated;
use App\Jobs\SendOrderNotificationJob;
use App\Models\Dish;
use App\Models\DishAddon;
use App\Models\DishVariant;
use App\Models\Order;
use App\Repositories\Contracts\OrderRepositoryInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use InvalidArgumentException;

final class OrderService
{
    public function __construct(
        private readonly OrderRepositoryInterface $orders,
    ) {
    }

    public function createOrder(OrderData $data): Order
    {
        return DB::transaction(function () use ($data): Order {
            $order = $this->orders->create([
                "cafe_id" => $data->cafeId,
                "table_id" => $data->tableId,
                "order_number" => $this->generateOrderNumber(),
                "type" => $data->type,
                "status" => OrderStatus::New,
                "customer_name" => $data->customerName,
                "customer_phone" => $data->customerPhone,
                "comment" => $data->comment,
                "payment_method" => $data->paymentMethod,
                "total_amount" => 0,
            ]);

            $total = 0.0;

            foreach ($data->items as $itemData) {
                $dish = Dish::query()->with("category")->findOrFail($itemData->dishId);

                // A dish must belong to the cafe being ordered from — without this,
                // a crafted request could bill one cafe's order using another
                // cafe's dish (wrong price, wrong kitchen, wrong Telegram chat).
                if ($dish->category->cafe_id !== $data->cafeId) {
                    throw new InvalidArgumentException("Dish #{$dish->id} does not belong to this cafe.");
                }

                if (! $dish->is_active || ! $dish->is_available) {
                    throw new InvalidArgumentException("Dish \"{$dish->name}\" is not available right now.");
                }

                $variant = $itemData->dishVariantId !== null
                    ? DishVariant::query()->where("dish_id", $dish->id)->findOrFail($itemData->dishVariantId)
                    : null;

                $unitPrice = (float) $dish->price + (float) ($variant?->price_modifier ?? 0);

                $orderItem = $order->items()->create([
                    "dish_id" => $dish->id,
                    "dish_variant_id" => $variant?->id,
                    "quantity" => $itemData->quantity,
                    "unit_price" => $unitPrice,
                    "comment" => $itemData->comment,
                ]);

                $itemTotal = $unitPrice * $itemData->quantity;

                foreach ($itemData->addons as $addonData) {
                    $addon = DishAddon::query()->where("dish_id", $dish->id)->findOrFail($addonData->dishAddonId);

                    $orderItem->addons()->create([
                        "dish_addon_id" => $addon->id,
                        "price" => $addon->price,
                    ]);

                    $itemTotal += (float) $addon->price * $itemData->quantity;
                }

                $total += $itemTotal;
            }

            if ($total <= 0) {
                throw new InvalidArgumentException("Order must contain at least one item with a positive price.");
            }

            $order->update(["total_amount" => $total]);

            $order->statusHistories()->create(["status" => OrderStatus::New]);

            $order = $order->fresh(["items.dish", "items.variant", "items.addons.addon", "table", "cafe"]);

            OrderCreated::dispatch($order);
            SendOrderNotificationJob::dispatch($order);

            return $order;
        });
    }

    private function generateOrderNumber(): string
    {
        return strtoupper(Str::random(4))."-".now()->format("ymd")."-".random_int(100, 999);
    }
}
