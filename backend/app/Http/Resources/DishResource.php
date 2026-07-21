<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Enums\DishTag;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

final class DishResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            "id" => $this->id,
            "category_id" => $this->category_id,
            "name" => $this->name,
            "description" => $this->description,
            "price" => (float) $this->price,
            "image_url" => $this->image_path ? Storage::disk("public")->url($this->image_path) : null,
            "is_active" => $this->is_active,
            "is_available" => $this->is_available,
            "is_popular" => $this->is_popular,
            "tags" => array_map(
                static fn (string $tag): array => [
                    "value" => $tag,
                    "label" => DishTag::from($tag)->label(),
                ],
                $this->tags ?? []
            ),
            "variants" => DishVariantResource::collection($this->whenLoaded("variants")),
            "addons" => DishAddonResource::collection($this->whenLoaded("addons")),
        ];
    }
}
