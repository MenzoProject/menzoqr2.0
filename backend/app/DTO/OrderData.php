<?php

declare(strict_types=1);

namespace App\DTO;

use App\Enums\OrderType;
use App\Enums\PaymentMethod;

final readonly class OrderData
{
    /**
     * @param array<int, OrderItemData> $items
     */
    public function __construct(
        public int $cafeId,
        public OrderType $type,
        public string $customerName,
        public array $items,
        public ?string $customerPhone = null,
        public ?int $tableId = null,
        public ?string $comment = null,
        public PaymentMethod $paymentMethod = PaymentMethod::Cash,
    ) {
    }

    public static function fromArray(array $data): self
    {
        return new self(
            cafeId: (int) $data["cafe_id"],
            type: OrderType::from($data["type"]),
            customerName: (string) $data["customer_name"],
            items: array_map(
                static fn (array $item): OrderItemData => OrderItemData::fromArray($item),
                $data["items"]
            ),
            customerPhone: $data["customer_phone"] ?? null,
            tableId: isset($data["table_id"]) ? (int) $data["table_id"] : null,
            comment: $data["comment"] ?? null,
            paymentMethod: isset($data["payment_method"])
                ? PaymentMethod::from($data["payment_method"])
                : PaymentMethod::Cash,
        );
    }
}
