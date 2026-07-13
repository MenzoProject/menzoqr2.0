<?php

declare(strict_types=1);

return [
    /*
    |--------------------------------------------------------------------------
    | Frontend URL
    |--------------------------------------------------------------------------
    |
    | The public Next.js app's base URL. Used to build the destination link
    | embedded in generated QR codes (QrCodeService). Kept in its own config
    | file rather than config/app.php so this package never overwrites keys
    | you may already have there.
    |
    */
    "url" => env("APP_FRONTEND_URL", "http://localhost:3000"),
];
