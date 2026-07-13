<?php

declare(strict_types=1);

namespace App\Policies;

use App\Enums\UserRole;
use App\Models\Cafe;
use App\Models\User;

final class CafePolicy
{
    public function view(User $user, Cafe $cafe): bool
    {
        return $this->hasAccess($user, $cafe);
    }

    public function update(User $user, Cafe $cafe): bool
    {
        return $cafe->owner_id === $user->id;
    }

    public function delete(User $user, Cafe $cafe): bool
    {
        return $cafe->owner_id === $user->id;
    }

    /**
     * Menu, categories, and QR codes are managed by the owner or a manager —
     * matching the role model already enforced by DishPolicy::update(). This
     * keeps cafe-level settings ("update") stricter than day-to-day menu work.
     */
    public function manageMenu(User $user, Cafe $cafe): bool
    {
        if ($cafe->owner_id === $user->id) {
            return true;
        }

        $role = $user->roleForCafe($cafe);

        return $role !== null && $role->name === UserRole::Manager->value;
    }

    public function manageStaff(User $user, Cafe $cafe): bool
    {
        return $cafe->owner_id === $user->id;
    }

    private function hasAccess(User $user, Cafe $cafe): bool
    {
        if ($cafe->owner_id === $user->id) {
            return true;
        }

        return $cafe->staff()->where("users.id", $user->id)->exists();
    }
}
