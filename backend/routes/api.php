<?php

declare(strict_types=1);

use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\Owner\BannerController;
use App\Http\Controllers\Api\Owner\CafeController;
use App\Http\Controllers\Api\Owner\CategoryController;
use App\Http\Controllers\Api\Owner\ComboOfferController;
use App\Http\Controllers\Api\Owner\DishController;
use App\Http\Controllers\Api\Owner\OrderController;
use App\Http\Controllers\Api\Owner\QrCodeController;
use App\Http\Controllers\Api\Owner\SettingsController;
use App\Http\Controllers\Api\Owner\StaffController;
use App\Http\Controllers\Api\Owner\TelegramController;
use App\Http\Controllers\Api\Public\PublicMenuController;
use App\Http\Controllers\Api\Public\PublicOrderController;
use App\Http\Controllers\Api\Webhooks\TelegramWebhookController;
use Illuminate\Support\Facades\Route;

Route::prefix("v1")->group(function () {
    // Auth — throttled to slow down credential stuffing / brute force attempts.
    Route::middleware("throttle:10,1")->group(function () {
        Route::post("auth/register", [AuthController::class, "register"]);
        Route::post("auth/login", [AuthController::class, "login"]);
    });

    Route::middleware("auth:sanctum")->group(function () {
        Route::post("auth/logout", [AuthController::class, "logout"]);
        Route::get("auth/me", [AuthController::class, "me"]);

        // Owner
        Route::prefix("owner")->group(function () {
            Route::apiResource("cafes", CafeController::class);

            Route::middleware("cafe.ownership")->prefix("cafes/{cafe}")->group(function () {
                Route::get("categories", [CategoryController::class, "index"]);
                Route::post("categories", [CategoryController::class, "store"]);
                Route::patch("categories/{category}", [CategoryController::class, "update"]);
                Route::delete("categories/{category}", [CategoryController::class, "destroy"]);

                Route::get("categories/{category}/dishes", [DishController::class, "index"]);
                Route::post("categories/{category}/dishes", [DishController::class, "store"]);
                Route::patch("categories/{category}/dishes/{dish}", [DishController::class, "update"]);
                Route::delete("categories/{category}/dishes/{dish}", [DishController::class, "destroy"]);

                Route::get("qr-codes", [QrCodeController::class, "index"]);
                Route::post("qr-codes", [QrCodeController::class, "store"]);
                Route::delete("qr-codes/{qrCode}", [QrCodeController::class, "destroy"]);

                Route::get("banners", [BannerController::class, "index"]);
                Route::post("banners", [BannerController::class, "store"]);
                Route::patch("banners/{banner}", [BannerController::class, "update"]);
                Route::delete("banners/{banner}", [BannerController::class, "destroy"]);

                Route::get("combo-offers", [ComboOfferController::class, "index"]);
                Route::post("combo-offers", [ComboOfferController::class, "store"]);
                Route::patch("combo-offers/{comboOffer}", [ComboOfferController::class, "update"]);
                Route::delete("combo-offers/{comboOffer}", [ComboOfferController::class, "destroy"]);

                Route::get("orders", [OrderController::class, "index"]);
                Route::get("orders/{order}", [OrderController::class, "show"]);
                Route::patch("orders/{order}/status", [OrderController::class, "updateStatus"]);

                Route::get("staff", [StaffController::class, "index"]);
                Route::post("staff", [StaffController::class, "store"]);
                Route::patch("staff/{user}", [StaffController::class, "update"]);
                Route::delete("staff/{user}", [StaffController::class, "destroy"]);

                Route::get("telegram", [TelegramController::class, "show"]);
                Route::post("telegram/connect", [TelegramController::class, "connect"]);
                Route::post("telegram/disconnect", [TelegramController::class, "disconnect"]);

                Route::get("settings", [SettingsController::class, "show"]);
                Route::patch("settings", [SettingsController::class, "update"]);
            });
        });
    });

    // Public — throttled per IP to prevent menu-scraping and fake-order spam.
    Route::prefix("public")->middleware("throttle:60,1")->group(function () {
        Route::get("menu/{cafeSlug}", [PublicMenuController::class, "show"]);
        Route::post("menu/{cafeSlug}/orders", [PublicOrderController::class, "store"])
            ->middleware("throttle:20,1");
        Route::get("orders/{orderNumber}/status", [PublicOrderController::class, "status"]);
    });
});

// Telegram webhook — intentionally outside the "v1" prefix and Sanctum
// middleware: Telegram calls this directly and authenticates via the
// X-Telegram-Bot-Api-Secret-Token header instead (see TelegramWebhookController).
// Throttled generously since Telegram itself may retry bursts of updates.
Route::post("webhooks/telegram", [TelegramWebhookController::class, "handle"])
    ->middleware("throttle:120,1");
