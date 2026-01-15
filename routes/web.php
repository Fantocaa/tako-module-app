<?php

use App\Http\Controllers\AuditLogController;
use App\Http\Controllers\BackupController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified', 'menu.permission'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    Route::resource('transactions', TransactionController::class);
    Route::resource('roles', RoleController::class);
    Route::resource('permissions', PermissionController::class);
    Route::resource('users', UserController::class);
    Route::put('/users/{user}/reset-password', [UserController::class, 'resetPassword'])->name('users.reset-password');
    Route::resource('menus', MenuController::class)->except(['create', 'edit']);
    Route::post('menus/reorder', [MenuController::class, 'reorder'])->name('menus.reorder');
    Route::get('/audit-logs', [AuditLogController::class, 'index'])->name('audit-logs.index');
    Route::get('/backup', [BackupController::class, 'index'])->name('backup.index');
    Route::post('/backup/run', [BackupController::class, 'run'])->name('backup.run');
    Route::get('/backup/download/{file}', [BackupController::class, 'download'])->name('backup.download');
    Route::delete('/backup/delete/{file}', [BackupController::class, 'delete'])->name('backup.delete');

    // LMS Routes
    Route::get('/courses', function () {
        return Inertia::render('courses/index');
    })->name('courses.index');

    Route::get('/courses/{slug}', function ($slug) {
        return Inertia::render('courses/[slug]');
    })->name('courses.show');

    Route::get('/courses/{slug}/lessons/{id}', function ($slug, $id) {
        return Inertia::render('courses/[slug]/lessons/[id]');
    })->name('lessons.show');
});

require __DIR__ . '/settings.php';
