<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

final class BannerResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            "id" => $this->id,
            "image_url" => $this->image_path ? Storage::disk("public")->url($this->image_path) : null,
            "title" => $this->title,
            "subtitle" => $this->subtitle,
            "sort_order" => $this->sort_order,
            "is_active" => $this->is_active,
        ];
    }
}
