<?php

declare(strict_types=1);

namespace App\Services\QrCode;

use App\Enums\OrderType;
use App\Models\Cafe;
use App\Models\QrCode as QrCodeModel;
use App\Models\Table;
use BaconQrCode\Renderer\Image\SvgImageBackEnd;
use BaconQrCode\Renderer\ImageRenderer;
use BaconQrCode\Renderer\RendererStyle\RendererStyle;
use BaconQrCode\Writer;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Str;
use RuntimeException;

/**
 * Generates and stores QR code images for a cafe's tables / takeaway flow.
 *
 * The QR image never encodes the frontend URL directly. Instead it encodes a
 * short-lived backend "scan" redirect (see QrRedirectController) so that:
 *   1. `scans_count` on the qr_codes table is actually incremented (it used
 *      to be dead code — nothing ever called incrementScans()).
 *   2. The destination (frontend URL) can be changed later — e.g. if the
 *      frontend domain changes — without reprinting already-distributed
 *      physical QR codes, since the backend resolves the redirect at scan
 *      time from `config('frontend.url')`.
 */
final class QrCodeService
{
    public function createForTakeaway(Cafe $cafe): QrCodeModel
    {
        return $this->generate($cafe, OrderType::Takeaway, null);
    }

    public function createForTable(Cafe $cafe, Table $table): QrCodeModel
    {
        return $this->generate($cafe, OrderType::Table, $table);
    }

    private function generate(Cafe $cafe, OrderType $type, ?Table $table): QrCodeModel
    {
        $code = Str::uuid()->toString();

        $qrCode = QrCodeModel::query()->create([
            "cafe_id" => $cafe->id,
            "table_id" => $table?->id,
            "type" => $type,
            "code" => $code,
        ]);

        $imagePath = "qr-codes/{$code}.svg";

        try {
            $svg = $this->renderSvg($this->buildScanUrl($code));

            $written = Storage::disk("public")->put($imagePath, $svg);

            if ($written === false) {
                throw new RuntimeException("Storage::put() returned false for [{$imagePath}].");
            }
        } catch (\Throwable $e) {
            // Don't leave an orphaned qr_codes row with a dangling
            // image_path that points at a file which was never written —
            // that is exactly the "QR card exists but no image appears" bug.
            $qrCode->delete();

            Log::error("Failed to generate QR code image", [
                "cafe_id" => $cafe->id,
                "table_id" => $table?->id,
                "error" => $e->getMessage(),
            ]);

            throw new RuntimeException(
                "Не удалось сгенерировать изображение QR-кода. Проверьте настройки хранилища (FILESYSTEM_DISK, storage:link).",
                previous: $e
            );
        }

        $qrCode->update(["image_path" => $imagePath]);

        return $qrCode->refresh();
    }

    private function renderSvg(string $data): string
    {
        $renderer = new ImageRenderer(
            new RendererStyle(512, margin: 1),
            new SvgImageBackEnd()
        );

        return (new Writer($renderer))->writeString($data);
    }

    /**
     * The URL embedded in the QR image itself: a backend redirect that
     * increments scans_count and then forwards the guest to the public menu.
     */
    private function buildScanUrl(string $code): string
    {
        return URL::to("/qr/{$code}");
    }

    /**
     * The final destination a scan resolves to (used by QrRedirectController
     * and exposed to the owner dashboard so it can be copied/shared without
     * printing a new QR code).
     */
    public function targetUrl(QrCodeModel $qrCode): string
    {
        $cafe = $qrCode->cafe ?? Cafe::query()->findOrFail($qrCode->cafe_id);
        $table = $qrCode->table_id ? ($qrCode->table ?? Table::query()->find($qrCode->table_id)) : null;

        return $this->buildPublicUrl($cafe->slug, $table);
    }

    private function buildPublicUrl(string $cafeSlug, ?Table $table): string
    {
        $baseUrl = rtrim(config("frontend.url"), "/")."/menu/{$cafeSlug}";

        if ($table !== null) {
            return "{$baseUrl}?table_id={$table->id}&table_number=".rawurlencode($table->number);
        }

        return $baseUrl;
    }

    public function delete(QrCodeModel $qrCode): void
    {
        if ($qrCode->image_path !== null) {
            Storage::disk("public")->delete($qrCode->image_path);
        }

        $qrCode->delete();
    }
}
