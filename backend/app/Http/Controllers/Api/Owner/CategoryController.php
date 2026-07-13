<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Owner;

use App\Http\Controllers\Controller;
use App\Http\Requests\Category\StoreCategoryRequest;
use App\Http\Requests\Category\UpdateCategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Models\Cafe;
use App\Models\Category;
use App\Services\Menu\CategoryService;
use Illuminate\Http\JsonResponse;

final class CategoryController extends Controller
{
    public function __construct(
        private readonly CategoryService $categoryService,
    ) {
    }

    public function index(Cafe $cafe): JsonResponse
    {
        $this->authorize("view", $cafe);

        return response()->json(CategoryResource::collection($this->categoryService->listForCafe($cafe)));
    }

    public function store(StoreCategoryRequest $request, Cafe $cafe): JsonResponse
    {
        $this->authorize("manageMenu", $cafe);

        $category = $this->categoryService->create($cafe, $request->validated());

        return response()->json(new CategoryResource($category), 201);
    }

    public function update(UpdateCategoryRequest $request, Cafe $cafe, Category $category): JsonResponse
    {
        $this->authorize("manageMenu", $cafe);

        $updated = $this->categoryService->update($category, $request->validated());

        return response()->json(new CategoryResource($updated));
    }

    public function destroy(Cafe $cafe, Category $category): JsonResponse
    {
        $this->authorize("manageMenu", $cafe);

        $this->categoryService->delete($category);

        return response()->json(["message" => "Категория удалена."]);
    }
}
