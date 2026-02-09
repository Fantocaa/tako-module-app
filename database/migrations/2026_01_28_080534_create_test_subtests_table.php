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
        Schema::create('test_subtests', function (Blueprint $table) {
            $table->id();
             $table->foreignId('section_id')->constrained()->cascadeOnDelete();
            $table->string('name'); // Series, Classification, dll
            $table->integer('duration_seconds');
            $table->integer('order')->default(1);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('test_subtests');
    }
};
