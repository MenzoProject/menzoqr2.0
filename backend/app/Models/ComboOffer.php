<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ComboOffer extends Model
{
    use HasFactory;

    protected $fillable = [
        "cafe_id",
        "title",
        "description",
        "image_path",
        "price",
        "original_price",
        "sort_order",
        "is_active",
    ];

    protected function casts(): array
    {
        return [
            "price" => "decimal:2",
            "original_price" => "decimal:2",
            "is_active" => "boolean",
        ];
    }

    public function cafe(): BelongsTo
    {
        return $this->belongsTo(Cafe::class);
    }
}
