<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create("order_items", function (Blueprint $table) {
            $table->id();
            $table->foreignId("order_id")->constrained()->cascadeOnDelete();
            $table->foreignId("dish_id")->constrained()->restrictOnDelete();
            $table->foreignId("dish_variant_id")->nullable()->constrained("dish_variants")->nullOnDelete();
            $table->unsignedInteger("quantity");
            $table->decimal("unit_price", 10, 2);
            $table->text("comment")->nullable();
            $table->timestamps();

            $table->index("order_id");
        });
    }

    public function down(): void
    {
        Schema::dropIfExists("order_items");
    }
};
