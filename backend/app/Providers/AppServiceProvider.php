<?php

declare(strict_types=1);

namespace App\Providers;

use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->ensureStorageSymlinkExists();
        $this->forceHttpsUrlsInProduction();
    }

    /**
     * `php artisan storage:link` creates public/storage -> storage/app/public
     * so uploaded dish photos and generated QR images are actually reachable
     * over HTTP. Railway's PHP builder (Railpack) runs this automatically,
     * but if this app is ever deployed a different way (plain Docker image,
     * a different PaaS, `git push heroku`, ...) and that step is skipped,
     * every image URL 404s despite the database/file both being correct.
     * This is a cheap, idempotent safety net: if the symlink is missing at
     * boot, create it instead of leaving a silent 404 machine in production.
     */
    private function ensureStorageSymlinkExists(): void
    {
        $link = public_path("storage");
        $target = storage_path("app/public");

        if (File::exists($link)) {
            return;
        }

        if (! File::exists($target)) {
            File::makeDirectory($target, 0755, true);
        }

        try {
            File::link($target, $link);
        } catch (\Throwable) {
            // Best-effort: some read-only/containerized filesystems don't
            // allow symlink creation at runtime. In that case the proper
            // fix is running `storage:link` at build/deploy time (which
            // Railpack already does) or switching FILESYSTEM_DISK to s3.
        }
    }

    /**
     * Both Railway and Vercel always serve over HTTPS in production. Forcing
     * the scheme here is a second line of defense on top of trustProxies()
     * in bootstrap/app.php, so generated asset/QR URLs are never http://
     * (and therefore never blocked as mixed content by the https frontend)
     * even if the proxy headers aren't forwarded exactly as expected.
     */
    private function forceHttpsUrlsInProduction(): void
    {
        if ($this->app->environment("production")) {
            URL::forceScheme("https");
        }
    }
}
