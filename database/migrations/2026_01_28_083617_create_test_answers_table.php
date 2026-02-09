<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('test_answers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('psychotest_link_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('test_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('test_option_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->enum('disc_choice_type', ['most', 'least'])
                ->nullable(); // hanya untuk DISC

            $table->timestamps();
        });
    }
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('test_answers');
    }
};
