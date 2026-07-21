<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Banner extends Model
{
    use HasFactory;

    protected $fillable = [
        "cafe_id",
        "image_path",
        "title",
        "subtitle",
        "sort_order",
        "is_active",
    ];

    protected function casts(): array
    {
        return [
            "is_active" => "boolean",
        ];
    }

    public function cafe(): BelongsTo
    {
        return $this->belongsTo(Cafe::class);
    }
}
