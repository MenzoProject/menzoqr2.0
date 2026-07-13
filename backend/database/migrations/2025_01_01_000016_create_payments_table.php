<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create("payments", function (Blueprint $table) {
            $table->id();
            $table->foreignId("order_id")->constrained()->cascadeOnDelete();
            $table->string("provider", 30)->nullable();
            $table->string("status", 20)->default("pending");
            $table->decimal("amount", 10, 2);
            $table->string("transaction_id")->nullable();
            $table->timestamp("paid_at")->nullable();
            $table->timestamps();

            $table->index("order_id");
        });
    }

    public function down(): void
    {
        Schema::dropIfExists("payments");
    }
};
