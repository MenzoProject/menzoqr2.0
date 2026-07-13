<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

final class AuthController extends Controller
{
    public function register(RegisterRequest $request): JsonResponse
    {
        $user = User::query()->create([
            "name" => $request->validated("name"),
            "email" => $request->validated("email"),
            "phone" => $request->validated("phone"),
            "password" => Hash::make($request->validated("password")),
        ]);

        $token = $user->createToken("menzo-qr")->plainTextToken;

        return response()->json([
            "user" => new UserResource($user),
            "token" => $token,
        ], 201);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $user = User::query()->where("email", $request->validated("email"))->first();

        if ($user === null || ! Hash::check($request->validated("password"), $user->password)) {
            throw new AuthenticationException("Неверный email или пароль.");
        }

        if (! $user->is_active) {
            abort(403, "Учетная запись отключена.");
        }

        $token = $user->createToken("menzo-qr")->plainTextToken;

        return response()->json([
            "user" => new UserResource($user),
            "token" => $token,
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(["message" => "Вы вышли из системы."]);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json(new UserResource($request->user()));
    }
}
