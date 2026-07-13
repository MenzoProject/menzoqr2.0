<?php

use App\Http\Controllers\Api\Public\QrRedirectController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| MENZO QR is an API-only backend consumed by the Next.js frontend — there
| are no server-rendered pages. This route only exists so visiting the
| bare domain returns something meaningful instead of a 404, and so the
| standard Laravel "web" route file (required by bootstrap/app.php) exists.
|
*/

Route::get('/', function () {
    return response()->json([
        'name' => config('app.name'),
        'status' => 'ok',
    ]);
});

// This is the URL physically encoded inside every generated QR image (see
// QrCodeService::buildScanUrl()). It lives outside routes/api.php on purpose:
// it's opened directly by a phone camera/browser, not called by the SPA, so
// it doesn't need the "api/v1" JSON prefix, Sanctum, or CORS headers — just
// a plain server-side redirect. Throttled generously to absorb double-scans.
Route::get('/qr/{code}', [QrRedirectController::class, 'redirect'])
    ->middleware('throttle:120,1')
    ->name('qr.redirect');
