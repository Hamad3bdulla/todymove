import { Head, Link } from '@inertiajs/react';
import { archive, watch } from '@/routes';
import PublicLayout from '@/layouts/public-layout';

type MovieSummary = {
    id: number;
    title: string;
    type?: string | null;
    poster_url: string | null;
    trailer_url?: string | null;
    release_date?: string | null;
    vote_average?: string | number | null;
};

type Props = {
    hasAnimeOfWeek?: boolean;
    filmOfWeek?: MovieSummary[];
    archivePreview?: {
        id: number;
        title: string;
        type?: string | null;
        poster_url: string | null;
    }[];
};

function isSeriesType(type?: string | null): boolean {
    return ['tv', 'series', 'tv_series'].includes((type ?? '').toLowerCase());
}

function FilmOfWeekCard({ movie }: { movie: MovieSummary }) {
    return (
        <Link
            href={watch.url(movie.id)}
            className="group relative block overflow-hidden rounded-sm bg-card transition-all duration-500 hover:-translate-y-2"
        >
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-40" />
            <div className="aspect-[2/3] w-full overflow-hidden bg-muted">
                {isSeriesType(movie.type) && (
                    <span className="absolute top-3 left-3 z-10 rounded-sm bg-violet-600/90 px-2 py-1 text-[10px] font-semibold tracking-wide text-white uppercase">
                        Series
                    </span>
                )}
                {movie.poster_url ? (
                    <img
                        src={movie.poster_url}
                        alt={movie.title}
                        loading="lazy"
                        decoding="async"
                        className="size-full object-cover transition duration-700 group-hover:scale-110"
                    />
                ) : (
                    <div className="flex size-full items-center justify-center text-sm text-muted-foreground">
                        No poster
                    </div>
                )}
            </div>
            <div className="absolute right-0 bottom-0 left-0 p-4">
                <div className="mb-1 h-px w-8 bg-primary/60" />
                <h3 className="font-display text-lg leading-tight font-semibold text-foreground transition-colors group-hover:text-primary">
                    {movie.title}
                </h3>
                <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                    {movie.release_date && (
                        <span className="font-medium">
                            {movie.release_date.slice(0, 4)}
                        </span>
                    )}
                    {movie.vote_average != null && (
                        <span className="flex items-center gap-1 font-medium text-amber-400">
                            <svg
                                className="size-3"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            {Number(movie.vote_average).toFixed(1)}
                        </span>
                    )}
                </div>
            </div>
            <div className="absolute top-3 right-3 flex size-8 items-center justify-center rounded-full border border-primary/30 bg-black/40 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                <svg
                    className="size-4 text-primary"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                        clipRule="evenodd"
                    />
                </svg>
            </div>
        </Link>
    );
}

function ArchiveCard({
    movie,
}: {
    movie: { id: number; title: string; type?: string | null; poster_url: string | null };
}) {
    return (
        <Link
            href={watch.url(movie.id)}
            className="group block overflow-hidden rounded-sm bg-card transition-all duration-300 hover:-translate-y-1"
        >
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="aspect-[2/3] overflow-hidden bg-muted">
                {isSeriesType(movie.type) && (
                    <span className="absolute top-3 left-3 z-10 rounded-sm bg-violet-600/90 px-2 py-1 text-[10px] font-semibold tracking-wide text-white uppercase">
                        Series
                    </span>
                )}
                {movie.poster_url ? (
                    <img
                        src={movie.poster_url}
                        alt={movie.title}
                        loading="lazy"
                        decoding="async"
                        className="size-full object-cover transition duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex size-full items-center justify-center text-xs text-muted-foreground">
                        No poster
                    </div>
                )}
            </div>
            <div className="relative p-3">
                <h3 className="line-clamp-2 font-display text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                    {movie.title}
                </h3>
            </div>
            <div className="absolute right-3 bottom-12 left-3 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                <span className="inline-flex items-center gap-1 rounded-sm bg-primary/90 px-2 py-1 text-xs font-medium text-primary-foreground">
                    <svg
                        className="size-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                            clipRule="evenodd"
                        />
                    </svg>
                    Watch
                </span>
            </div>
        </Link>
    );
}

function filmOfWeekGridClass(count: number): string {
    if (count <= 0) return '';
    if (count === 1) return 'flex justify-center';
    if (count === 2)
        return 'grid grid-cols-2 gap-6 sm:gap-10 justify-items-center max-w-3xl mx-auto';
    if (count === 3)
        return 'grid grid-cols-3 gap-4 sm:gap-8 justify-items-center max-w-4xl mx-auto';
    return 'grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 justify-items-center';
}

export default function Home({
    hasAnimeOfWeek = false,
    filmOfWeek = [],
    archivePreview = [],
}: Props) {
    return (
        <PublicLayout>
            <Head title="Film Night" />
            <div className="min-h-screen">
                {/* Anime of the Week banner */}
                {hasAnimeOfWeek && (
                    <section className="animate-fade-in-up border-b border-border/50 bg-gradient-to-r from-violet-500/5 via-violet-500/10 to-violet-500/5 opacity-0">
                        <div className="relative px-4 py-3 sm:px-6">
                            <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 sm:flex-row">
                                <div className="flex items-center gap-3">
                                    <span className="flex size-10 items-center justify-center rounded-lg bg-violet-500/20 text-xl">
                                        📺
                                    </span>
                                    <div>
                                        <p className="font-display text-sm font-medium text-foreground">
                                            أنمي الأسبوع
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            لدينا اختيار أنمي هذا الأسبوع
                                        </p>
                                    </div>
                                </div>
                                <Link
                                    href="/anime"
                                    className="inline-flex items-center gap-2 rounded-lg border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-sm font-medium text-violet-400 transition-all duration-300 hover:border-violet-500/50 hover:bg-violet-500/20"
                                >
                                    <span>عرض الأنمي</span>
                                    <svg
                                        className="size-4 rtl:rotate-180"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M9 5l7 7-7 7"
                                        />
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    </section>
                )}

                {/* Hero Section */}
                <section className="relative overflow-hidden">
                    {/* Ambient background effect */}
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
                    <div className="absolute top-0 left-1/2 h-96 w-[600px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />

                    <div className="relative px-4 pt-12 pb-16 sm:px-6 sm:pt-16">
                        <div className="mx-auto max-w-5xl">
                            <div className="animate-fade-in-up text-center opacity-0">
                                <div className="mb-3 flex items-center justify-center gap-3">
                                    <span className="h-px w-12 bg-primary/40" />
                                    <span className="text-xs font-medium tracking-[0.25em] text-primary uppercase">
                                        This Week's Selection
                                    </span>
                                    <span className="h-px w-12 bg-primary/40" />
                                </div>
                                <h1 className="font-display text-4xl font-semibold tracking-wide text-foreground sm:text-5xl lg:text-6xl">
                                    <span className="text-gold-gradient">
                                        Film
                                    </span>{' '}
                                    of the Week
                                </h1>
                                <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
                                    Handpicked for your viewing pleasure
                                </p>
                            </div>

                            {(filmOfWeek?.length ?? 0) > 0 ? (
                                <div
                                    className={`mt-12 ${filmOfWeekGridClass(filmOfWeek.length)}`}
                                >
                                    {filmOfWeek.map((movie, index) => (
                                        <div
                                            key={movie.id}
                                            className="animate-fade-in-up opacity-0"
                                            style={{
                                                animationDelay: `${(index + 1) * 150}ms`,
                                            }}
                                        >
                                            <FilmOfWeekCard movie={movie} />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="mt-12 rounded-sm border border-dashed border-border/50 bg-card/30 py-16 text-center">
                                    <div className="mb-3 text-4xl">🎬</div>
                                    <p className="font-display text-lg text-muted-foreground">
                                        No film of the week yet
                                    </p>
                                    <p className="mt-1 text-sm text-muted-foreground/70">
                                        Check back soon for new selections
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Archive Section */}
                <section className="relative border-t border-border/50">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/2 to-transparent opacity-30" />
                    <div className="relative px-4 py-12 sm:px-6 sm:py-16">
                        <div className="mx-auto max-w-5xl">
                            <div className="mb-8 flex items-center justify-between">
                                <div>
                                    <h2 className="font-display text-2xl font-semibold tracking-wide text-foreground sm:text-3xl">
                                        The Archive
                                    </h2>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Your film collection
                                    </p>
                                </div>
                                <Link
                                    href={archive().url}
                                    className="group inline-flex items-center gap-2 rounded-sm border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-all duration-300 hover:border-primary/50 hover:bg-primary/5"
                                >
                                    <span>View all</span>
                                    <svg
                                        className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M9 5l7 7-7 7"
                                        />
                                    </svg>
                                </Link>
                            </div>
                            {(archivePreview?.length ?? 0) > 0 ? (
                                <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
                                    {archivePreview.map((movie, index) => (
                                        <div
                                            key={movie.id}
                                            className="animate-fade-in-up opacity-0"
                                            style={{
                                                animationDelay: `${(index + 1) * 100}ms`,
                                            }}
                                        >
                                            <ArchiveCard movie={movie} />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    No films in the archive yet.
                                </p>
                            )}
                        </div>
                    </div>
                </section>
            </div>
        </PublicLayout>
    );
}
