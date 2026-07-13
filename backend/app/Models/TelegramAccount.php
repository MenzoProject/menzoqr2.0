<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\TelegramConnectionStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TelegramAccount extends Model
{
    protected $fillable = [
        "cafe_id",
        "chat_id",
        "link_token",
        "status",
        "connected_at",
    ];

    protected function casts(): array
    {
        return [
            "status" => TelegramConnectionStatus::class,
            "connected_at" => "datetime",
        ];
    }

    public function cafe(): BelongsTo
    {
        return $this->belongsTo(Cafe::class);
    }

    public function isConnected(): bool
    {
        return $this->status === TelegramConnectionStatus::Connected && $this->chat_id !== null;
    }
}
