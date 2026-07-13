<?php

declare(strict_types=1);

namespace App\Services\Telegram;

use App\DTO\TelegramMessageData;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use RuntimeException;

final class TelegramService
{
    private const API_BASE_URL = "https://api.telegram.org/bot";

    public function __construct(
        private readonly ?string $botToken = null,
    ) {
    }

    public function isConfigured(): bool
    {
        return filled($this->botToken);
    }

    /**
     * Sends a message and returns its Telegram message_id on success, or null on failure.
     */
    public function sendMessage(TelegramMessageData $message): ?int
    {
        if (! $this->isConfigured()) {
            Log::warning("Telegram bot token is not configured. Message was not sent.");

            return null;
        }

        $payload = [
            "chat_id" => $message->chatId,
            "text" => $message->text,
            "parse_mode" => "HTML",
        ];

        if ($message->inlineKeyboard !== []) {
            $payload["reply_markup"] = [
                "inline_keyboard" => $message->inlineKeyboard,
            ];
        }

        $response = Http::asJson()->post($this->endpoint("sendMessage"), $payload);

        if ($response->failed()) {
            Log::error("Telegram sendMessage failed: {$response->body()}");

            return null;
        }

        return $response->json("result.message_id");
    }

    /**
     * Edits the text and inline keyboard of a previously sent message, keeping
     * the Telegram notification in sync with the order's current status
     * regardless of whether the status was changed from the chat or the dashboard.
     */
    public function editMessageText(string $chatId, int $messageId, string $text, array $inlineKeyboard = []): bool
    {
        if (! $this->isConfigured()) {
            return false;
        }

        $payload = [
            "chat_id" => $chatId,
            "message_id" => $messageId,
            "text" => $text,
            "parse_mode" => "HTML",
            "reply_markup" => ["inline_keyboard" => $inlineKeyboard],
        ];

        $response = Http::asJson()->post($this->endpoint("editMessageText"), $payload);

        if ($response->failed()) {
            Log::warning("Telegram editMessageText failed: {$response->body()}");
        }

        return $response->successful();
    }

    public function answerCallbackQuery(string $callbackQueryId, string $text): bool
    {
        if (! $this->isConfigured()) {
            return false;
        }

        $response = Http::asJson()->post($this->endpoint("answerCallbackQuery"), [
            "callback_query_id" => $callbackQueryId,
            "text" => $text,
        ]);

        return $response->successful();
    }

    public function setWebhook(string $url, string $secretToken): bool
    {
        if (! $this->isConfigured()) {
            throw new RuntimeException("Telegram bot token is not configured.");
        }

        $response = Http::asJson()->post($this->endpoint("setWebhook"), [
            "url" => $url,
            "secret_token" => $secretToken,
            "allowed_updates" => ["message", "callback_query"],
        ]);

        return $response->successful() && $response->json("ok") === true;
    }

    public function deleteWebhook(): bool
    {
        if (! $this->isConfigured()) {
            throw new RuntimeException("Telegram bot token is not configured.");
        }

        $response = Http::asJson()->post($this->endpoint("deleteWebhook"));

        return $response->successful();
    }

    private function endpoint(string $method): string
    {
        if (! $this->isConfigured()) {
            throw new RuntimeException("Telegram bot token is not configured.");
        }

        return self::API_BASE_URL.$this->botToken."/".$method;
    }
}
