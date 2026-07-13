<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\PaymentStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    protected $fillable = [
        "order_id",
        "provider",
        "status",
        "amount",
        "transaction_id",
        "paid_at",
    ];

    protected function casts(): array
    {
        return [
            "status" => PaymentStatus::class,
            "amount" => "decimal:2",
            "paid_at" => "datetime",
        ];
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }
}
