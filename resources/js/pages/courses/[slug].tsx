import AppNavbar from '@/components/app-navbar';
import { Badge } from '@/components/ui/badge';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/intent-button';
import { Separator } from '@/components/ui/separator';
import type { Course, Lesson } from '@/types';
import { router } from '@inertiajs/react';
import { Clock, PlayCircle } from 'lucide-react';

// Dummy data for course detail
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
        video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        content: 'Belajar membuat basic component',
        duration: 1260,
        order: 1,
        created_at: '2026-01-01',
        updated_at: '2026-01-01',
    },
    {
        id: 2,
        course_id: 1,
        title: 'Tailwind merge',
        content_type: 'video',
        video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        content: null,
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
        video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        content: null,
        duration: 510,
        order: 3,
        created_at: '2026-01-01',
        updated_at: '2026-01-01',
    },
    {
        id: 4,
        course_id: 1,
        title: 'Tailwind variants',
        content_type: 'video',
        video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        content: null,
        duration: 901,
        order: 4,
        created_at: '2026-01-01',
        updated_at: '2026-01-01',
    },
    {
        id: 5,
        course_id: 1,
        title: 'Design token',
        content_type: 'video',
        video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        content: null,
        duration: 1047,
        order: 5,
        created_at: '2026-01-01',
        updated_at: '2026-01-01',
    },
    {
        id: 6,
        course_id: 1,
        title: 'Input',
        content_type: 'video',
        video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        content: null,
        duration: 1454,
        order: 6,
        created_at: '2026-01-01',
        updated_at: '2026-01-01',
    },
    {
        id: 7,
        course_id: 1,
        title: 'State errors',
        content_type: 'video',
        video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        content: null,
        duration: 635,
        order: 7,
        created_at: '2026-01-01',
        updated_at: '2026-01-01',
    },
    {
        id: 8,
        course_id: 1,
        title: 'Fieldset dan invalid',
        content_type: 'video',
        video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        content: null,
        duration: 1038,
        order: 8,
        created_at: '2026-01-01',
        updated_at: '2026-01-01',
    },
    {
        id: 9,
        course_id: 1,
        title: 'Input group',
        content_type: 'video',
        video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        content: null,
        duration: 1007,
        order: 9,
        created_at: '2026-01-01',
        updated_at: '2026-01-01',
    },
    {
        id: 10,
        course_id: 1,
        title: 'Password field',
        content_type: 'video',
        video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        content: null,
        duration: 1440,
        order: 10,
        created_at: '2026-01-01',
        updated_at: '2026-01-01',
    },
    {
        id: 11,
        course_id: 1,
        title: 'FS password field di mobile',
        content_type: 'video',
        video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        content: null,
        duration: 127,
        order: 11,
        created_at: '2026-01-01',
        updated_at: '2026-01-01',
    },
    {
        id: 12,
        course_id: 1,
        title: 'Popover',
        content_type: 'video',
        video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        content: null,
        duration: 1607,
        order: 12,
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

export default function CourseShow() {
    const course = DUMMY_COURSE;
    const lessons = DUMMY_LESSONS;

    return (
        <>
            <Container className="py-6 sm:py-12">
                <AppNavbar />
            </Container>

            <Container className="space-y-8 pb-16">
                {/* Back Button */}
                {/* <Link href="/courses">
                    <Button intent="plain" size="sm" className="gap-2">
                        <ChevronLeft className="h-4 w-4" />
                        Series
                    </Button>
                </Link> */}

                {/* Course Header */}
                <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                        {course.tags?.map((tag) => (
                            <Badge
                                key={tag.id}
                                variant="secondary"
                                className="text-sm"
                            >
                                {tag.name}
                            </Badge>
                        ))}
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight">
                        {course.title}
                    </h1>
                    <p className="max-w-3xl text-lg text-muted-foreground">
                        {course.description}
                    </p>
                </div>

                {/* Action Tabs */}
                <div className="flex gap-3">
                    <Button className="gap-2" intent="primary">
                        <PlayCircle className="h-4 w-4" />
                        Mulai Belajar
                    </Button>
                    <Button intent="outline" className="gap-2">
                        <Clock className="h-4 w-4" />
                        Tonton Nanti
                    </Button>
                    {/* <Button intent="outline">Bagikan</Button> */}
                </div>

                <Separator />

                {/* Lessons List */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">
                        {lessons.length} episodes siap untuk dipelajari.
                    </h2>

                    <div className="space-y-2">
                        {lessons.map((lesson, index) => (
                            <button
                                key={lesson.id}
                                onClick={() =>
                                    router.visit(
                                        `/courses/${course.slug}/lessons/${lesson.id}`,
                                    )
                                }
                                className="group flex w-full items-center gap-4 rounded-lg border border-border/40 bg-card/30 px-4 py-3 text-left transition-all hover:border-border hover:bg-card/60"
                            >
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted text-sm font-medium text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground">
                                    {index + 1}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-medium group-hover:text-primary">
                                        {lesson.title}
                                    </h3>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Clock className="h-4 w-4" />
                                    <span>
                                        {formatDuration(lesson.duration)}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </Container>
        </>
    );
}
