<?php

namespace App\Services;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * Fetch anime data from MyAnimeList via Jikan API v4 (https://jikan.moe/).
 * No API key required. Rate limit: 3 requests/second.
 */
class MalService
{
    private const BASE_URL = 'https://api.jikan.moe/v4';

    private const CACHE_TTL_SECONDS = 86400; // 24 hours

    /**
     * Get anime details by MAL id.
     *
     * @return array<string, mixed>|null Mapped for Anime model: title, poster_path (full URL), overview, release_date, episodes_count, genres, vote_average, vote_count, trailer_youtube_key
     */
    public function anime(int $malId): ?array
    {
        $cacheKey = "mal_anime_{$malId}";

        return Cache::remember($cacheKey, self::CACHE_TTL_SECONDS, function () use ($malId) {
            try {
                $response = Http::connectTimeout(5)
                    ->timeout(15)
                    ->retry(2, 250)
                    ->get(self::BASE_URL."/anime/{$malId}");
            } catch (ConnectionException|RequestException $exception) {
                Log::warning('Unable to fetch anime data from Jikan.', [
                    'mal_id' => $malId,
                    'error' => $exception->getMessage(),
                ]);

                return $this->fetchFromMyAnimeListPage($malId);
            }

            if (! $response->successful()) {
                return $this->fetchFromMyAnimeListPage($malId);
            }

            $data = $response->json('data');
            if (! $data) {
                return null;
            }

            return $this->mapAnimeResponse($data);
        });
    }

    /**
     * Use the public MyAnimeList page when Jikan cannot reach the record.
     *
     * @return array<string, mixed>|null
     */
    protected function fetchFromMyAnimeListPage(int $malId): ?array
    {
        try {
            $response = Http::withHeaders([
                'User-Agent' => 'Todymove/1.0',
            ])
                ->connectTimeout(5)
                ->timeout(15)
                ->get("https://myanimelist.net/anime/{$malId}");
        } catch (ConnectionException|RequestException $exception) {
            Log::warning('Unable to fetch anime data from MyAnimeList.', [
                'mal_id' => $malId,
                'error' => $exception->getMessage(),
            ]);

            return null;
        }

        if (! $response->successful()) {
            return null;
        }

        $document = new \DOMDocument;
        $previousErrorState = libxml_use_internal_errors(true);
        $loaded = $document->loadHTML($response->body());
        libxml_clear_errors();
        libxml_use_internal_errors($previousErrorState);

        if (! $loaded) {
            return null;
        }

        $xpath = new \DOMXPath($document);
        $title = $this->extractMetaContent($xpath, 'property', 'og:title');
        if (blank($title)) {
            return null;
        }

        return [
            'mal_id' => $malId,
            'title' => $title,
            'poster_path' => $this->extractMetaContent($xpath, 'property', 'og:image'),
            'backdrop_path' => null,
            'overview' => $this->extractMetaContent($xpath, 'property', 'og:description'),
            'release_date' => null,
            'episodes_count' => null,
            'genres' => [],
            'vote_average' => null,
            'vote_count' => null,
            'trailer_youtube_key' => null,
            'fetched_at' => now()->toDateTimeString(),
        ];
    }

    protected function extractMetaContent(\DOMXPath $xpath, string $attribute, string $value): ?string
    {
        $nodes = $xpath->query(sprintf('//meta[@%s="%s"]/@content', $attribute, $value));
        $content = $nodes?->item(0)?->nodeValue;

        return filled($content) ? html_entity_decode(trim($content), ENT_QUOTES | ENT_HTML5) : null;
    }

    /**
     * Map Jikan anime response to our Anime model fields.
     *
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    protected function mapAnimeResponse(array $data): array
    {
        $airedFrom = $data['aired']['from'] ?? null;
        $releaseDate = null;
        if ($airedFrom) {
            try {
                $releaseDate = substr($airedFrom, 0, 10);
            } catch (\Throwable) {
                // ignore
            }
        }

        $genres = array_map(
            fn ($g) => $g['name'] ?? '',
            $data['genres'] ?? []
        );
        $themes = array_map(
            fn ($t) => $t['name'] ?? '',
            $data['themes'] ?? []
        );
        $demographics = array_map(
            fn ($d) => $d['name'] ?? '',
            $data['demographics'] ?? []
        );
        $allGenres = array_values(array_unique(array_merge($genres, $themes, $demographics)));

        $trailerYoutubeKey = $data['trailer']['youtube_id'] ?? null;
        if (! $trailerYoutubeKey && ! empty($data['trailer']['embed_url'])) {
            $embedUrl = $data['trailer']['embed_url'];
            if (preg_match('#(?:youtube\.com/embed/|youtu\.be/)([a-zA-Z0-9_-]+)#', $embedUrl, $m)) {
                $trailerYoutubeKey = $m[1];
            }
        }

        $posterUrl = $data['images']['jpg']['large_image_url'] ?? $data['images']['jpg']['image_url'] ?? null;

        return [
            'mal_id' => $data['mal_id'] ?? null,
            'title' => $data['title'] ?? $data['title_english'] ?? '',
            'poster_path' => $posterUrl,
            'backdrop_path' => null,
            'overview' => $data['synopsis'] ?? null,
            'release_date' => $releaseDate,
            'episodes_count' => isset($data['episodes']) && $data['episodes'] > 0 ? (int) $data['episodes'] : null,
            'genres' => $allGenres,
            'vote_average' => isset($data['score']) && $data['score'] > 0 ? (float) $data['score'] : null,
            'vote_count' => isset($data['scored_by']) ? (int) $data['scored_by'] : null,
            'trailer_youtube_key' => $trailerYoutubeKey,
            'fetched_at' => now()->toDateTimeString(),
        ];
    }
}
