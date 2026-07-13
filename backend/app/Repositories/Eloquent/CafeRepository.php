<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\DTO\CafeData;
use App\Models\Cafe;
use App\Repositories\Contracts\CafeRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

final class CafeRepository implements CafeRepositoryInterface
{
    public function find(int $id): ?Cafe
    {
        return Cafe::query()->find($id);
    }

    public function findBySlug(string $slug): ?Cafe
    {
        return Cafe::query()->where("slug", $slug)->first();
    }

    /**
     * Returns cafes owned by the user, plus cafes where they were added as staff.
     * Keeping the parameter name `ownerId` for interface compatibility, but it
     * is really "the acting user's id" — the query below covers both roles.
     */
    public function allForOwner(int $ownerId): Collection
    {
        return Cafe::query()
            ->where(function ($query) use ($ownerId) {
                $query->where("owner_id", $ownerId)
                    ->orWhereHas("staff", fn ($staffQuery) => $staffQuery->where("users.id", $ownerId));
            })
            ->orderBy("name")
            ->get();
    }

    public function create(CafeData $data): Cafe
    {
        return Cafe::query()->create($data->toArray());
    }

    public function update(Cafe $cafe, CafeData $data): Cafe
    {
        $cafe->update($data->toArray());

        return $cafe->refresh();
    }

    public function delete(Cafe $cafe): void
    {
        $cafe->delete();
    }
}
