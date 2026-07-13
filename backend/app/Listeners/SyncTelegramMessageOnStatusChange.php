<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Events\OrderStatusChanged;
use App\Services\Notification\Channels\TelegramChannel;
use App\Services\Telegram\OrderKeyboardBuilder;
use App\Services\Telegram\TelegramService;
use Illuminate\Contracts\Queue\ShouldQueue;

/**
 * Keeps the original Telegram notification message in sync with the order's
 * current status, whatever triggered the change — the owner's dashboard or
 * an inline button in the chat itself. This is what makes the bot feel like
 * a real-time extension of the order board rather than a one-shot alert.
 */
final class SyncTelegramMessageOnStatusChange implements ShouldQueue
{
    public function __construct(
        private readonly TelegramService $telegramService,
        private readonly TelegramChannel $telegramChannel,
        private readonly OrderKeyboardBuilder $keyboardBuilder,
    ) {
    }

    public function handle(OrderStatusChanged $event): void
    {
        $order = $event->order;
        $account = $order->cafe->telegramAccount;

        if ($account === null || ! $account->isConnected() || $order->telegram_message_id === null) {
            return;
        }

        $order->loadMissing(["items.dish", "items.variant", "items.addons.addon", "table", "cafe"]);

        $this->telegramService->editMessageText(
            chatId: $account->chat_id,
            messageId: $order->telegram_message_id,
            text: $this->telegramChannel->buildMessageText($order),
            inlineKeyboard: $this->keyboardBuilder->build($order),
        );
    }
}
