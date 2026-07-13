<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\OrderStatus;
use App\Enums\OrderType;
use App\Enums\PaymentMethod;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        "cafe_id",
        "table_id",
        "order_number",
        "type",
        "status",
        "customer_name",
        "customer_phone",
        "comment",
        "total_amount",
        "payment_method",
        "telegram_message_id",
    ];

    protected function casts(): array
    {
        return [
            "type" => OrderType::class,
            "status" => OrderStatus::class,
            "payment_method" => PaymentMethod::class,
            "total_amount" => "decimal:2",
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

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function statusHistories(): HasMany
    {
        return $this->hasMany(OrderStatusHistory::class);
    }

    public function payment(): HasMany
    {
        return $this->hasMany(Payment::class);
    }
}
