#!/bin/bash
set -e

# This is Railpack's default Laravel start-container.sh
# (https://github.com/railwayapp/railpack/blob/main/core/providers/php/start-container.sh),
# copied here so we can insert one extra, defensive line: `package:discover`.
#
# Why: the build step runs `composer install --no-scripts`, which SKIPS
# composer's post-autoload-dump hook — the hook that normally runs
# `php artisan package:discover` and registers every framework/package
# service provider (View, Session, Sanctum, Horizon, ...). Laravel is
# usually able to rebuild that provider manifest lazily on first boot, but
# if that lazy rebuild ever fails silently (e.g. a transient bootstrap/cache
# write issue, a stale cached manifest surviving a Docker layer, ...), the
# result is exactly "Target class [view] does not exist" — the app boots
# and serves most routes fine, then one request hits a code path needing a
# provider that was never actually registered. Running `package:discover`
# explicitly, every start, costs a fraction of a second and removes this
# entire class of failure.

echo "[start-container] script started, IS_LARAVEL=${IS_LARAVEL:-<unset>}"

# Run unconditionally (not just inside the IS_LARAVEL check below): if the
# artisan binary exists, this is safe, fast, and removes any dependency on
# Railpack's Laravel detection/env var being set the way we expect.
if [ -f "artisan" ]; then
  echo "[start-container] running package:discover ..."
  php artisan package:discover --ansi
  echo "[start-container] package:discover done"
fi

if [ "$IS_LARAVEL" = "true" ]; then
  if [ "$RAILPACK_SKIP_MIGRATIONS" != "true" ]; then
    echo "Running migrations and seeding database ..."
    php artisan migrate --force
  fi

  php artisan storage:link
  php artisan optimize:clear
  php artisan optimize
  echo "Starting Laravel server ..."
fi

echo "[start-container] handing off to FrankenPHP"

# Start the FrankenPHP server
docker-php-entrypoint --config /Caddyfile --adapter caddyfile 2>&1
