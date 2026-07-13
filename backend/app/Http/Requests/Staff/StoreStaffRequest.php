<?php

declare(strict_types=1);

namespace App\Http\Requests\Staff;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

final class StoreStaffRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            "name" => ["required", "string", "max:255"],
            "email" => ["required", "email", "max:255", "unique:users,email"],
            "phone" => ["nullable", "string", "max:30"],
            "password" => ["required", Password::min(8)->mixedCase()->numbers()],
            "role" => ["required", Rule::in(["manager", "staff"])],
        ];
    }
}
