<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class OwnerSeeder extends Seeder
{
    /**
     * Provision the first Owner account, but only on a genuinely empty
     * install (no users at all) and only if credentials were supplied via
     * config/owner.php (OWNER_EMAIL / OWNER_PASSWORD in .env). Never
     * overwrites or duplicates an existing account.
     */
    public function run(): void
    {
        if (User::query()->exists()) {
            return;
        }

        $email = config("owner.email");
        $password = config("owner.password");

        if (blank($email) || blank($password)) {
            $this->command?->warn(
                "Skipped Owner seeding: set OWNER_EMAIL and OWNER_PASSWORD in .env to create the first Owner account."
            );

            return;
        }

        User::query()->create([
            "name" => config("owner.name", "Owner"),
            "email" => $email,
            "phone" => config("owner.phone"),
            "password" => Hash::make($password),
            "is_active" => true,
            "email_verified_at" => now(),
        ]);

        $this->command?->info("Owner account created ({$email}).");
    }
}
