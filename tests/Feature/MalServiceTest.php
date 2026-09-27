<?php

use App\Services\MalService;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

it('returns no anime data when the Jikan connection fails', function () {
    $malId = 60636;
    $endpoint = "https://api.jikan.moe/v4/anime/{$malId}";

    Cache::forget("mal_anime_{$malId}");
    Http::preventStrayRequests();
    Http::fake([
        $endpoint => Http::failedConnection(),
        "https://myanimelist.net/anime/{$malId}" => Http::response([], 404),
    ]);

    $result = app(MalService::class)->anime($malId);

    expect($result)->toBeNull();
});

it('returns no anime data when Jikan is unavailable', function () {
    $malId = 61967;
    $endpoint = "https://api.jikan.moe/v4/anime/{$malId}";

    Cache::forget("mal_anime_{$malId}");
    Http::preventStrayRequests();
    Http::fake([
        $endpoint => Http::response([
            'status' => 504,
            'type' => 'BadResponseException',
        ], 504),
        "https://myanimelist.net/anime/{$malId}" => Http::response([], 404),
    ]);

    $result = app(MalService::class)->anime($malId);

    expect($result)->toBeNull();
});

it('falls back to the MyAnimeList page when Jikan is unavailable', function () {
    $malId = 61967;
    $jikanEndpoint = "https://api.jikan.moe/v4/anime/{$malId}";
    $malEndpoint = "https://myanimelist.net/anime/{$malId}";

    Cache::forget("mal_anime_{$malId}");
    Http::preventStrayRequests();
    Http::fake([
        $jikanEndpoint => Http::response(['status' => 504], 504),
        $malEndpoint => Http::response(<<<'HTML'
            <meta property="og:title" content="Black Clover 2nd Season">
            <meta property="og:image" content="https://cdn.myanimelist.net/images/anime/1857/160133.jpg">
            <meta property="og:description" content="Second season of Black Clover.">
            HTML),
    ]);

    $result = app(MalService::class)->anime($malId);

    expect($result)
        ->toMatchArray([
            'mal_id' => $malId,
            'title' => 'Black Clover 2nd Season',
            'poster_path' => 'https://cdn.myanimelist.net/images/anime/1857/160133.jpg',
            'overview' => 'Second season of Black Clover.',
        ]);
});
