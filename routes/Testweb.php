<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Admin\PapiController;

Route::middleware(['web', 'auth', 'verified', 'menu.permission'])->group(function () {

        Route::get('dashboard', function () {
            return Inertia::render('dashboard');
        })->name('admin.dashboard');

        Route::resource('psychotest/papi',PapiController::class)
            ->names('papi');
    });