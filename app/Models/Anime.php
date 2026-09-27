<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Anime extends Model
{
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'mal_id',
        'tmdb_id',
        'title',
        'poster_path',
        'backdrop_path',
        'overview',
        'release_date',
        'episodes_count',
        'genres',
        'vote_average',
        'vote_count',
        'trailer_youtube_key',
        'fetched_at',
        'is_anime_of_week',
        'anime_of_week_order',
    ];

    /**
     * @var list<string>
     */
    protected $appends = [
        'poster_url',
        'trailer_url',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'genres' => 'array',
            'release_date' => 'date',
            'vote_average' => 'decimal:2',
            'fetched_at' => 'datetime',
            'is_anime_of_week' => 'boolean',
        ];
    }

    public function scopeAnimeOfWeek(Builder $query): Builder
    {
        return $query->where('is_anime_of_week', true)->orderBy('anime_of_week_order');
    }

    public function videoSources(): HasMany
    {
        return $this->hasMany(AnimeVideoSource::class)->orderBy('priority');
    }

    public function comments(): HasMany
    {
        return $this->hasMany(AnimeComment::class)->latest();
    }

    public function ratings(): HasMany
    {
        return $this->hasMany(AnimeRating::class);
    }

    public function getVisitorRatingAverageAttribute(): ?float
    {
        $avg = $this->ratings()->avg('rating');

        return $avg !== null ? (float) round($avg, 1) : null;
    }

    public function getVisitorRatingCountAttribute(): int
    {
        return $this->ratings()->count();
    }

    public function getPosterUrlAttribute(): ?string
    {
        if (! $this->poster_path) {
            return null;
        }

        if (str_starts_with($this->poster_path, 'http://') || str_starts_with($this->poster_path, 'https://')) {
            return $this->poster_path;
        }

        return 'https://image.tmdb.org/t/p/w500'.$this->poster_path;
    }

    public function getTrailerUrlAttribute(): ?string
    {
        if (! $this->trailer_youtube_key) {
            return null;
        }

        return 'https://www.youtube.com/watch?v='.$this->trailer_youtube_key;
    }
}
