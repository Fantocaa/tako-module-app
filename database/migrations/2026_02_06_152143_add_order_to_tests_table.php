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
        // Tabel kamu namanya "test" bukan "tests"
        if (Schema::hasTable('test') && !Schema::hasColumn('test', 'order')) {
            Schema::table('test', function (Blueprint $table) {
                $table->integer('order')->default(1)->after('type');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('test') && Schema::hasColumn('test', 'order')) {
            Schema::table('test', function (Blueprint $table) {
                $table->dropColumn('order');
            });
        }
    }
};
