<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use App\Models\Cafe;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

final class EnsureCafeOwnership
{
    public function handle(Request $request, Closure $next): Response
    {
        $cafe = $request->route("cafe");

        if (! $cafe instanceof Cafe) {
            abort(404);
        }

        $user = $request->user();

        $hasAccess = $cafe->owner_id === $user->id
            || $cafe->staff()->where("users.id", $user->id)->exists();

        if (! $hasAccess) {
            abort(403, "У вас нет доступа к этому кафе.");
        }

        return $next($request);
    }
}
