<?php

declare(strict_types=1);

use App\Http\Middleware\EnsureCafeOwnership;
use DomainException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use InvalidArgumentException;
use Symfony\Component\HttpFoundation\Request as SymfonyRequest;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__."/../routes/web.php",
        api: __DIR__."/../routes/api.php",
        commands: __DIR__."/../routes/console.php",
        health: "/up",
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->alias([
            "cafe.ownership" => EnsureCafeOwnership::class,
        ]);

        // Railway (and most PaaS providers) terminates TLS at an edge proxy
        // and forwards plain HTTP internally with X-Forwarded-* headers.
        // Without trusting that proxy, Laravel thinks every request is
        // insecure HTTP, and url()/asset() (used for dish photos, cafe
        // logos, and QR code images) generate http:// links. A https://
        // frontend then refuses to load them as mixed content — a second,
        // independent way the "broken image" bug shows up even after
        // APP_URL is set correctly.
        $middleware->trustProxies(
            at: "*",
            headers: SymfonyRequest::HEADER_X_FORWARDED_FOR
                | SymfonyRequest::HEADER_X_FORWARDED_HOST
                | SymfonyRequest::HEADER_X_FORWARDED_PORT
                | SymfonyRequest::HEADER_X_FORWARDED_PROTO
                | SymfonyRequest::HEADER_X_FORWARDED_AWS_ELB,
        );
    })
    ->withExceptions(function (Exceptions $exceptions) {
        // Business-rule violations (invalid order status transition, dish not
        // available/not part of this cafe, etc.) are client errors, not server
        // errors — render them as 422 instead of leaking a 500.
        $exceptions->render(function (InvalidArgumentException $e, Request $request) {
            if ($request->is("api/*")) {
                return response()->json(["message" => $e->getMessage()], 422);
            }
        });

        $exceptions->render(function (DomainException $e, Request $request) {
            if ($request->is("api/*")) {
                return response()->json(["message" => $e->getMessage()], 422);
            }
        });

        // The API never serves HTML error pages to the SPA/mobile client —
        // every unhandled exception on an api/* route still comes back as JSON.
        $exceptions->shouldRenderJsonWhen(fn (Request $request) => $request->is("api/*"));
    })
    ->withProviders([
        App\Providers\RepositoryServiceProvider::class,
        App\Providers\NotificationServiceProvider::class,
        App\Providers\AuthServiceProvider::class,
        App\Providers\EventServiceProvider::class,
    ])
    ->create();
