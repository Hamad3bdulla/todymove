<?php

namespace App\Filament\Admin\Resources\Animes\Schemas;

use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\TagsInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class AnimeForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Anime details')
                    ->schema([
                        TextInput::make('title')
                            ->label('MyAnimeList link or title')
                            ->placeholder('e.g. https://myanimelist.net/anime/51818/...')
                            ->helperText('Paste a MyAnimeList anime page URL or enter a title manually.')
                            ->required()
                            ->maxLength(500),
                        Repeater::make('videoSources')
                            ->schema([
                                TextInput::make('label')
                                    ->label('الاسم')
                                    ->required()
                                    ->maxLength(255)
                                    ->placeholder('مثل: Netflix، Crunchyroll'),
                                TextInput::make('url')
                                    ->label('رابط المشاهدة')
                                    ->url()
                                    ->required()
                                    ->maxLength(2048)
                                    ->placeholder('https://...'),
                                TextInput::make('type')
                                    ->default('external')
                                    ->dehydrated()
                                    ->hidden(),
                                TextInput::make('priority')
                                    ->default(1)
                                    ->dehydrated()
                                    ->hidden(),
                                Toggle::make('is_active')
                                    ->default(true)
                                    ->hidden()
                                    ->dehydrated(),
                            ])
                            ->columns(2)
                            ->defaultItems(0)
                            ->addActionLabel('إضافة رابط مشاهدة'),
                    ]),
                Section::make('Optional metadata')
                    ->description('Filled automatically when using "Fetch from MyAnimeList".')
                    ->schema([
                        TextInput::make('mal_id')
                            ->numeric()
                            ->dehydrated()
                            ->hidden(),
                        DateTimePicker::make('fetched_at')
                            ->dehydrated()
                            ->hidden(),
                        TextInput::make('poster_path')
                            ->label('Poster path')
                            ->helperText('e.g. /path from TMDB image URL')
                            ->maxLength(255),
                        TextInput::make('backdrop_path')
                            ->label('Backdrop path')
                            ->maxLength(255),
                        Textarea::make('overview')
                            ->columnSpanFull(),
                        DatePicker::make('release_date'),
                        TextInput::make('episodes_count')
                            ->numeric()
                            ->minValue(1),
                        TagsInput::make('genres')
                            ->columnSpanFull(),
                        TextInput::make('vote_average')
                            ->numeric()
                            ->minValue(0)
                            ->maxValue(10)
                            ->step(0.01),
                        TextInput::make('vote_count')
                            ->numeric()
                            ->minValue(0),
                        TextInput::make('trailer_youtube_key')
                            ->label('Trailer YouTube key')
                            ->maxLength(20),
                    ])
                    ->columns(2)
                    ->collapsed(),
            ]);
    }
}
