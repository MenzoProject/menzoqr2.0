<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create("tables", function (Blueprint $table) {
            $table->id();
            $table->foreignId("cafe_id")->constrained()->cascadeOnDelete();
            $table->string("number");
            $table->boolean("is_active")->default(true);
            $table->timestamps();

            $table->unique(["cafe_id", "number"]);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists("tables");
    }
};
