<?php

declare(strict_types=1);

namespace App\Http\Requests\Telegram;

use Illuminate\Foundation\Http\FormRequest;

final class LinkTelegramRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [];
    }
}
