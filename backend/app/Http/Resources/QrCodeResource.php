<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Services\QrCode\QrCodeService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

final class QrCodeResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            "id" => $this->id,
            "type" => $this->type->value,
            "code" => $this->code,
            "table" => $this->whenLoaded("table", fn () => [
                "id" => $this->table->id,
                "number" => $this->table->number,
            ]),
            // Storage::disk('public')->url() (rather than asset("storage/...")
            // built by hand) respects whatever disk is actually configured —
            // local ("APP_URL/storage/...") today, S3/CDN tomorrow — without
            // any code changes here.
            "image_url" => $this->image_path ? Storage::disk("public")->url($this->image_path) : null,
            // The link a scan of this QR ultimately lands on — shown/copyable
            // in the owner dashboard even before printing the code.
            "public_url" => app(QrCodeService::class)->targetUrl($this->resource),
            "scans_count" => $this->scans_count,
            "created_at" => $this->created_at?->toIso8601String(),
        ];
    }
}
