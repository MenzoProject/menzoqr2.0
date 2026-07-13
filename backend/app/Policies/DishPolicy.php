<?php

declare(strict_types=1);

namespace App\Policies;

use App\Enums\UserRole;
use App\Models\Dish;
use App\Models\User;

final class DishPolicy
{
    public function update(User $user, Dish $dish): bool
    {
        $cafe = $dish->category->cafe;

        if ($cafe->owner_id === $user->id) {
            return true;
        }

        $role = $user->roleForCafe($cafe);

        return $role !== null && in_array($role->name, [UserRole::Manager->value], true);
    }

    public function delete(User $user, Dish $dish): bool
    {
        return $this->update($user, $dish);
    }
}
