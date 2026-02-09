<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('test_options', function (Blueprint $table) {
            $table->id();
            $table->foreignId('test_id')->constrained()->cascadeOnDelete();

            $table->text('content');

            $table->string('dimension_code')->nullable(); 
            // DISC: D/I/S/C
            // PAPI: dimension
            // CFIT: null

            $table->boolean('is_correct')->default(false); 
            // hanya untuk CFIT

            $table->integer('score')->nullable(); 
            // optional future scoring flexibility

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('test_options');
    }
};
