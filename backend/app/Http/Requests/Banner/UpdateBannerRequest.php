<?php

declare(strict_types=1);

namespace App\Http\Requests\Banner;

use Illuminate\Foundation\Http\FormRequest;

final class UpdateBannerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            "image" => ["nullable", "image", "max:4096"],
            "title" => ["nullable", "string", "max:255"],
            "subtitle" => ["nullable", "string", "max:500"],
            "sort_order" => ["nullable", "integer", "min:0"],
            "is_active" => ["nullable", "boolean"],
        ];
    }
}
