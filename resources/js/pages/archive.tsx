import { Head, Link } from '@inertiajs/react';
import { home, watch } from '@/routes';
import PublicLayout from '@/layouts/public-layout';

type MovieSummary = {
    id: number;
    title: string;
    type?: string | null;
    poster_url: string | null;
    release_date?: string | null;
    vote_average?: string | number | null;
};

type PaginatedData<T> = {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
};

type Props = {
    movies: PaginatedData<MovieSummary>;
};

function isSeriesType(type?: string | null): boolean {
    return ['tv', 'series', 'tv_series'].includes((type ?? '').toLowerCase());
}

function MovieCard({ movie }: { movie: MovieSummary }) {
    return (
        <Link
            href={watch.url(movie.id)}
            className="group relative block overflow-hidden rounded-sm bg-card transition-all duration-500 hover:-translate-y-2"
        >
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-40" />
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
                        className="size-full object-cover transition duration-700 group-hover:scale-110"
                    />
                ) : (
                    <div className="flex size-full items-center justify-center text-muted-foreground">
                        No poster
                    </div>
                )}
            </div>
            <div className="absolute right-0 bottom-0 left-0 p-3">
                <h3 className="line-clamp-2 font-display text-sm leading-tight font-semibold text-foreground transition-colors group-hover:text-primary">
                    {movie.title}
                </h3>
                <div className="mt-1.5 flex items-center gap-2 text-xs text-muted-foreground">
                    {movie.release_date && (
                        <span className="font-medium">
                            {movie.release_date.slice(0, 4)}
                        </span>
                    )}
                    {movie.vote_average != null && (
                        <span className="flex items-center gap-0.5 text-amber-400">
                            <svg
                                className="size-2.5"
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

export default function Archive({ movies }: Props) {
    const { data, last_page, links } = movies;

    return (
        <PublicLayout>
            <Head title="Archive – Film Night" />
            <div className="space-y-8">
                {/* Header */}
                <div className="animate-fade-in opacity-0">
                    <Link
                        href={home().url}
                        className="group inline-flex items-center gap-2 rounded-sm border border-border bg-card px-3 py-2 text-sm font-medium text-muted-foreground shadow-sm transition-all duration-300 hover:border-primary/40 hover:bg-primary/5 hover:text-foreground"
                    >
                        <span className="flex h-6 w-6 items-center justify-center rounded-full border border-border bg-muted transition-transform duration-300 group-hover:-translate-x-0.5">
                            <svg
                                className="size-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>
                        </span>
                        <span>Back to home</span>
                    </Link>
                    <div className="mt-6">
                        <div className="mb-2 flex items-center gap-3">
                            <span className="h-px w-12 bg-primary/60" />
                            <span className="text-xs font-medium tracking-widest text-primary uppercase">
                                Collection
                            </span>
                        </div>
                        <h1 className="font-display text-3xl font-semibold tracking-wide text-foreground sm:text-4xl">
                            The Archive
                        </h1>
                        <p className="mt-2 text-muted-foreground">
                            {movies.total} film{movies.total !== 1 ? 's' : ''}{' '}
                            in your collection
                        </p>
                    </div>
                </div>

                {data.length > 0 ? (
                    <>
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-5 lg:grid-cols-4 xl:grid-cols-5">
                            {data.map((movie, index) => (
                                <div
                                    key={movie.id}
                                    className="animate-fade-in-up opacity-0"
                                    style={{
                                        animationDelay: `${(index % 8) * 50}ms`,
                                    }}
                                >
                                    <MovieCard movie={movie} />
                                </div>
                            ))}
                        </div>

                        {last_page > 1 && (
                            <nav
                                className="flex flex-wrap items-center justify-center gap-2 pt-8"
                                aria-label="Pagination"
                            >
                                {links.map((link, i) => (
                                    <Link
                                        key={i}
                                        href={link.url ?? '#'}
                                        className={`flex min-w-[2.5rem] items-center justify-center rounded-sm px-3 py-2 text-sm transition-all duration-300 ${
                                            link.active
                                                ? 'border border-primary bg-primary text-primary-foreground'
                                                : 'border border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground'
                                        } ${!link.url ? 'pointer-events-none opacity-50' : ''}`}
                                        preserveScroll
                                    >
                                        {link.label
                                            .replace('&laquo;', '‹')
                                            .replace('&raquo;', '›')}
                                    </Link>
                                ))}
                            </nav>
                        )}
                    </>
                ) : (
                    <div className="rounded-sm border border-dashed border-border/50 bg-card/30 py-16 text-center">
                        <div className="mb-3 text-4xl">🎬</div>
                        <p className="font-display text-lg text-muted-foreground">
                            No films yet
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground/70">
                            Add movies from the admin to start your collection
                        </p>
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}
