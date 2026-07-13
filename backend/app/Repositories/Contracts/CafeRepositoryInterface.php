<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\DTO\CafeData;
use App\Models\Cafe;
use Illuminate\Database\Eloquent\Collection;

interface CafeRepositoryInterface
{
    public function find(int $id): ?Cafe;

    public function findBySlug(string $slug): ?Cafe;

    /**
     * @return Collection<int, Cafe>
     */
    public function allForOwner(int $ownerId): Collection;

    public function create(CafeData $data): Cafe;

    public function update(Cafe $cafe, CafeData $data): Cafe;

    public function delete(Cafe $cafe): void;
}
