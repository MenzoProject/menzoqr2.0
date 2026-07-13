<?php

declare(strict_types=1);

namespace App\Providers;

use App\Services\Notification\Channels\TelegramChannel;
use App\Services\Notification\NotificationDispatcher;
use App\Services\Telegram\TelegramService;
use Illuminate\Support\ServiceProvider;

final class NotificationServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(TelegramService::class, function () {
            return new TelegramService(config("services.telegram.bot_token"));
        });

        $this->app->singleton(NotificationDispatcher::class, function ($app) {
            // Additional channels (WhatsApp, Push, Email, SMS) can be appended here
            // without touching business logic in OrderService or OrderStatusService.
            return new NotificationDispatcher([
                $app->make(TelegramChannel::class),
            ]);
        });
    }
}
