<?php

declare(strict_types=1);

return [
    /*
    |--------------------------------------------------------------------------
    | Initial Owner Account
    |--------------------------------------------------------------------------
    |
    | Credentials for the Owner account that OwnerSeeder creates the first
    | time the app is installed (when the users table is empty). Set these
    | in .env before running `php artisan migrate --seed` / `db:seed`.
    |
    | If OWNER_EMAIL or OWNER_PASSWORD are left unset, the seeder skips
    | account creation rather than falling back to a hardcoded default.
    |
    */
    "name" => env("OWNER_NAME", "Owner"),
    "email" => env("OWNER_EMAIL"),
    "phone" => env("OWNER_PHONE"),
    "password" => env("OWNER_PASSWORD"),
];

