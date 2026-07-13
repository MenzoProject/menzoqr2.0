<?php

use Illuminate\Support\Facades\Storage;

return [

    /*
    |--------------------------------------------------------------------------
    | Default Filesystem Disk
    |--------------------------------------------------------------------------
    */

    'default' => env('FILESYSTEM_DISK', 'local'),

    /*
    |--------------------------------------------------------------------------
    | Filesystem Disks
    |--------------------------------------------------------------------------
    |
    | The "public" disk is used throughout the app (dish photos, cafe logos,
    | generated QR code images — see storage()->disk("public") calls in
    | DishController, SettingsController, QrCodeService).
    |
    | ⚠️ PRODUCTION ON RAILWAY: Railway's filesystem is EPHEMERAL for regular
    | web services — anything written to storage/app/public disappears on
    | every redeploy/restart unless you either:
    |   (a) attach a Railway Volume mounted at the app's storage/app/public
    |       directory (Settings → Volumes → mount path e.g. /app/storage/app/public), or
    |   (b) set FILESYSTEM_DISK=s3 and fill in the AWS_*/S3-compatible env
    |       vars below (Cloudflare R2, Backblaze B2, etc. all work, since
    |       they speak the S3 API) — the 's3' disk is already wired up.
    | Without one of these, dish/QR images will appear to work right after
    | upload and then vanish the next time the backend redeploys.
    |
    */

    'disks' => [

        'local' => [
            'driver' => 'local',
            'root' => storage_path('app/private'),
            'serve' => true,
            'throw' => false,
            'report' => false,
        ],

        'public' => [
            'driver' => 'local',
            'root' => storage_path('app/public'),
            'url' => env('APP_URL').'/storage',
            'visibility' => 'public',
            // IMPORTANT: this used to be false/false, which meant a failed
            // write (bad permissions, missing directory, full disk, ...)
            // returned `false` silently instead of throwing. Combined with
            // callers that didn't check the return value, that's exactly
            // how a qr_codes/dishes row could end up with an `image_path`
            // pointing at a file that was never actually written. Both
            // QrCodeService and DishController now check return values AND
            // this disk throws, so failures are visible in logs instead of
            // silently producing a broken image.
            'throw' => true,
            'report' => true,
        ],

        's3' => [
            'driver' => 's3',
            'key' => env('AWS_ACCESS_KEY_ID'),
            'secret' => env('AWS_SECRET_ACCESS_KEY'),
            'region' => env('AWS_DEFAULT_REGION'),
            'bucket' => env('AWS_BUCKET'),
            'url' => env('AWS_URL'),
            'endpoint' => env('AWS_ENDPOINT'),
            'use_path_style_endpoint' => env('AWS_USE_PATH_STYLE_ENDPOINT', false),
            'throw' => false,
            'report' => false,
        ],

    ],

    /*
    |--------------------------------------------------------------------------
    | Symbolic Links
    |--------------------------------------------------------------------------
    |
    | Created by the `php artisan storage:link` command (already documented
    | as a required setup step in backend/README.md).
    |
    */

    'links' => [
        public_path('storage') => storage_path('app/public'),
    ],

];
