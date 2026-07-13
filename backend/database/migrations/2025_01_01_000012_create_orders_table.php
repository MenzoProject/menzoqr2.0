<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create("orders", function (Blueprint $table) {
            $table->id();
            $table->foreignId("cafe_id")->constrained()->cascadeOnDelete();
            $table->foreignId("table_id")->nullable()->constrained("tables")->nullOnDelete();
            $table->string("order_number")->unique();
            $table->string("type", 20);
            $table->string("status", 20)->default("new");
            $table->string("customer_name");
            $table->string("customer_phone");
            $table->text("comment")->nullable();
            $table->decimal("total_amount", 10, 2);
            $table->string("payment_method", 20)->default("cash");
            $table->timestamps();

            $table->index(["cafe_id", "status"]);
            $table->index(["cafe_id", "created_at"]);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists("orders");
    }
};
