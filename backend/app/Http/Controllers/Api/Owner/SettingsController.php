<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Owner;

use App\DTO\CafeData;
use App\Http\Controllers\Controller;
use App\Http\Requests\Cafe\UpdateSettingsRequest;
use App\Http\Resources\CafeResource;
use App\Models\Cafe;
use App\Services\Cafe\CafeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use RuntimeException;

final class SettingsController extends Controller
{
    public function __construct(
        private readonly CafeService $cafeService,
    ) {
    }

    public function show(Cafe $cafe): JsonResponse
    {
        $this->authorize("view", $cafe);

        return response()->json(new CafeResource($cafe));
    }

    public function update(UpdateSettingsRequest $request, Cafe $cafe): JsonResponse
    {
        $this->authorize("update", $cafe);

        $logoPath = $cafe->logo_path;

        if ($request->hasFile("logo")) {
            $newLogoPath = $request->file("logo")->store("logos", "public");

            if ($newLogoPath === false) {
                throw new RuntimeException("Не удалось сохранить логотип. Проверьте настройки хранилища.");
            }

            if ($logoPath !== null) {
                Storage::disk("public")->delete($logoPath);
            }

            $logoPath = $newLogoPath;
        }

        $updated = $this->cafeService->update($cafe, CafeData::fromArray([
            ...$cafe->only(["owner_id", "slug", "name", "address", "phone", "currency", "is_active"]),
            ...$request->validated(),
            "logo_path" => $logoPath,
        ]));

        return response()->json(new CafeResource($updated));
    }
}
