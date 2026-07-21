<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Owner;

use App\DTO\ComboOfferData;
use App\Http\Controllers\Controller;
use App\Http\Requests\ComboOffer\StoreComboOfferRequest;
use App\Http\Requests\ComboOffer\UpdateComboOfferRequest;
use App\Http\Resources\ComboOfferResource;
use App\Models\Cafe;
use App\Models\ComboOffer;
use App\Services\Cafe\ComboOfferService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use RuntimeException;

final class ComboOfferController extends Controller
{
    public function __construct(
        private readonly ComboOfferService $comboOfferService,
    ) {
    }

    public function index(Cafe $cafe): JsonResponse
    {
        $this->authorize("view", $cafe);

        return response()->json(ComboOfferResource::collection($this->comboOfferService->listForCafe($cafe)));
    }

    public function store(StoreComboOfferRequest $request, Cafe $cafe): JsonResponse
    {
        $this->authorize("manageMenu", $cafe);

        $imagePath = $request->hasFile("image") ? $this->storeComboImage($request->file("image")) : null;

        $combo = $this->comboOfferService->create(ComboOfferData::fromArray([
            ...$request->safe()->except(["image"]),
            "cafe_id" => $cafe->id,
            "image_path" => $imagePath,
        ]));

        return response()->json(new ComboOfferResource($combo), 201);
    }

    public function update(UpdateComboOfferRequest $request, Cafe $cafe, ComboOffer $comboOffer): JsonResponse
    {
        $this->authorize("manageMenu", $cafe);

        $imagePath = $comboOffer->image_path;

        if ($request->hasFile("image")) {
            $newImagePath = $this->storeComboImage($request->file("image"));

            if ($imagePath !== null) {
                Storage::disk("public")->delete($imagePath);
            }

            $imagePath = $newImagePath;
        }

        $updated = $this->comboOfferService->update($comboOffer, ComboOfferData::fromArray([
            ...$comboOffer->only(["title", "description", "price", "original_price", "sort_order", "is_active"]),
            ...$request->safe()->except(["image"]),
            "cafe_id" => $cafe->id,
            "image_path" => $imagePath,
        ]));

        return response()->json(new ComboOfferResource($updated));
    }

    public function destroy(Cafe $cafe, ComboOffer $comboOffer): JsonResponse
    {
        $this->authorize("manageMenu", $cafe);

        if ($comboOffer->image_path !== null) {
            Storage::disk("public")->delete($comboOffer->image_path);
        }

        $this->comboOfferService->delete($comboOffer);

        return response()->json(["message" => "Комбо-предложение удалено."]);
    }

    private function storeComboImage(UploadedFile $file): string
    {
        $path = $file->store("combos", "public");

        if ($path === false) {
            throw new RuntimeException("Не удалось сохранить изображение комбо. Проверьте настройки хранилища.");
        }

        return $path;
    }
}
