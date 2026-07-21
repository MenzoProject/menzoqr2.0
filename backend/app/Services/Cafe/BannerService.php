<?php

declare(strict_types=1);

namespace App\Services\Cafe;

use App\DTO\BannerData;
use App\Models\Banner;
use App\Models\Cafe;
use Illuminate\Database\Eloquent\Collection;

final class BannerService
{
    /**
     * @return Collection<int, Banner>
     */
    public function listForCafe(Cafe $cafe): Collection
    {
        return $cafe->banners()->orderBy("sort_order")->get();
    }

    public function create(BannerData $data): Banner
    {
        return Banner::query()->create($data->toArray());
    }

    public function update(Banner $banner, BannerData $data): Banner
    {
        $banner->update($data->toArray());

        return $banner->refresh();
    }

    public function delete(Banner $banner): void
    {
        $banner->delete();
    }
}
