<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

final class OrderItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            "id" => $this->id,
            "dish_name" => $this->dish->name,
            "variant_name" => $this->variant?->name,
            "quantity" => $this->quantity,
            "unit_price" => (float) $this->unit_price,
            "comment" => $this->comment,
            "addons" => OrderItemAddonResource::collection($this->whenLoaded("addons")),
        ];
    }
}
