<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\OrderType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class QrCode extends Model
{
    protected $table = "qr_codes";

    protected $fillable = [
        "cafe_id",
        "table_id",
        "type",
        "code",
        "image_path",
        "scans_count",
    ];

    protected function casts(): array
    {
        return [
            "type" => OrderType::class,
        ];
    }

    public function cafe(): BelongsTo
    {
        return $this->belongsTo(Cafe::class);
    }

    public function table(): BelongsTo
    {
        return $this->belongsTo(Table::class);
    }

    public function incrementScans(): void
    {
        $this->increment("scans_count");
    }
}
