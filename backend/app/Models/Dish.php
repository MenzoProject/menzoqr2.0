<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class Dish extends Model
{
    use HasFactory;

    protected $fillable = [
        "category_id",
        "name",
        "description",
        "price",
        "image_path",
        "sort_order",
        "is_active",
        "is_available",
        "tags",
    ];

    protected function casts(): array
    {
        return [
            "price" => "decimal:2",
            "is_active" => "boolean",
            "is_available" => "boolean",
            "tags" => "array",
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function variants(): HasMany
    {
        return $this->hasMany(DishVariant::class);
    }

    public function addons(): HasMany
    {
        return $this->hasMany(DishAddon::class);
    }
}
