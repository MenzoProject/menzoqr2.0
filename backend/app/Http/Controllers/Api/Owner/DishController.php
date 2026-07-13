<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Owner;

use App\DTO\DishData;
use App\Http\Controllers\Controller;
use App\Http\Requests\Dish\StoreDishRequest;
use App\Http\Requests\Dish\UpdateDishRequest;
use App\Http\Resources\DishResource;
use App\Models\Cafe;
use App\Models\Category;
use App\Models\Dish;
use App\Services\Menu\DishService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use RuntimeException;

final class DishController extends Controller
{
    public function __construct(
        private readonly DishService $dishService,
    ) {
    }

    public function index(Cafe $cafe, Category $category): JsonResponse
    {
        $this->authorize("view", $cafe);

        return response()->json(DishResource::collection($this->dishService->listForCategory($category)));
    }

    public function store(StoreDishRequest $request, Cafe $cafe, Category $category): JsonResponse
    {
        $this->authorize("manageMenu", $cafe);

        $imagePath = $request->hasFile("image")
            ? $this->storeDishImage($request->file("image"))
            : null;

        $dish = $this->dishService->create(DishData::fromArray([
            ...$request->safe()->except(["image", "variants", "addons"]),
            "category_id" => $category->id,
            "image_path" => $imagePath,
        ]));

        if ($request->filled("variants")) {
            $dish = $this->dishService->syncVariants($dish, $request->input("variants"));
        }

        if ($request->filled("addons")) {
            $dish = $this->dishService->syncAddons($dish, $request->input("addons"));
        }

        return response()->json(new DishResource($dish->load(["variants", "addons"])), 201);
    }

    public function update(UpdateDishRequest $request, Cafe $cafe, Category $category, Dish $dish): JsonResponse
    {
        $this->authorize("update", $dish);

        $imagePath = $dish->image_path;

        if ($request->hasFile("image")) {
            $newImagePath = $this->storeDishImage($request->file("image"));

            if ($imagePath !== null) {
                Storage::disk("public")->delete($imagePath);
            }

            $imagePath = $newImagePath;
        }

        $updated = $this->dishService->update($dish, DishData::fromArray([
            ...$dish->only(["category_id", "name", "description", "price", "sort_order", "is_active"]),
            ...$request->safe()->except(["image", "variants", "addons"]),
            "image_path" => $imagePath,
        ]));

        if ($request->has("variants")) {
            $updated = $this->dishService->syncVariants($updated, $request->input("variants", []));
        }

        if ($request->has("addons")) {
            $updated = $this->dishService->syncAddons($updated, $request->input("addons", []));
        }

        return response()->json(new DishResource($updated->load(["variants", "addons"])));
    }

    public function destroy(Cafe $cafe, Category $category, Dish $dish): JsonResponse
    {
        $this->authorize("delete", $dish);

        $this->dishService->delete($dish);

        return response()->json(["message" => "Блюдо удалено."]);
    }

    /**
     * UploadedFile::store() returns `false` (not an exception) when the
     * write fails — e.g. a misconfigured disk. Previously that `false` was
     * saved straight into dishes.image_path, so the row looked like it had
     * a photo while no file existed at all: exactly the "image uploaded but
     * frontend shows a broken image" bug. Now a failed write is rejected
     * with a clear 500 instead of silently corrupting the dish record.
     */
    private function storeDishImage(UploadedFile $file): string
    {
        $path = $file->store("dishes", "public");

        if ($path === false) {
            throw new RuntimeException("Не удалось сохранить изображение блюда. Проверьте настройки хранилища.");
        }

        return $path;
    }
}
