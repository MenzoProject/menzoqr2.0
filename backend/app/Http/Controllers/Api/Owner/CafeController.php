<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Owner;

use App\DTO\CafeData;
use App\Http\Controllers\Controller;
use App\Http\Requests\Cafe\StoreCafeRequest;
use App\Http\Requests\Cafe\UpdateCafeRequest;
use App\Http\Resources\CafeResource;
use App\Models\Cafe;
use App\Services\Cafe\CafeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class CafeController extends Controller
{
    public function __construct(
        private readonly CafeService $cafeService,
    ) {
    }

    public function index(Request $request): JsonResponse
    {
        $cafes = $this->cafeService->listForOwner($request->user()->id);

        return response()->json(CafeResource::collection($cafes));
    }

    public function store(StoreCafeRequest $request): JsonResponse
    {
        $cafe = $this->cafeService->create(CafeData::fromArray([
            ...$request->validated(),
            "owner_id" => $request->user()->id,
            "slug" => $request->validated("name"),
        ]));

        return response()->json(new CafeResource($cafe), 201);
    }

    public function show(Request $request, Cafe $cafe): JsonResponse
    {
        $this->authorize("view", $cafe);

        return response()->json(new CafeResource($cafe));
    }

    public function update(UpdateCafeRequest $request, Cafe $cafe): JsonResponse
    {
        $this->authorize("update", $cafe);

        $updated = $this->cafeService->update($cafe, CafeData::fromArray([
            ...$cafe->only(["owner_id", "slug", "name", "address", "phone", "currency", "logo_path", "is_active"]),
            ...$request->validated(),
        ]));

        return response()->json(new CafeResource($updated));
    }

    public function destroy(Cafe $cafe): JsonResponse
    {
        $this->authorize("delete", $cafe);

        $this->cafeService->delete($cafe);

        return response()->json(["message" => "Кафе удалено."]);
    }
}
