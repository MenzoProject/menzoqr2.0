<?php

declare(strict_types=1);

namespace App\Http\Requests\Order;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

final class StorePublicOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            "type" => ["required", Rule::in(["takeaway", "table"])],
            "table_id" => ["required_if:type,table", "nullable", "integer", "exists:tables,id"],
            "customer_name" => ["required", "string", "max:255"],
            "customer_phone" => ["required_if:type,takeaway", "nullable", "string", "max:30"],
            "comment" => ["nullable", "string", "max:1000"],
            "payment_method" => ["nullable", Rule::in(["cash", "online"])],
            "items" => ["required", "array", "min:1"],
            "items.*.dish_id" => ["required", "integer", "exists:dishes,id"],
            "items.*.dish_variant_id" => ["nullable", "integer", "exists:dish_variants,id"],
            "items.*.quantity" => ["required", "integer", "min:1", "max:50"],
            "items.*.comment" => ["nullable", "string", "max:500"],
            "items.*.addons" => ["nullable", "array"],
            "items.*.addons.*.dish_addon_id" => ["required", "integer", "exists:dish_addons,id"],
        ];
    }
}
