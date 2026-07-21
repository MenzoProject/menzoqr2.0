<?php

declare(strict_types=1);

namespace App\Http\Requests\ComboOffer;

use Illuminate\Foundation\Http\FormRequest;

final class StoreComboOfferRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            "title" => ["required", "string", "max:255"],
            "description" => ["nullable", "string", "max:500"],
            "image" => ["nullable", "image", "max:4096"],
            "price" => ["required", "numeric", "min:0"],
            "original_price" => ["nullable", "numeric", "min:0", "gte:price"],
            "sort_order" => ["nullable", "integer", "min:0"],
            "is_active" => ["nullable", "boolean"],
        ];
    }
}
