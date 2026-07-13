<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Cafe extends Model
{
    use HasFactory;

    protected $fillable = [
        "owner_id",
        "name",
        "slug",
        "logo_path",
        "address",
        "phone",
        "currency",
        "is_active",
    ];

    protected function casts(): array
    {
        return [
            "is_active" => "boolean",
        ];
    }

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, "owner_id");
    }

    public function staff(): BelongsToMany
    {
        return $this->belongsToMany(User::class, "cafe_user")
            ->withPivot("role_id")
            ->withTimestamps();
    }

    public function categories(): HasMany
    {
        return $this->hasMany(Category::class);
    }

    public function tables(): HasMany
    {
        return $this->hasMany(Table::class);
    }

    public function qrCodes(): HasMany
    {
        return $this->hasMany(QrCode::class);
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    public function telegramAccount(): HasOne
    {
        return $this->hasOne(TelegramAccount::class);
    }
}
