<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DishAddon extends Model
{
    protected $fillable = [
        "dish_id",
        "name",
        "price",
        "is_active",
    ];

    protected function casts(): array
    {
        return [
            "price" => "decimal:2",
            "is_active" => "boolean",
        ];
    }

    public function dish(): BelongsTo
    {
        return $this->belongsTo(Dish::class);
    }
}
