<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\DTO\DishData;
use App\Models\Dish;
use App\Repositories\Contracts\DishRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

final class DishRepository implements DishRepositoryInterface
{
    public function find(int $id): ?Dish
    {
        return Dish::query()->with(["variants", "addons"])->find($id);
    }

    public function allForCategory(int $categoryId): Collection
    {
        return Dish::query()
            ->where("category_id", $categoryId)
            ->with(["variants", "addons"])
            ->orderBy("sort_order")
            ->get();
    }

    public function create(DishData $data): Dish
    {
        return Dish::query()->create($data->toArray());
    }

    public function update(Dish $dish, DishData $data): Dish
    {
        $dish->update($data->toArray());

        return $dish->refresh();
    }

    public function delete(Dish $dish): void
    {
        $dish->delete();
    }
}
