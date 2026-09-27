<?php

use App\Http\Controllers\AnimeOfWeekController;
use App\Http\Controllers\AnimeWatchController;
use App\Http\Controllers\ArchiveController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\StoreAnimeCommentController;
use App\Http\Controllers\StoreAnimeRatingController;
use App\Http\Controllers\StoreMovieCommentController;
use App\Http\Controllers\StoreMovieRatingController;
use App\Http\Controllers\WatchController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', HomeController::class)->name('home');

Route::get('/sw.js', function () {
    $path = public_path('build/sw.js');

    abort_unless(file_exists($path), 404);

    return response()->file($path, [
        'Content-Type' => 'application/javascript; charset=utf-8',
        'Cache-Control' => 'no-cache, no-store, must-revalidate',
        'Service-Worker-Allowed' => '/',
    ]);
})->name('sw');

Route::get('/watch/{movie}', WatchController::class)->name('watch')->where('movie', '[0-9]+');
Route::post('/watch/{movie}/comments', StoreMovieCommentController::class)->middleware('throttle:comments')->name('watch.comments.store')->where('movie', '[0-9]+');
Route::post('/watch/{movie}/ratings', StoreMovieRatingController::class)->middleware('throttle:ratings')->name('watch.ratings.store')->where('movie', '[0-9]+');

Route::get('/archive', ArchiveController::class)->name('archive');

Route::get('/anime', AnimeOfWeekController::class)->name('anime');
Route::get('/anime/{anime}', AnimeWatchController::class)->name('anime.watch')->where('anime', '[0-9]+');
Route::post('/anime/{anime}/comments', StoreAnimeCommentController::class)->middleware('throttle:comments')->name('anime.comments.store')->where('anime', '[0-9]+');
Route::post('/anime/{anime}/ratings', StoreAnimeRatingController::class)->middleware('throttle:ratings')->name('anime.ratings.store')->where('anime', '[0-9]+');

Route::get('dashboard', function () {
    return Inertia::render('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

require __DIR__.'/settings.php';
