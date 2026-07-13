<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Models\QrCode as QrCodeModel;
use App\Services\QrCode\QrCodeService;
use Illuminate\Http\RedirectResponse;

final class QrRedirectController extends Controller
{
    public function __construct(
        private readonly QrCodeService $qrCodeService,
    ) {
    }

    /**
     * The URL embedded inside every generated QR image. Scanning it:
     *   1. Looks up the qr_codes row by its opaque `code` (UUID).
     *   2. Increments scans_count (previously dead code — nothing called it).
     *   3. 302-redirects the guest's browser to the actual public menu on
     *      the Next.js frontend (config('frontend.url') + /menu/{slug}).
     */
    public function redirect(string $code): RedirectResponse
    {
        $qrCode = QrCodeModel::query()
            ->where("code", $code)
            ->with(["cafe", "table"])
            ->firstOrFail();

        $qrCode->incrementScans();

        return redirect()->away($this->qrCodeService->targetUrl($qrCode));
    }
}
