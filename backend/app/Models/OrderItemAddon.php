<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderItemAddon extends Model
{
    protected $fillable = [
        "order_item_id",
        "dish_addon_id",
        "price",
    ];

    protected function casts(): array
    {
        return [
            "price" => "decimal:2",
        ];
    }

    public function orderItem(): BelongsTo
    {
        return $this->belongsTo(OrderItem::class);
    }

    public function addon(): BelongsTo
    {
        return $this->belongsTo(DishAddon::class, "dish_addon_id");
    }
}
