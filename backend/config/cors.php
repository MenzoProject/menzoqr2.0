<?php

declare(strict_types=1);

return [
    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | The frontend (Next.js) is served from a different origin than this API
    | in both development (different port) and production (different domain),
    | so CORS must be configured explicitly — without this file, browsers
    | block every request from the frontend with no CORS error surfaced
    | until you actually deploy to separate domains.
    |
    */

    "paths" => ["api/*"],

    "allowed_methods" => ["*"],

    // Set FRONTEND_URL in .env to your deployed frontend origin(s), comma
    // separated. Never use "*" here together with credentials.
    "allowed_origins" => array_filter(array_map(
        "trim",
        explode(",", env("FRONTEND_URL", "http://localhost:3000"))
    )),

    "allowed_origins_patterns" => [],

    "allowed_headers" => ["*"],

    "exposed_headers" => [],

    "max_age" => 0,

    // We use Sanctum's bearer-token API mode (not cookie-based SPA auth), so
    // credentials/cookies are not required cross-origin.
    "supports_credentials" => false,
];
