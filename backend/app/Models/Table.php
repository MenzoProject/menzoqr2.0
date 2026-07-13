<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Table extends Model
{
    protected $table = "tables";

    protected $fillable = [
        "cafe_id",
        "number",
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

    public function qrCode(): HasOne
    {
        return $this->hasOne(QrCode::class);
    }
}
