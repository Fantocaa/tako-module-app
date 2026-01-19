import AppNavbar from '@/components/app-navbar';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import {
    MediaPlayer,
    MediaPlayerControls,
    MediaPlayerControlsOverlay,
    MediaPlayerFullscreen,
    MediaPlayerPlay,
    MediaPlayerSeek,
    MediaPlayerTime,
    MediaPlayerVideo,
    MediaPlayerVolume,
} from '@/components/ui/media-player';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Course, Lesson } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, Clock, Edit } from 'lucide-react';

interface LessonShowProps {
    course: Course;
    lesson: Lesson;
    lessons: Lesson[];
    prevLesson: Lesson | null;
    nextLesson: Lesson | null;
}

function formatDuration(seconds: number | null) {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function getYouTubeId(url: string) {
    const regExp =
        /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
}

export default function LessonShow({
    course,
    lesson,
    lessons,
    prevLesson,
    nextLesson,
}: LessonShowProps) {
    const { auth } = usePage().props as any;
    const isOwner = auth?.user?.id === course.instructor?.id;

    return (
        <>
            <Head title={lesson.title} />
            <Container className="py-6 sm:py-12">
                <AppNavbar />
            </Container>
            <Container>
                <div className="flex h-screen flex-col gap-4 lg:flex-row">
                    {/* Main Content */}
                    <div className="flex flex-1 flex-col overflow-hidden rounded-2xl">
                        {/* Content Area - Video or Article */}
                        {/* Content Area - Video or Article */}
                        {lesson.content_type === 'video' ? (
                            lesson.video_path ? (
                                <MediaPlayer
                                    className="aspect-video w-full"
                                    autoHide
                                    label={lesson.title}
                                >
                                    <MediaPlayerVideo
                                        src={`/storage/${lesson.video_path}`}
                                    />
                                    <MediaPlayerControlsOverlay />
                                    <MediaPlayerControls>
                                        <MediaPlayerPlay />
                                        <MediaPlayerSeek />
                                        <MediaPlayerTime />
                                        <MediaPlayerVolume />
                                        <MediaPlayerFullscreen />
                                    </MediaPlayerControls>
                                </MediaPlayer>
                            ) : lesson.video_url &&
                              getYouTubeId(lesson.video_url) ? (
                                <div className="aspect-video w-full overflow-hidden rounded-xl bg-black shadow-lg">
                                    <iframe
                                        className="h-full w-full"
                                        src={`https://www.youtube.com/embed/${getYouTubeId(
                                            lesson.video_url,
                                        )}`}
                                        title={lesson.title}
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            ) : null
                        ) : (
                            <div></div>
                        )}

                        {/* Lesson Info */}
                        <div className="flex-1 overflow-auto">
                            <div className="mx-auto max-w-4xl space-y-6 pt-6">
                                {/* Lesson Title */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <h1 className="text-3xl font-bold">
                                                {lesson.title}
                                            </h1>
                                            {isOwner && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() =>
                                                        router.visit(
                                                            `/courses/${course.slug}/lessons/${lesson.id}/edit`,
                                                        )
                                                    }
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                        <div className="flex gap-2">
                                            {prevLesson && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        router.visit(
                                                            `/courses/${course.slug}/lessons/${prevLesson.id}`,
                                                        )
                                                    }
                                                >
                                                    <ChevronLeft className="h-4 w-4" />
                                                    Previous
                                                </Button>
                                            )}
                                            {nextLesson && (
                                                <Button
                                                    variant="default"
                                                    size="sm"
                                                    onClick={() =>
                                                        router.visit(
                                                            `/courses/${course.slug}/lessons/${nextLesson.id}`,
                                                        )
                                                    }
                                                >
                                                    Next
                                                    <ChevronRight className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                    {lesson.content_type === 'video' && (
                                        <p className="text-muted-foreground">
                                            {lesson.content ||
                                                'Tonton video untuk mempelajari materi ini'}
                                        </p>
                                    )}
                                </div>

                                {/* Article Content */}
                                {lesson.content_type === 'article' &&
                                    lesson.content && (
                                        <div className="prose prose-neutral dark:prose-invert max-w-none pb-12">
                                            <div
                                                dangerouslySetInnerHTML={{
                                                    __html: lesson.content
                                                        .split('\n')
                                                        .map((line) => {
                                                            // Simple markdown parsing
                                                            if (
                                                                line.startsWith(
                                                                    '# ',
                                                                )
                                                            )
                                                                return `<h1>${line.slice(2)}</h1>`;
                                                            if (
                                                                line.startsWith(
                                                                    '## ',
                                                                )
                                                            )
                                                                return `<h2>${line.slice(3)}</h2>`;
                                                            if (
                                                                line.startsWith(
                                                                    '### ',
                                                                )
                                                            )
                                                                return `<h3>${line.slice(4)}</h3>`;
                                                            if (
                                                                line.startsWith(
                                                                    '```',
                                                                ) &&
                                                                line.endsWith(
                                                                    '```',
                                                                )
                                                            )
                                                                return '';
                                                            if (
                                                                line.startsWith(
                                                                    '```',
                                                                )
                                                            )
                                                                return '<pre><code>';
                                                            if (line === '```')
                                                                return '</code></pre>';
                                                            if (
                                                                line.trim() ===
                                                                ''
                                                            )
                                                                return '<br />';
                                                            return `<p>${line}</p>`;
                                                        })
                                                        .join(''),
                                                }}
                                            />
                                        </div>
                                    )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar - Lessons List */}
                    <div className="h-fit w-full rounded-2xl border lg:w-80 xl:w-96">
                        <div className="flex h-fit flex-col">
                            {/* Course Header */}
                            <div className="space-y-3 border-b p-4">
                                <Link href={`/courses/${course.slug}`}>
                                    <h2 className="font-semibold hover:text-primary">
                                        {course.title}
                                    </h2>
                                </Link>
                                <p className="text-sm text-muted-foreground">
                                    {lessons.length} episodes
                                </p>
                            </div>

                            {/* Lessons List */}
                            <ScrollArea className="flex-1">
                                <div className="space-y-1 p-2">
                                    {lessons.map((l, index) => (
                                        <button
                                            key={l.id}
                                            onClick={() =>
                                                router.visit(
                                                    `/courses/${course.slug}/lessons/${l.id}`,
                                                )
                                            }
                                            className={`group flex w-full items-start gap-3 rounded-lg p-3 text-left transition-colors ${
                                                l.id === lesson.id
                                                    ? 'bg-primary/10 text-primary'
                                                    : 'hover:bg-muted'
                                            }`}
                                        >
                                            <div
                                                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded text-xs font-medium ${
                                                    l.id === lesson.id
                                                        ? 'bg-primary text-primary-foreground'
                                                        : 'bg-muted text-muted-foreground group-hover:bg-primary/20'
                                                }`}
                                            >
                                                {index + 1}
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <h3 className="text-sm leading-tight font-medium">
                                                    {l.title}
                                                </h3>
                                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                    <Clock className="h-3 w-3" />
                                                    <span>
                                                        {formatDuration(
                                                            l.duration,
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </ScrollArea>
                        </div>
                    </div>
                </div>
            </Container>
        </>
    );
}
