<?php

declare(strict_types=1);

namespace App\Services\Cafe;

use App\DTO\CafeData;
use App\Models\Cafe;
use App\Repositories\Contracts\CafeRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Str;

final class CafeService
{
    public function __construct(
        private readonly CafeRepositoryInterface $cafes,
    ) {
    }

    /**
     * @return Collection<int, Cafe>
     */
    public function listForOwner(int $ownerId): Collection
    {
        return $this->cafes->allForOwner($ownerId);
    }

    public function create(CafeData $data): Cafe
    {
        $slug = $this->generateUniqueSlug($data->name);

        return $this->cafes->create(new CafeData(
            ownerId: $data->ownerId,
            name: $data->name,
            slug: $slug,
            address: $data->address,
            phone: $data->phone,
            currency: $data->currency,
            logoPath: $data->logoPath,
            isActive: $data->isActive,
        ));
    }

    public function update(Cafe $cafe, CafeData $data): Cafe
    {
        return $this->cafes->update($cafe, $data);
    }

    public function delete(Cafe $cafe): void
    {
        $this->cafes->delete($cafe);
    }

    private function generateUniqueSlug(string $name): string
    {
        $baseSlug = Str::slug($name);
        $slug = $baseSlug;
        $counter = 1;

        while ($this->cafes->findBySlug($slug) !== null) {
            $slug = "{$baseSlug}-{$counter}";
            $counter++;
        }

        return $slug;
    }
}
