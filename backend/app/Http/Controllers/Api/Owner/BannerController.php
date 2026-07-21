<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Owner;

use App\DTO\BannerData;
use App\Http\Controllers\Controller;
use App\Http\Requests\Banner\StoreBannerRequest;
use App\Http\Requests\Banner\UpdateBannerRequest;
use App\Http\Resources\BannerResource;
use App\Models\Banner;
use App\Models\Cafe;
use App\Services\Cafe\BannerService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use RuntimeException;

final class BannerController extends Controller
{
    public function __construct(
        private readonly BannerService $bannerService,
    ) {
    }

    public function index(Cafe $cafe): JsonResponse
    {
        $this->authorize("view", $cafe);

        return response()->json(BannerResource::collection($this->bannerService->listForCafe($cafe)));
    }

    public function store(StoreBannerRequest $request, Cafe $cafe): JsonResponse
    {
        $this->authorize("manageMenu", $cafe);

        $banner = $this->bannerService->create(BannerData::fromArray([
            ...$request->safe()->except(["image"]),
            "cafe_id" => $cafe->id,
            "image_path" => $this->storeBannerImage($request->file("image")),
        ]));

        return response()->json(new BannerResource($banner), 201);
    }

    public function update(UpdateBannerRequest $request, Cafe $cafe, Banner $banner): JsonResponse
    {
        $this->authorize("manageMenu", $cafe);

        $imagePath = $banner->image_path;

        if ($request->hasFile("image")) {
            $newImagePath = $this->storeBannerImage($request->file("image"));
            Storage::disk("public")->delete($imagePath);
            $imagePath = $newImagePath;
        }

        $updated = $this->bannerService->update($banner, BannerData::fromArray([
            ...$banner->only(["title", "subtitle", "sort_order", "is_active"]),
            ...$request->safe()->except(["image"]),
            "cafe_id" => $cafe->id,
            "image_path" => $imagePath,
        ]));

        return response()->json(new BannerResource($updated));
    }

    public function destroy(Cafe $cafe, Banner $banner): JsonResponse
    {
        $this->authorize("manageMenu", $cafe);

        Storage::disk("public")->delete($banner->image_path);
        $this->bannerService->delete($banner);

        return response()->json(["message" => "Баннер удалён."]);
    }

    private function storeBannerImage(UploadedFile $file): string
    {
        $path = $file->store("banners", "public");

        if ($path === false) {
            throw new RuntimeException("Не удалось сохранить изображение баннера. Проверьте настройки хранилища.");
        }

        return $path;
    }
}
