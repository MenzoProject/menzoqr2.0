<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create("notification_logs", function (Blueprint $table) {
            $table->id();
            $table->foreignId("order_id")->constrained()->cascadeOnDelete();
            $table->string("channel", 30);
            $table->string("status", 20);
            $table->json("payload")->nullable();
            $table->text("error_message")->nullable();
            $table->timestamp("sent_at")->nullable();
            $table->timestamps();

            $table->index(["order_id", "channel"]);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists("notification_logs");
    }
};
