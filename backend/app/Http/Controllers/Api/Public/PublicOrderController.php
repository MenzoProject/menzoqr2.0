<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Public;

use App\DTO\OrderData;
use App\Http\Controllers\Controller;
use App\Http\Requests\Order\StorePublicOrderRequest;
use App\Http\Resources\OrderResource;
use App\Models\Cafe;
use App\Models\Order;
use App\Models\Table;
use App\Services\Order\OrderService;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

final class PublicOrderController extends Controller
{
    public function __construct(
        private readonly OrderService $orderService,
    ) {
    }

    public function store(StorePublicOrderRequest $request, string $cafeSlug): JsonResponse
    {
        $cafe = Cafe::query()->where("slug", $cafeSlug)->where("is_active", true)->firstOrFail();

        $tableId = $request->validated("table_id");

        // A table_id must belong to the cafe being ordered from — otherwise a
        // crafted request could attach someone else's table to this order.
        if ($tableId !== null && ! Table::query()->where("id", $tableId)->where("cafe_id", $cafe->id)->exists()) {
            throw ValidationException::withMessages([
                "table_id" => "Этот стол не относится к выбранному кафе.",
            ]);
        }

        $order = $this->orderService->createOrder(OrderData::fromArray([
            ...$request->validated(),
            "cafe_id" => $cafe->id,
        ]));

        return response()->json(new OrderResource($order), 201);
    }

    public function status(string $orderNumber): JsonResponse
    {
        $order = Order::query()
            ->with(["items.dish", "items.variant", "items.addons.addon", "table"])
            ->where("order_number", $orderNumber)
            ->firstOrFail();

        return response()->json(new OrderResource($order));
    }
}
