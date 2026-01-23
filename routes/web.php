<?php

use App\Http\Controllers\AuditLogController;
use App\Http\Controllers\BackupController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\LessonController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\PositionController;
use App\Http\Controllers\PsychotestController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\TagController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    // return Inertia::render('welcome', [
    //     'canRegister' => Features::enabled(Features::registration()),
    // ]);
    return redirect()->route('login');
})->name('home');

Route::middleware(['auth', 'verified', 'menu.permission'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    
    // Redirect authenticated users to courses by default
    Route::redirect('/', '/courses');
    
    Route::resource('transactions', TransactionController::class);
    Route::resource('roles', RoleController::class);
    Route::resource('positions', PositionController::class);
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
    Route::resource('tags', TagController::class);

    // LMS Routes
    Route::get('/lms', [CourseController::class, 'indexCrud'])->name('lms.index');
    Route::post('/courses/{course}/lessons/reorder', [LessonController::class, 'reorder'])->name('courses.lessons.reorder');
    Route::resource('courses', CourseController::class);
    Route::resource('courses.lessons', LessonController::class);

    // Psychotest Admin/Testing Routes
    Route::get('/psychotest-admin', [PsychotestController::class, 'index'])->name('psychotest.index');
    Route::post('/psychotest-admin', [PsychotestController::class, 'store'])->name('psychotest.store');
});

// Applicant Psychotest Routes (Public)
Route::get('/p/{uuid}', [PsychotestController::class, 'testPage'])->name('psychotest.take-test');
Route::post('/p/{uuid}/submit', [PsychotestController::class, 'submit'])->name('psychotest.submit');
Route::get('/p/error', [PsychotestController::class, 'error'])->name('psychotest.error');

// LMS Routes - accessible to all authenticated users
// Route::middleware(['auth', 'verified'])->group(function () {
//     Route::get('/courses', [CourseController::class, 'index'])->name('courses.index');
//     Route::get('/courses/{course}', [CourseController::class, 'show'])->name('courses.show');
//     Route::get('/courses/{course}/lessons/{lesson}', [LessonController::class, 'show'])->name('courses.lessons.show');
// });

// // LMS Admin Routes - requires menu permission
// Route::middleware(['auth', 'verified', 'menu.permission'])->group(function () {
//     Route::get('/courses-index', [CourseController::class, 'indexCrud'])->name('courses.index.crud');
//     Route::post('/courses/{course}/lessons/reorder', [LessonController::class, 'reorder'])->name('courses.lessons.reorder');
//     Route::resource('courses', CourseController::class);
//     Route::resource('courses.lessons', LessonController::class)->except(['show']);
// });

require __DIR__ . '/settings.php';
