<?php

declare(strict_types=1);

namespace App\Http\Requests\Dish;

use App\Enums\DishTag;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

final class UpdateDishRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            "name" => ["sometimes", "required", "string", "max:255"],
            "description" => ["nullable", "string", "max:2000"],
            "price" => ["sometimes", "required", "numeric", "min:0"],
            "image" => ["nullable", "image", "max:4096"],
            "sort_order" => ["nullable", "integer", "min:0"],
            "is_active" => ["nullable", "boolean"],
            "is_available" => ["nullable", "boolean"],
            "tags" => ["nullable", "array"],
            "tags.*" => [Rule::in(array_map(fn (DishTag $tag) => $tag->value, DishTag::cases()))],
            "variants" => ["nullable", "array"],
            "variants.*.id" => ["nullable", "integer"],
            "variants.*.name" => ["required_with:variants", "string", "max:255"],
            "variants.*.price_modifier" => ["required_with:variants", "numeric"],
            "addons" => ["nullable", "array"],
            "addons.*.id" => ["nullable", "integer"],
            "addons.*.name" => ["required_with:addons", "string", "max:255"],
            "addons.*.price" => ["required_with:addons", "numeric", "min:0"],
            "addons.*.is_active" => ["nullable", "boolean"],
        ];
    }
}
