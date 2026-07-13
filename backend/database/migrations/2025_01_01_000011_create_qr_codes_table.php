<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create("qr_codes", function (Blueprint $table) {
            $table->id();
            $table->foreignId("cafe_id")->constrained()->cascadeOnDelete();
            $table->foreignId("table_id")->nullable()->constrained("tables")->nullOnDelete();
            $table->string("type", 20);
            $table->uuid("code")->unique();
            $table->string("image_path")->nullable();
            $table->unsignedInteger("scans_count")->default(0);
            $table->timestamps();

            $table->index(["cafe_id", "type"]);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists("qr_codes");
    }
};
