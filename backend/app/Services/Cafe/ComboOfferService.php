<?php

declare(strict_types=1);

namespace App\Services\Cafe;

use App\DTO\ComboOfferData;
use App\Models\Cafe;
use App\Models\ComboOffer;
use Illuminate\Database\Eloquent\Collection;

final class ComboOfferService
{
    /**
     * @return Collection<int, ComboOffer>
     */
    public function listForCafe(Cafe $cafe): Collection
    {
        return $cafe->comboOffers()->orderBy("sort_order")->get();
    }

    public function create(ComboOfferData $data): ComboOffer
    {
        return ComboOffer::query()->create($data->toArray());
    }

    public function update(ComboOffer $comboOffer, ComboOfferData $data): ComboOffer
    {
        $comboOffer->update($data->toArray());

        return $comboOffer->refresh();
    }

    public function delete(ComboOffer $comboOffer): void
    {
        $comboOffer->delete();
    }
}
