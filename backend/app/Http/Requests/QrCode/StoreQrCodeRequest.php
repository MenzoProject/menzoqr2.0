<?php

declare(strict_types=1);

namespace App\Http\Requests\QrCode;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

final class StoreQrCodeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            "type" => ["required", Rule::in(["takeaway", "table"])],
            "table_number" => ["required_if:type,table", "nullable", "string", "max:50"],
        ];
    }
}
