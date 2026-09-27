import { Head, Link, router, useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import PublicLayout from '@/layouts/public-layout';

function getYoutubeEmbedUrl(url: string): string | null {
    try {
        const u = new URL(url);
        const id =
            u.hostname === 'youtu.be'
                ? u.pathname.slice(1)
                : u.searchParams.get('v');
        return id ? `https://www.youtube.com/embed/${id}?autoplay=1` : null;
    } catch {
        return null;
    }
}

function TrailerModal({
    trailerUrl,
    title,
}: {
    trailerUrl: string;
    title: string;
}) {
    const embedUrl = useMemo(
        () => getYoutubeEmbedUrl(trailerUrl),
        [trailerUrl],
    );

    if (!embedUrl) {
        return (
            <a
                href={trailerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-sm border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-all duration-300 hover:border-violet-500/50 hover:bg-violet-500/5"
            >
                <svg
                    className="size-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                    />
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
                Watch trailer
            </a>
        );
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-sm border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-all duration-300 hover:border-violet-500/50 hover:bg-violet-500/5"
                >
                    <svg
                        className="size-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                        />
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    Watch trailer
                </button>
            </DialogTrigger>
            <DialogContent className="max-w-5xl border-none bg-black p-0 shadow-2xl">
                <DialogTitle className="sr-only">
                    {title} – Trailer
                </DialogTitle>
                <div className="aspect-video w-full overflow-hidden rounded-sm">
                    <iframe
                        src={embedUrl}
                        title={`${title} trailer`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        className="size-full"
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}

function getInitials(name: string): string {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
}

function CommentAvatar({ name }: { name: string }) {
    const colors = [
        'bg-rose-500',
        'bg-amber-500',
        'bg-emerald-500',
        'bg-cyan-500',
        'bg-blue-500',
        'bg-violet-500',
        'bg-fuchsia-500',
    ];
    const hash = name
        .split('')
        .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const colorClass = colors[hash % colors.length];

    return (
        <div className="relative flex shrink-0">
            <div
                className={`flex size-10 items-center justify-center rounded-full ${colorClass} text-sm font-semibold text-white shadow-lg`}
            >
                {getInitials(name)}
            </div>
            <div className="absolute -bottom-0.5 -left-0.5 flex size-3 items-center justify-center rounded-full border-2 border-card bg-emerald-500">
                <svg
                    className="size-1.5 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                    />
                </svg>
            </div>
        </div>
    );
}

type WatchLink = {
    id: number;
    label: string;
    url: string;
};

type AnimeComment = {
    id: number;
    body: string;
    author_name: string;
    created_at: string;
};

type Props = {
    anime: {
        id: number;
        title: string;
        overview: string | null;
        poster_url: string | null;
        trailer_url: string | null;
        release_date: string | null;
        episodes_count: number | null;
        vote_average: string | number | null;
        watch_links: WatchLink[];
        comments: AnimeComment[];
        visitor_rating_average: number | null;
        visitor_rating_count: number;
        current_rating: number | null;
    };
    commentStoreUrl: string;
    ratingStoreUrl: string;
};

function StarRating({
    value,
    count,
    currentRating,
    onSubmit,
    disabled,
}: {
    value: number | null;
    count: number;
    currentRating: number | null;
    onSubmit: (rating: number) => void;
    disabled?: boolean;
}) {
    const [hover, setHover] = useState<number | null>(null);
    const display = hover ?? currentRating ?? 0;

    return (
        <div className="flex flex-col gap-1">
            <div
                className="flex items-center gap-1"
                onMouseLeave={() => setHover(null)}
            >
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        disabled={disabled}
                        className={cn(
                            'rounded p-0.5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 disabled:opacity-50',
                            display >= star
                                ? 'text-amber-400'
                                : 'text-muted-foreground/50',
                        )}
                        onMouseEnter={() => setHover(star)}
                        onClick={() => onSubmit(star)}
                        aria-label={`${star} نجوم`}
                    >
                        <svg
                            className="size-8"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                    </button>
                ))}
            </div>
            {(value != null || count > 0) && (
                <p className="text-xs text-muted-foreground">
                    {value != null ? `${Number(value).toFixed(1)}` : '—'} (
                    {count} تقييم)
                </p>
            )}
        </div>
    );
}

function formatCommentDate(iso: string): string {
    const d = new Date(iso);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    if (diff < 60000) return 'الآن';
    if (diff < 3600000) return `منذ ${Math.floor(diff / 60000)} د`;
    if (diff < 86400000) return `منذ ${Math.floor(diff / 3600000)} س`;
    return d.toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

export default function AnimeWatch({
    anime,
    commentStoreUrl,
    ratingStoreUrl,
}: Props) {
    const watchLinks = anime.watch_links ?? [];
    const comments = anime.comments ?? [];
    const visitorRatingAverage = anime.visitor_rating_average ?? null;
    const visitorRatingCount = anime.visitor_rating_count ?? 0;
    const currentRating = anime.current_rating ?? null;

    const [ratingSubmitting, setRatingSubmitting] = useState(false);
    const form = useForm({ body: '', author_name: '', author_email: '' });

    const handleRatingSubmit = (rating: number) => {
        setRatingSubmitting(true);
        router.post(
            ratingStoreUrl,
            { rating },
            {
                preserveScroll: true,
                onFinish: () => setRatingSubmitting(false),
            },
        );
    };

    return (
        <PublicLayout>
            <Head title={`${anime.title} – Film Night`} />
            <div className="space-y-8 px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
                <div className="animate-fade-in opacity-0">
                    <Link
                        href="/anime"
                        className="group inline-flex items-center gap-2 rounded-sm border border-border bg-card px-3 py-2 text-sm font-medium text-muted-foreground shadow-sm transition-all duration-300 hover:border-violet-500/40 hover:bg-violet-500/5 hover:text-foreground"
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
                        <span>أنمي الأسبوع</span>
                    </Link>
                </div>

                <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
                    <div
                        className="animate-fade-in-up opacity-0 lg:col-span-2"
                        style={{ animationDelay: '100ms' }}
                    >
                        <div>
                            <h2 className="mb-3 font-display text-sm font-medium tracking-wide text-foreground lg:text-base">
                                أين تشاهد الأنمي
                            </h2>
                            {watchLinks.length === 0 ? (
                                <p className="rounded-sm border border-border/50 bg-card px-4 py-6 text-center text-sm text-muted-foreground">
                                    لا يوجد روابط مشاهدة لهذا الأنمي.
                                </p>
                            ) : (
                                <div className="flex flex-wrap gap-2">
                                    {watchLinks.map((link) => (
                                        <a
                                            key={link.id}
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 rounded-sm border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground transition-all duration-300 hover:border-violet-500/50 hover:bg-violet-500/5 hover:text-violet-400"
                                        >
                                            <svg
                                                className="size-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={1.5}
                                                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                                />
                                            </svg>
                                            {link.label}
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div
                        className="animate-fade-in-up space-y-4 opacity-0 lg:col-span-1 lg:space-y-6"
                        style={{ animationDelay: '200ms' }}
                    >
                        <div className="flex items-start gap-4 lg:flex-col lg:gap-0 lg:space-y-4">
                            {anime.poster_url && (
                                <div className="relative w-[110px] shrink-0 sm:w-[140px] lg:w-[180px]">
                                    <span className="absolute top-2 left-2 z-10 rounded-sm bg-violet-600/90 px-2 py-1 text-[10px] font-semibold tracking-wide text-white uppercase">
                                        Series
                                    </span>
                                    <div className="absolute -inset-1 rounded-sm bg-violet-500/10 blur-xl lg:-inset-2" />
                                    <img
                                        src={anime.poster_url}
                                        alt={anime.title}
                                        loading="eager"
                                        decoding="async"
                                        className="relative w-full rounded-sm border border-border/50 object-cover shadow-lg lg:shadow-xl"
                                    />
                                </div>
                            )}

                            <div className="min-w-0 flex-1">
                                <div className="mb-2 h-px w-12 bg-violet-500/40 lg:mb-3 lg:w-16" />
                                <h1 className="font-display text-xl leading-tight font-semibold tracking-wide text-foreground sm:text-2xl lg:text-4xl">
                                    {anime.title}
                                </h1>
                                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground lg:mt-4 lg:gap-4 lg:text-sm">
                                    {anime.release_date && (
                                        <span className="flex items-center gap-1">
                                            <svg
                                                className="size-3.5 lg:size-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={1.5}
                                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                />
                                            </svg>
                                            {anime.release_date}
                                        </span>
                                    )}
                                    {anime.episodes_count != null && (
                                        <span className="flex items-center gap-1">
                                            <svg
                                                className="size-3.5 lg:size-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={1.5}
                                                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                                />
                                            </svg>
                                            {anime.episodes_count} حلقة
                                        </span>
                                    )}
                                    {anime.vote_average != null && (
                                        <span className="flex items-center gap-1 font-medium text-amber-400">
                                            <svg
                                                className="size-3.5 lg:size-4"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                            {Number(anime.vote_average).toFixed(
                                                1,
                                            )}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {anime.overview && (
                            <div>
                                <h3 className="mb-1.5 font-display text-base font-medium text-foreground lg:mb-2 lg:text-lg">
                                    Synopsis
                                </h3>
                                <p className="text-xs leading-relaxed text-muted-foreground lg:text-sm">
                                    {anime.overview}
                                </p>
                            </div>
                        )}

                        {anime.trailer_url && (
                            <TrailerModal
                                trailerUrl={anime.trailer_url}
                                title={anime.title}
                            />
                        )}
                    </div>
                </div>

                <div
                    className="animate-fade-in-up space-y-8 opacity-0"
                    style={{ animationDelay: '300ms' }}
                >
                    <div className="flex items-center gap-4">
                        <div className="h-px flex-1 bg-gradient-to-r from-violet-500/30 to-transparent" />
                        <div className="flex items-center gap-2">
                            <div className="flex -space-x-2">
                                {comments.slice(0, 3).map((c, i) => (
                                    <div
                                        key={c.id}
                                        className={`relative flex size-8 items-center justify-center rounded-full border-2 border-card text-xs font-bold text-white shadow-md ${i === 0 ? 'bg-rose-500' : i === 1 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                                        style={{ zIndex: 3 - i }}
                                    >
                                        {getInitials(c.author_name)}
                                    </div>
                                ))}
                            </div>
                            <span className="font-display text-sm font-medium text-foreground">
                                {comments.length > 0 ? (
                                    <>
                                        تقييمات من{' '}
                                        <span className="text-violet-400">
                                            {comments.length}
                                        </span>{' '}
                                        زائر
                                    </>
                                ) : (
                                    'كن أول من يقيّم'
                                )}
                            </span>
                        </div>
                        <div className="h-px flex-1 bg-gradient-to-l from-violet-500/30 to-transparent" />
                    </div>

                    <div className="group relative overflow-hidden rounded-xl border border-border/50 bg-card p-6">
                        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                        <div className="relative">
                            <div className="mb-4 flex items-center justify-between">
                                <p className="font-display text-sm font-medium text-foreground">
                                    قيّم الأنمي
                                </p>
                                <div className="flex items-center gap-1.5 rounded-full bg-violet-500/10 px-3 py-1">
                                    <svg
                                        className="size-3.5 text-amber-400"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                    <span className="text-xs font-medium text-foreground">
                                        {visitorRatingCount > 0
                                            ? `${Number(visitorRatingAverage ?? 0).toFixed(1)} / 5`
                                            : '0 / 5'}
                                    </span>
                                </div>
                            </div>
                            <StarRating
                                value={visitorRatingAverage}
                                count={visitorRatingCount}
                                currentRating={currentRating}
                                onSubmit={handleRatingSubmit}
                                disabled={ratingSubmitting}
                            />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <p className="font-display text-sm font-medium text-foreground">
                                التعليقات
                            </p>
                            {comments.length > 0 && (
                                <span className="rounded-full bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-400">
                                    {comments.length}{' '}
                                    {comments.length === 1
                                        ? 'تعليق'
                                        : 'تعليقات'}
                                </span>
                            )}
                        </div>

                        <div className="space-y-4">
                            {comments.length === 0 ? (
                                <div className="relative overflow-hidden rounded-xl border border-border/50 bg-card p-8 text-center">
                                    <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-transparent" />
                                    <div className="relative">
                                        <div className="mb-4 flex justify-center">
                                            <div className="flex size-16 items-center justify-center rounded-full bg-violet-500/10">
                                                <svg
                                                    className="size-8 text-violet-500/60"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={1.5}
                                                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                                    />
                                                </svg>
                                            </div>
                                        </div>
                                        <p className="mb-1 font-display text-sm font-medium text-foreground">
                                            لا توجد تعليقات بعد
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            كن أول من يشارك انطباعه عن الأنمي
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid gap-4">
                                    {comments.map((c, index) => (
                                        <div
                                            key={c.id}
                                            className="group relative overflow-hidden rounded-xl border border-border/50 bg-card p-5 transition-all duration-300 hover:border-violet-500/30 hover:shadow-lg hover:shadow-violet-500/5"
                                            style={{
                                                animationDelay: `${index * 50}ms`,
                                            }}
                                        >
                                            <div className="absolute top-0 right-0 size-16 overflow-hidden">
                                                <div className="absolute -top-4 -right-4 size-24 rotate-45 bg-violet-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                            </div>
                                            <div className="relative flex gap-4">
                                                <CommentAvatar
                                                    name={c.author_name}
                                                />
                                                <div className="min-w-0 flex-1">
                                                    <div className="mb-2 flex items-center gap-2">
                                                        <span className="font-display text-sm font-semibold text-foreground">
                                                            {c.author_name}
                                                        </span>
                                                        <span className="text-xs text-muted-foreground">
                                                            ·
                                                        </span>
                                                        <span className="text-xs text-muted-foreground">
                                                            {formatCommentDate(
                                                                c.created_at,
                                                            )}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm leading-relaxed text-foreground/90">
                                                        {c.body}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="relative overflow-hidden rounded-xl border border-border/50 bg-card p-6">
                            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                            <div className="relative">
                                <div className="mb-5 flex items-center gap-3">
                                    <div className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-violet-600 text-white shadow-lg">
                                        <svg
                                            className="size-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                            />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-display text-sm font-medium text-foreground">
                                            أضف تعليقك
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            شاركنا رأيك في الأنمي
                                        </p>
                                    </div>
                                </div>
                                <form
                                    className="flex flex-col gap-4"
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        form.post(commentStoreUrl, {
                                            preserveScroll: true,
                                            onSuccess: () => form.reset(),
                                        });
                                    }}
                                >
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="relative">
                                            <Input
                                                id="author_name"
                                                className="peer bg-transparent py-3 ps-10"
                                                value={form.data.author_name}
                                                onChange={(e) =>
                                                    form.setData(
                                                        'author_name',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder=" "
                                                autoComplete="name"
                                            />
                                            <Label
                                                htmlFor="author_name"
                                                className="pointer-events-none absolute start-10 top-3 truncate text-xs text-muted-foreground transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:-top-2.5 peer-focus:bg-card peer-focus:px-1 peer-focus:text-xs peer-focus:text-violet-500"
                                            >
                                                الاسم
                                            </Label>
                                            <div className="absolute start-3 top-3.5 text-muted-foreground">
                                                <svg
                                                    className="size-4"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={1.5}
                                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                    />
                                                </svg>
                                            </div>
                                            <InputError
                                                className="absolute start-0 -bottom-5"
                                                message={
                                                    form.errors.author_name
                                                }
                                            />
                                        </div>
                                        <div className="relative">
                                            <Input
                                                id="author_email"
                                                type="email"
                                                className="peer bg-transparent py-3 ps-10"
                                                value={form.data.author_email}
                                                onChange={(e) =>
                                                    form.setData(
                                                        'author_email',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder=" "
                                                autoComplete="email"
                                            />
                                            <Label
                                                htmlFor="author_email"
                                                className="pointer-events-none absolute start-10 top-3 truncate text-xs text-muted-foreground transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:-top-2.5 peer-focus:bg-card peer-focus:px-1 peer-focus:text-xs peer-focus:text-violet-500"
                                            >
                                                البريد (اختياري)
                                            </Label>
                                            <div className="absolute start-3 top-3.5 text-muted-foreground">
                                                <svg
                                                    className="size-4"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={1.5}
                                                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                                    />
                                                </svg>
                                            </div>
                                            <InputError
                                                className="absolute start-0 -bottom-5"
                                                message={
                                                    form.errors.author_email
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="relative pt-2">
                                        <textarea
                                            id="body"
                                            rows={4}
                                            className={cn(
                                                'flex w-full min-w-0 rounded-md border border-input bg-transparent px-4 py-3 text-base shadow-xs transition-all duration-200 outline-none placeholder:text-muted-foreground md:text-sm',
                                                'focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20',
                                                'aria-invalid:border-destructive',
                                                form.errors.body &&
                                                    'border-destructive focus:border-destructive focus:ring-destructive/20',
                                            )}
                                            value={form.data.body}
                                            onChange={(e) =>
                                                form.setData(
                                                    'body',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="اكتب تعليقك هنا..."
                                        />
                                        <InputError
                                            className="absolute start-0 -bottom-5"
                                            message={form.errors.body}
                                        />
                                    </div>
                                    <div className="flex items-center justify-end pt-2">
                                        <Button
                                            type="submit"
                                            disabled={form.processing}
                                            className="group relative overflow-hidden bg-violet-600 hover:bg-violet-700"
                                        >
                                            <span className="relative z-10 flex items-center gap-2">
                                                {form.processing ? (
                                                    <>
                                                        <svg
                                                            className="size-4 animate-spin"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <circle
                                                                className="opacity-25"
                                                                cx="12"
                                                                cy="12"
                                                                r="10"
                                                                stroke="currentColor"
                                                                strokeWidth="4"
                                                            />
                                                            <path
                                                                className="opacity-75"
                                                                fill="currentColor"
                                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                            />
                                                        </svg>
                                                        جاري الإرسال...
                                                    </>
                                                ) : (
                                                    <>
                                                        إرسال
                                                        <svg
                                                            className="size-4 transition-transform duration-200 group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M14 5l7 7m0 0l-7 7m7-7H3"
                                                            />
                                                        </svg>
                                                    </>
                                                )}
                                            </span>
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
