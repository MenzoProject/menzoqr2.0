<?php

declare(strict_types=1);

namespace App\Http\Requests\Cafe;

use Illuminate\Foundation\Http\FormRequest;

final class StoreCafeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            "name" => ["required", "string", "max:255"],
            "address" => ["nullable", "string", "max:255"],
            "phone" => ["nullable", "string", "max:30"],
            "currency" => ["nullable", "string", "size:3"],
        ];
    }
}
