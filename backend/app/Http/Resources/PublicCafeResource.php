<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

final class PublicCafeResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            "name" => $this->name,
            "slug" => $this->slug,
            "logo_url" => $this->logo_path ? Storage::disk("public")->url($this->logo_path) : null,
            "address" => $this->address,
            "phone" => $this->phone,
            "currency" => $this->currency,
            "categories" => CategoryResource::collection($this->whenLoaded("categories")),
        ];
    }
}
