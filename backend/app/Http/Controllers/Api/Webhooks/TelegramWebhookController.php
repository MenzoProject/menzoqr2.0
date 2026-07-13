<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Webhooks;

use App\Enums\OrderStatus;
use App\Enums\TelegramConnectionStatus;
use App\DTO\TelegramMessageData;
use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\TelegramAccount;
use App\Services\Order\OrderStatusService;
use App\Services\Telegram\TelegramService;
use DomainException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

final class TelegramWebhookController extends Controller
{
    public function __construct(
        private readonly TelegramService $telegramService,
        private readonly OrderStatusService $orderStatusService,
    ) {
    }

    public function handle(Request $request): JsonResponse
    {
        if (! $this->hasValidSecret($request)) {
            abort(403, "Invalid webhook secret.");
        }

        $payload = $request->all();

        if (isset($payload["message"])) {
            $this->handleMessage($payload["message"]);
        } elseif (isset($payload["callback_query"])) {
            $this->handleCallbackQuery($payload["callback_query"]);
        }

        // Telegram only cares about a 200 response; the body is ignored.
        return response()->json(["ok" => true]);
    }

    private function hasValidSecret(Request $request): bool
    {
        $expected = config("services.telegram.webhook_secret");

        if (blank($expected)) {
            // No secret configured — accept the request but log so it can be fixed.
            Log::warning("TELEGRAM_WEBHOOK_SECRET is not set; webhook requests are not verified.");

            return true;
        }

        return hash_equals($expected, (string) $request->header("X-Telegram-Bot-Api-Secret-Token"));
    }

    /**
     * @param array<string, mixed> $message
     */
    private function handleMessage(array $message): void
    {
        $text = trim((string) ($message["text"] ?? ""));
        $chatId = (string) ($message["chat"]["id"] ?? "");

        if ($chatId === "" || ! str_starts_with($text, "/start")) {
            return;
        }

        $token = trim(substr($text, strlen("/start")));

        if ($token === "") {
            $this->telegramService->sendMessage(new TelegramMessageData(
                chatId: $chatId,
                text: "Чтобы привязать кафе, откройте раздел «Telegram» в панели MENZO QR и отправьте боту команду, которую там увидите.",
            ));

            return;
        }

        $account = TelegramAccount::query()
            ->where("link_token", $token)
            ->where("status", TelegramConnectionStatus::Pending)
            ->first();

        if ($account === null) {
            $this->telegramService->sendMessage(new TelegramMessageData(
                chatId: $chatId,
                text: "Код недействителен или уже использован. Получите новый код в панели MENZO QR.",
            ));

            return;
        }

        $account->update([
            "chat_id" => $chatId,
            "status" => TelegramConnectionStatus::Connected,
            "connected_at" => now(),
        ]);

        $cafeName = $account->cafe->name;

        $this->telegramService->sendMessage(new TelegramMessageData(
            chatId: $chatId,
            text: "✅ Готово! Кафе «{$cafeName}» подключено. Новые заказы будут приходить сюда с кнопками управления статусом.",
        ));
    }

    /**
     * @param array<string, mixed> $callbackQuery
     */
    private function handleCallbackQuery(array $callbackQuery): void
    {
        $callbackId = (string) ($callbackQuery["id"] ?? "");
        $data = (string) ($callbackQuery["data"] ?? "");
        $chatId = (string) ($callbackQuery["message"]["chat"]["id"] ?? "");

        [$prefix, $orderId, $statusValue] = array_pad(explode(":", $data, 3), 3, null);

        if ($prefix !== "order" || $orderId === null || $statusValue === null) {
            return;
        }

        $order = Order::query()->with(["cafe.telegramAccount"])->find((int) $orderId);
        $newStatus = OrderStatus::tryFrom($statusValue);

        if ($order === null || $newStatus === null) {
            $this->telegramService->answerCallbackQuery($callbackId, "Заказ не найден.");

            return;
        }

        $account = $order->cafe->telegramAccount;

        // A chat can only act on orders belonging to the cafe it is linked to —
        // this is the only authorization check available for a bot callback,
        // and it is sufficient since chat_id linkage is itself access-controlled.
        if ($account === null || $account->chat_id !== $chatId) {
            $this->telegramService->answerCallbackQuery($callbackId, "Нет доступа к этому заказу.");

            return;
        }

        try {
            $this->orderStatusService->transitionTo($order, $newStatus);
            $this->telegramService->answerCallbackQuery($callbackId, "Статус обновлен: {$newStatus->label()}");
        } catch (DomainException $exception) {
            $this->telegramService->answerCallbackQuery($callbackId, "Недопустимый переход статуса.");
        }
    }
}
