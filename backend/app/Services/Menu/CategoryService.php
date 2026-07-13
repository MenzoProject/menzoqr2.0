<?php

declare(strict_types=1);

namespace App\Services\Menu;

use App\Models\Cafe;
use App\Models\Category;
use Illuminate\Database\Eloquent\Collection;

final class CategoryService
{
    /**
     * @return Collection<int, Category>
     */
    public function listForCafe(Cafe $cafe): Collection
    {
        return $cafe->categories()
            ->with([
                "dishes" => fn ($query) => $query->orderBy("sort_order"),
                "dishes.variants",
                "dishes.addons",
            ])
            ->orderBy("sort_order")
            ->get();
    }

    public function create(Cafe $cafe, array $attributes): Category
    {
        return $cafe->categories()->create([
            "name" => $attributes["name"],
            "sort_order" => $attributes["sort_order"] ?? 0,
            "is_active" => $attributes["is_active"] ?? true,
        ]);
    }

    public function update(Category $category, array $attributes): Category
    {
        $category->update([
            "name" => $attributes["name"] ?? $category->name,
            "sort_order" => $attributes["sort_order"] ?? $category->sort_order,
            "is_active" => $attributes["is_active"] ?? $category->is_active,
        ]);

        return $category->refresh();
    }

    public function delete(Category $category): void
    {
        $category->delete();
    }
}
