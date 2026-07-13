<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Guests ordering at the table do not need to provide a phone number —
     * staff already know which table to serve. Phone stays required for
     * takeaway orders at the application-validation level (StorePublicOrderRequest).
     */
    public function up(): void
    {
        DB::statement("ALTER TABLE orders ALTER COLUMN customer_phone DROP NOT NULL");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE orders ALTER COLUMN customer_phone SET NOT NULL");
    }
};
