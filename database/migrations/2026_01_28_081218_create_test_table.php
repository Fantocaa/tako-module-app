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
        Schema::create('test', function (Blueprint $table) {
            $table->id();
             $table->foreignId('section_id')->constrained()->cascadeOnDelete();
            $table->foreignId('subtest_id')->nullable()->constrained('test_subtests')->nullOnDelete();

            $table->text('question_text');

            $table->enum('type', [
                'forced',          // PAPI
                'standard',        // CFIT 1,3,4
                'multiple_select', // CFIT 2
                'comparison',      // CFIT 5
                'disc'             // DISC
            ]);

            $table->integer('order')->default(1);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('test');
    }
};
