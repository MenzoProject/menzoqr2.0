<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\Cafe;
use App\Models\User;

final class UserPolicy
{
    public function manage(User $authUser, User $targetUser, Cafe $cafe): bool
    {
        return $cafe->owner_id === $authUser->id && $targetUser->id !== $authUser->id;
    }
}
