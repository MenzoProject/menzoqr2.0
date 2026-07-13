<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DishVariant extends Model
{
    protected $fillable = [
        "dish_id",
        "name",
        "price_modifier",
        "sort_order",
    ];

    protected function casts(): array
    {
        return [
            "price_modifier" => "decimal:2",
        ];
    }

    public function dish(): BelongsTo
    {
        return $this->belongsTo(Dish::class);
    }
}
