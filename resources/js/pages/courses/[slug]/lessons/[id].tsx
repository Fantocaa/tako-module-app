import AppNavbar from '@/components/app-navbar';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/intent-button';
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
import { Link, router, usePage } from '@inertiajs/react';
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
            <Container className="py-6 sm:py-12">
                <AppNavbar />
            </Container>
            <Container>
                <div className="flex h-screen flex-col lg:flex-row gap-4 ">
                    {/* Main Content */}
                    <div className="flex flex-1 flex-col overflow-hidden rounded-2xl">
                        {/* Content Area - Video or Article */}
                        {lesson.content_type === 'video' && lesson.video_url ? (
                            <MediaPlayer
                                className="aspect-video w-full"
                                autoHide
                                label={lesson.title}
                            >
                                <MediaPlayerVideo src={lesson.video_url} />
                                <MediaPlayerControlsOverlay />
                                <MediaPlayerControls>
                                    <MediaPlayerPlay />
                                    <MediaPlayerSeek />
                                    <MediaPlayerTime />
                                    <MediaPlayerVolume />
                                    <MediaPlayerFullscreen />
                                </MediaPlayerControls>
                            </MediaPlayer>
                        ) : (
                            <div className="bg-muted aspect-video w-full flex items-center justify-center">
                                <p className="text-muted-foreground">
                                    Konten artikel - scroll ke bawah untuk
                                    membaca
                                </p>
                            </div>
                        )}

                        {/* Lesson Info */}
                        <div className="flex-1 overflow-auto">
                            <div className="mx-auto max-w-4xl space-y-6 pt-6">
                                {/* Lesson Title */}
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-4">
                                            <h1 className="text-3xl font-bold">
                                                {lesson.title}
                                            </h1>
                                            {isOwner && (
                                                <Button
                                                    intent="plain"
                                                    size="sq-sm"
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
                                                    intent="outline"
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
                                                    intent="primary"
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
                    <div className="w-full border rounded-2xl lg:w-80 xl:w-96 h-fit">
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
