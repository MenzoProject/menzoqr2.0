<?php

declare(strict_types=1);

namespace App\Providers;

use App\Events\OrderStatusChanged;
use App\Listeners\SyncTelegramMessageOnStatusChange;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

final class EventServiceProvider extends ServiceProvider
{
    /**
     * @var array<class-string, array<int, class-string>>
     */
    protected $listen = [
        OrderStatusChanged::class => [
            SyncTelegramMessageOnStatusChange::class,
        ],
    ];
}
