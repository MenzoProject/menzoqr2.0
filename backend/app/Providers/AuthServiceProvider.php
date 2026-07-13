<?php

declare(strict_types=1);

namespace App\Providers;

use App\Models\Cafe;
use App\Models\Dish;
use App\Models\Order;
use App\Policies\CafePolicy;
use App\Policies\DishPolicy;
use App\Policies\OrderPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

final class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [
        Cafe::class => CafePolicy::class,
        Dish::class => DishPolicy::class,
        Order::class => OrderPolicy::class,
    ];

    public function boot(): void
    {
        $this->registerPolicies();
    }
}
