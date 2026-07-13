<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create("telegram_accounts", function (Blueprint $table) {
            $table->id();
            $table->foreignId("cafe_id")->constrained()->cascadeOnDelete();
            $table->string("chat_id")->nullable();
            $table->string("link_token", 64)->unique();
            $table->string("status", 20)->default("pending");
            $table->timestamp("connected_at")->nullable();
            $table->timestamps();

            $table->unique("cafe_id");
        });
    }

    public function down(): void
    {
        Schema::dropIfExists("telegram_accounts");
    }
};
