<?php

namespace App\Filament\Admin\Resources\Animes\Pages;

use App\Filament\Admin\Resources\Animes\AnimeResource;
use App\Models\Anime;
use App\Models\AnimeVideoSource;
use App\Services\MalService;
use Filament\Actions\Action;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\CreateRecord;
use Illuminate\Validation\ValidationException;

class CreateAnime extends CreateRecord
{
    protected static string $resource = AnimeResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Action::make('fetchFromMal')
                ->label('Fetch from MyAnimeList')
                ->icon('heroicon-o-cloud-arrow-down')
                ->action(function (): void {
                    $this->runFetchFromMal();
                }),
        ];
    }

    protected function runFetchFromMal(): void
    {
        $input = trim((string) ($this->form->getState()['title'] ?? ''));
        if (blank($input)) {
            Notification::make()
                ->danger()
                ->title('Paste a MyAnimeList anime URL or enter ID')
                ->send();

            return;
        }

        $malId = $this->extractMalIdFromInput($input);
        if ($malId === null) {
            Notification::make()
                ->danger()
                ->title('Invalid URL. Use a link like: myanimelist.net/anime/51818/...')
                ->send();

            return;
        }

        $data = app(MalService::class)->anime($malId);
        if (! $data) {
            Notification::make()
                ->danger()
                ->title('Anime not found for this link or ID')
                ->send();

            return;
        }

        $this->form->fill(array_merge($this->form->getState(), $data));
        Notification::make()
            ->success()
            ->title('Fetched from MyAnimeList')
            ->send();
    }

    protected function extractMalIdFromInput(string $input): ?int
    {
        $input = trim($input);
        if (preg_match('#myanimelist\.net/anime/(\d+)#i', $input, $m)) {
            return (int) $m[1];
        }
        if (is_numeric($input)) {
            return (int) $input;
        }

        return null;
    }

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        $existingAnime = Anime::query()
            ->when(
                filled($data['mal_id'] ?? null),
                fn ($query) => $query->where('mal_id', (int) $data['mal_id'])
            )
            ->when(
                blank($data['mal_id'] ?? null) && filled($data['title'] ?? null),
                fn ($query) => $query->whereRaw('LOWER(title) = LOWER(?)', [trim((string) $data['title'])])
            )
            ->first();

        if ($existingAnime) {
            Notification::make()
                ->warning()
                ->title('هذا الأنمي موجود مسبقاً')
                ->body('تم العثور على سجل مطابق، ولم يتم إنشاء سجل مكرر.')
                ->send();

            throw ValidationException::withMessages([
                'title' => ['هذا الأنمي موجود مسبقاً.'],
            ]);
        }

        unset($data['videoSources']);

        return $data;
    }

    protected function onValidationError(ValidationException $exception): void
    {
        Notification::make()
            ->danger()
            ->title('تعذر إنشاء الأنمي')
            ->body('تحقق من الحقول التي تحتوي على أخطاء ثم حاول مرة أخرى.')
            ->send();
    }

    protected function afterCreate(): void
    {
        $sources = $this->form->getState()['videoSources'] ?? [];

        foreach ($sources as $index => $item) {
            AnimeVideoSource::create([
                'anime_id' => $this->record->id,
                'label' => $item['label'] ?? '',
                'url' => $item['url'] ?? '',
                'type' => $item['type'] ?? 'external',
                'priority' => (int) ($item['priority'] ?? $index + 1),
                'is_active' => (bool) ($item['is_active'] ?? true),
            ]);
        }
    }
}
