<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('test_results', function (Blueprint $table) {
            $table->id();

            $table->foreignId('psychotest_link_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->json('score_data'); 
            // contoh:
            // DISC: {D:12, I:8, S:6, C:9}
            // PAPI: {...}
            // CFIT: {total: 24}

            $table->text('interpretation')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('test_results');
    }
};