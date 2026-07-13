<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\Models\Order;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

interface OrderRepositoryInterface
{
    public function find(int $id): ?Order;

    public function findByNumber(string $orderNumber): ?Order;

    public function paginateForCafe(int $cafeId, int $perPage = 20): LengthAwarePaginator;

    public function create(array $attributes): Order;

    public function updateStatus(Order $order, string $status): Order;
}
