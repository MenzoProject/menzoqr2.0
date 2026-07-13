<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create("cafes", function (Blueprint $table) {
            $table->id();
            $table->foreignId("owner_id")->constrained("users")->cascadeOnDelete();
            $table->string("name");
            $table->string("slug")->unique();
            $table->string("logo_path")->nullable();
            $table->string("address")->nullable();
            $table->string("phone")->nullable();
            $table->string("currency", 3)->default("RUB");
            $table->boolean("is_active")->default(true);
            $table->timestamps();

            $table->index(["owner_id", "is_active"]);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists("cafes");
    }
};
