<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

final class CafeResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            "id" => $this->id,
            "name" => $this->name,
            "slug" => $this->slug,
            "logo_url" => $this->logo_path ? Storage::disk("public")->url($this->logo_path) : null,
            "address" => $this->address,
            "phone" => $this->phone,
            "currency" => $this->currency,
            "is_active" => $this->is_active,
            "created_at" => $this->created_at?->toIso8601String(),
        ];
    }
}
