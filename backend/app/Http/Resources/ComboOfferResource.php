<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

final class ComboOfferResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            "id" => $this->id,
            "title" => $this->title,
            "description" => $this->description,
            "image_url" => $this->image_path ? Storage::disk("public")->url($this->image_path) : null,
            "price" => (float) $this->price,
            "original_price" => $this->original_price !== null ? (float) $this->original_price : null,
            "sort_order" => $this->sort_order,
            "is_active" => $this->is_active,
        ];
    }
}
