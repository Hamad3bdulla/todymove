<?php

use App\Models\Anime;

test('anime vote averages retain two decimal places', function () {
    $anime = Anime::create([
        'title' => 'Score precision test',
        'vote_average' => 9.03,
    ]);

    expect($anime->fresh()->vote_average)->toBe('9.03');
});
