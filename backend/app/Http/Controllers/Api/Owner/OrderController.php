<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Owner;

use App\Enums\OrderStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Order\UpdateOrderStatusRequest;
use App\Http\Resources\OrderResource;
use App\Models\Cafe;
use App\Models\Order;
use App\Repositories\Contracts\OrderRepositoryInterface;
use App\Services\Order\OrderStatusService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class OrderController extends Controller
{
    public function __construct(
        private readonly OrderRepositoryInterface $orders,
        private readonly OrderStatusService $orderStatusService,
    ) {
    }

    public function index(Request $request, Cafe $cafe): JsonResponse
    {
        $this->authorize("view", $cafe);

        $orders = $this->orders->paginateForCafe($cafe->id, (int) $request->integer("per_page", 20));

        return response()->json([
            "data" => OrderResource::collection($orders->items()),
            "meta" => [
                "current_page" => $orders->currentPage(),
                "last_page" => $orders->lastPage(),
                "total" => $orders->total(),
            ],
        ]);
    }

    public function show(Cafe $cafe, Order $order): JsonResponse
    {
        $this->authorize("view", $order);

        return response()->json(new OrderResource($order));
    }

    public function updateStatus(UpdateOrderStatusRequest $request, Cafe $cafe, Order $order): JsonResponse
    {
        $this->authorize("updateStatus", $order);

        $updated = $this->orderStatusService->transitionTo(
            $order,
            OrderStatus::from($request->validated("status")),
            $request->user(),
        );

        return response()->json(new OrderResource($updated->load(["items.dish", "items.variant", "items.addons.addon", "table"])));
    }
}
