<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens;
    use HasFactory;
    use Notifiable;

    protected $fillable = [
        "name",
        "email",
        "phone",
        "password",
        "is_active",
    ];

    protected $hidden = [
        "password",
        "remember_token",
    ];

    protected function casts(): array
    {
        return [
            "email_verified_at" => "datetime",
            "password" => "hashed",
            "is_active" => "boolean",
        ];
    }

    public function ownedCafes(): HasMany
    {
        return $this->hasMany(Cafe::class, "owner_id");
    }

    public function cafes(): BelongsToMany
    {
        return $this->belongsToMany(Cafe::class, "cafe_user")
            ->withPivot("role_id")
            ->withTimestamps();
    }

    public function roleForCafe(Cafe $cafe): ?Role
    {
        $pivot = $this->cafes()->where("cafes.id", $cafe->id)->first()?->pivot;

        if ($pivot === null) {
            return null;
        }

        return Role::query()->find($pivot->role_id);
    }
}
