<?php

declare(strict_types=1);

namespace App\DTO;

final readonly class TelegramMessageData
{
    public function __construct(
        public string $chatId,
        public string $text,
        public array $inlineKeyboard = [],
    ) {
    }
}
