<?php

declare(strict_types=1);

namespace App\Providers;

use App\Repositories\Contracts\CafeRepositoryInterface;
use App\Repositories\Contracts\DishRepositoryInterface;
use App\Repositories\Contracts\OrderRepositoryInterface;
use App\Repositories\Eloquent\CafeRepository;
use App\Repositories\Eloquent\DishRepository;
use App\Repositories\Eloquent\OrderRepository;
use Illuminate\Support\ServiceProvider;

final class RepositoryServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(CafeRepositoryInterface::class, CafeRepository::class);
        $this->app->bind(DishRepositoryInterface::class, DishRepository::class);
        $this->app->bind(OrderRepositoryInterface::class, OrderRepository::class);
    }
}
