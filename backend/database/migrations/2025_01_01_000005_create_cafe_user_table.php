<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create("cafe_user", function (Blueprint $table) {
            $table->id();
            $table->foreignId("cafe_id")->constrained()->cascadeOnDelete();
            $table->foreignId("user_id")->constrained()->cascadeOnDelete();
            $table->foreignId("role_id")->constrained()->cascadeOnDelete();
            $table->timestamps();

            $table->unique(["cafe_id", "user_id"]);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists("cafe_user");
    }
};
