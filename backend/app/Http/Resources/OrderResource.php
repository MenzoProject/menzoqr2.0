<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

final class OrderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            "id" => $this->id,
            "order_number" => $this->order_number,
            "type" => $this->type->value,
            "type_label" => $this->type->label(),
            "status" => $this->status->value,
            "status_label" => $this->status->label(),
            "table" => $this->whenLoaded("table", fn () => $this->table ? [
                "id" => $this->table->id,
                "number" => $this->table->number,
            ] : null),
            "customer_name" => $this->customer_name,
            "customer_phone" => $this->customer_phone,
            "comment" => $this->comment,
            "payment_method" => $this->payment_method->value,
            "total_amount" => (float) $this->total_amount,
            "items" => OrderItemResource::collection($this->whenLoaded("items")),
            "created_at" => $this->created_at?->toIso8601String(),
        ];
    }
}
