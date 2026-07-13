<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Owner;

use App\Http\Controllers\Controller;
use App\Http\Requests\QrCode\StoreQrCodeRequest;
use App\Http\Resources\QrCodeResource;
use App\Models\Cafe;
use App\Models\QrCode;
use App\Models\Table;
use App\Services\QrCode\QrCodeService;
use Illuminate\Http\JsonResponse;

final class QrCodeController extends Controller
{
    public function __construct(
        private readonly QrCodeService $qrCodeService,
    ) {
    }

    public function index(Cafe $cafe): JsonResponse
    {
        $this->authorize("view", $cafe);

        // Eager-load "cafe" too: QrCodeResource::targetUrl() reads $qrCode->cafe
        // to build public_url — without this it would lazy-load the cafe once
        // per row (N+1) since $cafe here is the route-bound model, not
        // something the resource has access to.
        $qrCodes = $cafe->qrCodes()->with(["table", "cafe"])->latest()->get();

        return response()->json(QrCodeResource::collection($qrCodes));
    }

    public function store(StoreQrCodeRequest $request, Cafe $cafe): JsonResponse
    {
        $this->authorize("manageMenu", $cafe);

        if ($request->validated("type") === "table") {
            $table = Table::query()->firstOrCreate([
                "cafe_id" => $cafe->id,
                "number" => $request->validated("table_number"),
            ]);

            $qrCode = $this->qrCodeService->createForTable($cafe, $table);
        } else {
            $qrCode = $this->qrCodeService->createForTakeaway($cafe);
        }

        return response()->json(new QrCodeResource($qrCode->load(["table", "cafe"])), 201);
    }

    public function destroy(Cafe $cafe, QrCode $qrCode): JsonResponse
    {
        $this->authorize("manageMenu", $cafe);

        $this->qrCodeService->delete($qrCode);

        return response()->json(["message" => "QR-код удален."]);
    }
}
