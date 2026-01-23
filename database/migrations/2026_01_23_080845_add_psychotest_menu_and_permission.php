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
        // 1. Create permission
        $permission = \Spatie\Permission\Models\Permission::firstOrCreate(
            ['name' => 'psychotest-view', 'guard_name' => 'web'],
            ['group' => 'Utilities']
        );

        // 2. Assign to admin role
        $admin = \Spatie\Permission\Models\Role::where('name', 'admin')->first();
        if ($admin && !$admin->hasPermissionTo($permission)) {
            $admin->givePermissionTo($permission);
        }

        // 3. Create Menu
        \App\Models\Menu::firstOrCreate(
            ['route' => '/psychotest-admin'],
            [
                'title' => 'Psychotest Links',
                'icon' => 'Link',
                'order' => 10,
                'permission_name' => 'psychotest-view',
            ]
        );
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        \App\Models\Menu::where('route', '/psychotest-admin')->delete();
        \Spatie\Permission\Models\Permission::where('name', 'psychotest-view')->delete();
    }
};
