<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('test_subtest_sessions', function (Blueprint $table) {
            $table->id();

            $table->foreignId('psychotest_link_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('subtest_id')
                ->constrained('test_subtests')
                ->cascadeOnDelete();

            $table->timestamp('started_at')->nullable();
            $table->timestamp('finished_at')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('test_subtest_sessions');
    }
};