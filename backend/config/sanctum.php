<?php

use Laravel\Sanctum\Sanctum;

return [

    /*
    |--------------------------------------------------------------------------
    | Stateful Domains
    |--------------------------------------------------------------------------
    |
    | Not used by this API: the frontend authenticates with bearer tokens
    | (Authorization header) via `auth:sanctum` on stateless API routes, not
    | Sanctum's cookie-based SPA mode. Left here for completeness in case a
    | first-party web client is added later.
    |
    */

    'stateful' => explode(',', (string) env(
        'SANCTUM_STATEFUL_DOMAINS',
        'localhost,localhost:3000,127.0.0.1,127.0.0.1:8000,::1'
    )),

    'guard' => ['web'],

    /*
    |--------------------------------------------------------------------------
    | Expiration Minutes
    |--------------------------------------------------------------------------
    |
    | Personal access tokens never expire by default (null). Set a value here
    | (in minutes) if you want issued tokens to expire automatically.
    |
    */

    'expiration' => env('SANCTUM_TOKEN_EXPIRATION') ? (int) env('SANCTUM_TOKEN_EXPIRATION') : null,

    'token_prefix' => env('SANCTUM_TOKEN_PREFIX', ''),

    /*
    |--------------------------------------------------------------------------
    | Sanctum Middleware
    |--------------------------------------------------------------------------
    */

    'middleware' => [
        'authenticate_session' => Laravel\Sanctum\Http\Middleware\AuthenticateSession::class,
        'encrypt_cookies' => Illuminate\Cookie\Middleware\EncryptCookies::class,
        'validate_csrf_token' => Illuminate\Foundation\Http\Middleware\ValidateCsrfToken::class,
    ],

];
