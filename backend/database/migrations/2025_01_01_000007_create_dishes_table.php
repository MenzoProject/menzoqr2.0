<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create("dishes", function (Blueprint $table) {
            $table->id();
            $table->foreignId("category_id")->constrained()->cascadeOnDelete();
            $table->string("name");
            $table->text("description")->nullable();
            $table->decimal("price", 10, 2);
            $table->string("image_path")->nullable();
            $table->unsignedInteger("sort_order")->default(0);
            $table->boolean("is_active")->default(true);
            $table->timestamps();

            $table->index(["category_id", "is_active", "sort_order"]);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists("dishes");
    }
};
