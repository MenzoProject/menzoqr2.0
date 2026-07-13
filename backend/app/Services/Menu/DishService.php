<?php

declare(strict_types=1);

namespace App\Services\Menu;

use App\DTO\DishData;
use App\Models\Category;
use App\Models\Dish;
use App\Repositories\Contracts\DishRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

final class DishService
{
    public function __construct(
        private readonly DishRepositoryInterface $dishes,
    ) {
    }

    /**
     * @return Collection<int, Dish>
     */
    public function listForCategory(Category $category): Collection
    {
        return $this->dishes->allForCategory($category->id);
    }

    public function create(DishData $data): Dish
    {
        return $this->dishes->create($data);
    }

    public function update(Dish $dish, DishData $data): Dish
    {
        return $this->dishes->update($dish, $data);
    }

    public function delete(Dish $dish): void
    {
        $this->dishes->delete($dish);
    }

    /**
     * Synchronize a dish's variants with the given list. Existing variants whose id is
     * present are updated, unmatched existing variants are removed, and entries without
     * an id are created. This keeps the admin UI able to add/edit/remove variants in a
     * single form submission without a separate CRUD endpoint per variant.
     *
     * @param array<int, array{id?: int, name: string, price_modifier: float}> $variants
     */
    public function syncVariants(Dish $dish, array $variants): Dish
    {
        $keepIds = [];

        foreach ($variants as $index => $variant) {
            if (isset($variant["id"])) {
                $model = $dish->variants()->find($variant["id"]);

                if ($model !== null) {
                    $model->update([
                        "name" => $variant["name"],
                        "price_modifier" => $variant["price_modifier"],
                        "sort_order" => $index,
                    ]);
                    $keepIds[] = $model->id;

                    continue;
                }
            }

            $created = $dish->variants()->create([
                "name" => $variant["name"],
                "price_modifier" => $variant["price_modifier"],
                "sort_order" => $index,
            ]);
            $keepIds[] = $created->id;
        }

        $dish->variants()->whereNotIn("id", $keepIds)->delete();

        return $dish->refresh();
    }

    /**
     * @param array<int, array{id?: int, name: string, price: float, is_active?: bool}> $addons
     */
    public function syncAddons(Dish $dish, array $addons): Dish
    {
        $keepIds = [];

        foreach ($addons as $addon) {
            if (isset($addon["id"])) {
                $model = $dish->addons()->find($addon["id"]);

                if ($model !== null) {
                    $model->update([
                        "name" => $addon["name"],
                        "price" => $addon["price"],
                        "is_active" => $addon["is_active"] ?? true,
                    ]);
                    $keepIds[] = $model->id;

                    continue;
                }
            }

            $created = $dish->addons()->create([
                "name" => $addon["name"],
                "price" => $addon["price"],
                "is_active" => $addon["is_active"] ?? true,
            ]);
            $keepIds[] = $created->id;
        }

        $dish->addons()->whereNotIn("id", $keepIds)->delete();

        return $dish->refresh();
    }
}
