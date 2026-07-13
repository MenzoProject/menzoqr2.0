<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Services\Telegram\TelegramService;
use Illuminate\Console\Command;

final class TelegramWebhookCommand extends Command
{
    protected $signature = "telegram:webhook {action : set|delete} {--url= : Public HTTPS URL for the set action, e.g. https://api.example.com/api/webhooks/telegram}";

    protected $description = "Register or remove the Telegram webhook for the MENZO bot";

    public function handle(TelegramService $telegramService): int
    {
        if (! $telegramService->isConfigured()) {
            $this->error("TELEGRAM_BOT_TOKEN is not set in .env.");

            return self::FAILURE;
        }

        $action = $this->argument("action");

        if ($action === "delete") {
            $telegramService->deleteWebhook();
            $this->info("Telegram webhook removed.");

            return self::SUCCESS;
        }

        if ($action !== "set") {
            $this->error("Unknown action. Use 'set' or 'delete'.");

            return self::FAILURE;
        }

        $url = $this->option("url");

        if (! $url) {
            $this->error("Pass the public HTTPS URL with --url=, e.g. --url=https://api.example.com/api/webhooks/telegram");

            return self::FAILURE;
        }

        $secret = config("services.telegram.webhook_secret");

        if (blank($secret)) {
            $this->error("Set TELEGRAM_WEBHOOK_SECRET in .env before registering the webhook (any random string works).");

            return self::FAILURE;
        }

        $success = $telegramService->setWebhook($url, $secret);

        if ($success) {
            $this->info("Telegram webhook set to: {$url}");

            return self::SUCCESS;
        }

        $this->error("Failed to set webhook. Check the URL and bot token.");

        return self::FAILURE;
    }
}
