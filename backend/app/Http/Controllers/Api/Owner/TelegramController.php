<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Owner;

use App\Enums\TelegramConnectionStatus;
use App\Http\Controllers\Controller;
use App\Models\Cafe;
use App\Models\TelegramAccount;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;

final class TelegramController extends Controller
{
    public function show(Cafe $cafe): JsonResponse
    {
        $this->authorize("view", $cafe);

        $account = $cafe->telegramAccount;

        return response()->json([
            "status" => $account?->status->value ?? "not_connected",
            "connected_at" => $account?->connected_at?->toIso8601String(),
            "link_token" => $account && $account->status === TelegramConnectionStatus::Pending
                ? $account->link_token
                : null,
        ]);
    }

    public function connect(Cafe $cafe): JsonResponse
    {
        $this->authorize("update", $cafe);

        $existing = $cafe->telegramAccount;

        // Calling "connect" again while already connected must not silently
        // wipe a working integration — the owner has to disconnect first.
        if ($existing !== null && $existing->status === TelegramConnectionStatus::Connected) {
            return response()->json([
                "message" => "Telegram уже подключен. Сначала отключите текущую интеграцию.",
            ], 409);
        }

        $account = TelegramAccount::query()->updateOrCreate(
            ["cafe_id" => $cafe->id],
            [
                "link_token" => Str::random(32),
                "status" => TelegramConnectionStatus::Pending,
                "chat_id" => null,
                "connected_at" => null,
            ]
        );

        return response()->json([
            "link_token" => $account->link_token,
            "bot_deeplink_instructions" => "Отправьте боту MENZO команду /start {$account->link_token}, чтобы привязать чат для уведомлений о заказах.",
        ]);
    }

    public function disconnect(Cafe $cafe): JsonResponse
    {
        $this->authorize("update", $cafe);

        $cafe->telegramAccount()->update([
            "status" => TelegramConnectionStatus::Disconnected,
            "chat_id" => null,
            "connected_at" => null,
        ]);

        return response()->json(["message" => "Telegram отключен."]);
    }
}
