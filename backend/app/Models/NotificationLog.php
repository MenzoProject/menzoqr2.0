<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NotificationLog extends Model
{
    protected $fillable = [
        "order_id",
        "channel",
        "status",
        "payload",
        "error_message",
        "sent_at",
    ];

    protected function casts(): array
    {
        return [
            "payload" => "array",
            "sent_at" => "datetime",
        ];
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }
}
