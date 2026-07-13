<?php

declare(strict_types=1);

namespace App\Http\Requests\Staff;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

final class UpdateStaffRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            "name" => ["sometimes", "required", "string", "max:255"],
            "phone" => ["nullable", "string", "max:30"],
            "role" => ["sometimes", "required", Rule::in(["manager", "staff"])],
            "is_active" => ["sometimes", "boolean"],
        ];
    }
}
