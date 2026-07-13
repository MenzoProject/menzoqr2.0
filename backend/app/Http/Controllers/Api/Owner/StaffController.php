<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Owner;

use App\Http\Controllers\Controller;
use App\Http\Requests\Staff\StoreStaffRequest;
use App\Http\Requests\Staff\UpdateStaffRequest;
use App\Http\Resources\UserResource;
use App\Models\Cafe;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;

final class StaffController extends Controller
{
    public function index(Cafe $cafe): JsonResponse
    {
        $this->authorize("view", $cafe);

        $staff = $cafe->staff()->get();

        return response()->json(UserResource::collection($staff));
    }

    public function store(StoreStaffRequest $request, Cafe $cafe): JsonResponse
    {
        $this->authorize("manageStaff", $cafe);

        $role = Role::query()->where("name", $request->validated("role"))->firstOrFail();

        $user = User::query()->create([
            "name" => $request->validated("name"),
            "email" => $request->validated("email"),
            "phone" => $request->validated("phone"),
            "password" => Hash::make($request->validated("password")),
        ]);

        $cafe->staff()->attach($user->id, ["role_id" => $role->id]);

        return response()->json(new UserResource($user), 201);
    }

    public function update(UpdateStaffRequest $request, Cafe $cafe, User $user): JsonResponse
    {
        $this->authorize("manageStaff", $cafe);

        $user->update($request->safe()->only(["name", "phone", "is_active"]));

        if ($request->filled("role")) {
            $role = Role::query()->where("name", $request->validated("role"))->firstOrFail();
            $cafe->staff()->updateExistingPivot($user->id, ["role_id" => $role->id]);
        }

        return response()->json(new UserResource($user->refresh()));
    }

    public function destroy(Cafe $cafe, User $user): JsonResponse
    {
        $this->authorize("manageStaff", $cafe);

        $cafe->staff()->detach($user->id);

        return response()->json(["message" => "Сотрудник удален из кафе."]);
    }
}
