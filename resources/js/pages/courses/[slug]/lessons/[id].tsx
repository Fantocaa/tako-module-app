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
import { Separator } from '@/components/ui/separator';
import type { Course, Lesson } from '@/types';
import { Link, router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { useState } from 'react';

// Dummy data
const DUMMY_COURSE: Course = {
    id: 1,
    title: 'Belajar design system',
    slug: 'belajar-design-system',
    description:
        'Pelajari step by step membangun design system dari nol mulai dari design tokens, arsitektur komponen, aksesibilitas, theming, dan hal lain menarik lainnya.',
    thumbnail: null,
    is_published: true,
    lesson_count: 20,
    total_duration: 1260,
    tags: [
        { id: 1, name: 'TailwindCSS', slug: 'tailwindcss' },
        { id: 2, name: 'React', slug: 'react' },
        { id: 3, name: 'TypeScript', slug: 'typescript' },
    ],
    created_at: '2026-01-01',
    updated_at: '2026-01-01',
};

const DUMMY_LESSONS: Lesson[] = [
    {
        id: 1,
        course_id: 1,
        title: 'Intro',
        content_type: 'video',
        video_url:
            'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        content:
            'Belajar membuat basic component dengan design system yang baik.',
        duration: 1260,
        order: 1,
        created_at: '2026-01-01',
        updated_at: '2026-01-01',
    },
    {
        id: 2,
        course_id: 1,
        title: 'Tailwind merge',
        content_type: 'article',
        video_url: null,
        content: `
# Tailwind Merge

Tailwind Merge adalah utility yang sangat berguna untuk menggabungkan class Tailwind CSS dengan cara yang cerdas.

## Kenapa Perlu Tailwind Merge?

Ketika kita membuat komponen yang reusable, seringkali kita perlu menggabungkan class default dengan class yang diberikan oleh user. Tanpa tailwind-merge, class yang sama bisa konflik.

## Contoh Penggunaan

\`\`\`tsx
import { cn } from '@/lib/utils';

function Button({ className, ...props }) {
  return (
    <button 
      className={cn('px-4 py-2 bg-blue-500', className)}
      {...props}
    />
  );
}
\`\`\`

Dengan cara ini, class yang diberikan user akan override class default dengan benar.
        `,
        duration: 546,
        order: 2,
        created_at: '2026-01-01',
        updated_at: '2026-01-01',
    },
    {
        id: 3,
        course_id: 1,
        title: 'Variabnya',
        content_type: 'video',
        video_url:
            'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        content: null,
        duration: 510,
        order: 3,
        created_at: '2026-01-01',
        updated_at: '2026-01-01',
    },
];

function formatDuration(seconds: number | null) {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function LessonShow() {
    // In real app, get lesson ID from route params
    const [currentLessonId] = useState(1);
    const course = DUMMY_COURSE;
    const lessons = DUMMY_LESSONS;
    const currentLesson =
        lessons.find((l) => l.id === currentLessonId) || lessons[0];
    const currentIndex = lessons.findIndex((l) => l.id === currentLessonId);
    const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
    const nextLesson =
        currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;

    return (
        <>
            <Container className="py-6 sm:py-12">
                <AppNavbar />
            </Container>
            <Container>
                <div className="flex h-screen flex-col lg:flex-row">
                    {/* Main Content */}
                    <div className="flex flex-1 flex-col overflow-hidden">
                        {/* Content Area - Video or Article */}
                        {currentLesson.content_type === 'video' &&
                        currentLesson.video_url ? (
                            <MediaPlayer
                                className="aspect-video w-full"
                                autoHide
                                label={currentLesson.title}
                            >
                                <MediaPlayerVideo
                                    src={currentLesson.video_url}
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
                        ) : (
                            <div className="flex aspect-video w-full items-center justify-center bg-muted">
                                <p className="text-muted-foreground">
                                    Konten artikel - scroll ke bawah untuk
                                    membaca
                                </p>
                            </div>
                        )}

                        {/* Lesson Info */}
                        <div className="flex-1 overflow-auto bg-background">
                            <div className="mx-auto max-w-4xl space-y-6 p-6">
                                {/* Navigation */}
                                <div className="flex items-center justify-between">
                                    <Link href={`/courses/${course.slug}`}>
                                        <Button
                                            intent="plain"
                                            size="sm"
                                            className="gap-2"
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                            Back to course
                                        </Button>
                                    </Link>
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

                                <Separator />

                                {/* Lesson Title */}
                                <div className="space-y-3">
                                    <h1 className="text-3xl font-bold">
                                        {currentLesson.title}
                                    </h1>
                                    {currentLesson.content_type === 'video' && (
                                        <p className="text-muted-foreground">
                                            {currentLesson.content ||
                                                'Tonton video untuk mempelajari materi ini'}
                                        </p>
                                    )}
                                </div>

                                {/* Article Content */}
                                {currentLesson.content_type === 'article' &&
                                    currentLesson.content && (
                                        <div className="prose prose-neutral dark:prose-invert max-w-none">
                                            <div
                                                dangerouslySetInnerHTML={{
                                                    __html: currentLesson.content
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
                    <div className="w-full border-l bg-card lg:w-80 xl:w-96">
                        <div className="flex h-full flex-col">
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
                                    {lessons.map((lesson, index) => (
                                        <button
                                            key={lesson.id}
                                            onClick={() =>
                                                router.visit(
                                                    `/courses/${course.slug}/lessons/${lesson.id}`,
                                                )
                                            }
                                            className={`group flex w-full items-start gap-3 rounded-lg p-3 text-left transition-colors ${
                                                lesson.id === currentLessonId
                                                    ? 'bg-primary/10 text-primary'
                                                    : 'hover:bg-muted'
                                            }`}
                                        >
                                            <div
                                                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded text-xs font-medium ${
                                                    lesson.id ===
                                                    currentLessonId
                                                        ? 'bg-primary text-primary-foreground'
                                                        : 'bg-muted text-muted-foreground group-hover:bg-primary/20'
                                                }`}
                                            >
                                                {index + 1}
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <h3 className="text-sm leading-tight font-medium">
                                                    {lesson.title}
                                                </h3>
                                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                    <Clock className="h-3 w-3" />
                                                    <span>
                                                        {formatDuration(
                                                            lesson.duration,
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
