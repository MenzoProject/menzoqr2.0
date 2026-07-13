<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\PublicCafeResource;
use App\Models\Cafe;
use Illuminate\Http\JsonResponse;

final class PublicMenuController extends Controller
{
    public function show(string $cafeSlug): JsonResponse
    {
        $cafe = Cafe::query()
            ->where("slug", $cafeSlug)
            ->where("is_active", true)
            ->with([
                "categories" => fn ($query) => $query->where("is_active", true)->orderBy("sort_order"),
                "categories.dishes" => fn ($query) => $query->where("is_active", true)->orderBy("sort_order"),
                "categories.dishes.variants",
                "categories.dishes.addons" => fn ($query) => $query->where("is_active", true),
            ])
            ->firstOrFail();

        return response()->json(new PublicCafeResource($cafe));
    }
}
