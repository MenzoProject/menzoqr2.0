<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\DTO\DishData;
use App\Models\Dish;
use Illuminate\Database\Eloquent\Collection;

interface DishRepositoryInterface
{
    public function find(int $id): ?Dish;

    /**
     * @return Collection<int, Dish>
     */
    public function allForCategory(int $categoryId): Collection;

    public function create(DishData $data): Dish;

    public function update(Dish $dish, DishData $data): Dish;

    public function delete(Dish $dish): void;
}
