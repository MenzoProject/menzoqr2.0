<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class OrderItem extends Model
{
    protected $fillable = [
        "order_id",
        "dish_id",
        "dish_variant_id",
        "quantity",
        "unit_price",
        "comment",
    ];

    protected function casts(): array
    {
        return [
            "unit_price" => "decimal:2",
        ];
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function dish(): BelongsTo
    {
        return $this->belongsTo(Dish::class);
    }

    public function variant(): BelongsTo
    {
        return $this->belongsTo(DishVariant::class, "dish_variant_id");
    }

    public function addons(): HasMany
    {
        return $this->hasMany(OrderItemAddon::class);
    }
}
