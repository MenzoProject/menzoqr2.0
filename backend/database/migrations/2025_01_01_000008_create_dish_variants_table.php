<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create("dish_variants", function (Blueprint $table) {
            $table->id();
            $table->foreignId("dish_id")->constrained()->cascadeOnDelete();
            $table->string("name");
            $table->decimal("price_modifier", 10, 2)->default(0);
            $table->unsignedInteger("sort_order")->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists("dish_variants");
    }
};
