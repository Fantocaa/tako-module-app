import AppNavbar from '@/components/app-navbar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { Separator } from '@/components/ui/separator';
import type { Course } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { Clock, Edit, PlayCircle, Trash2 } from 'lucide-react';

interface CourseShowProps {
    course: Course;
}

function formatDuration(seconds: number | null) {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function CourseShow({ course }: CourseShowProps) {
    const { auth } = usePage().props as any;
    const lessons = course.lessons || [];
    const isOwner = auth?.user?.id === course.instructor?.id;

    const handleDelete = () => {
        if (
            confirm(
                'Are you sure you want to delete this course? This action cannot be undone.',
            )
        ) {
            router.delete(`/courses/${course.slug}`);
        }
    };

    const handleStartLearning = () => {
        if (lessons.length > 0) {
            router.visit(`/courses/${course.slug}/lessons/${lessons[0].id}`);
        }
    };

    return (
        <>
            <Head title={course.title} />
            <Container className="py-6 sm:py-12">
                <AppNavbar />
            </Container>

            <Container className="space-y-8 pb-16">
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

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                    {lessons.length > 0 && (
                        <Button
                            className="gap-2"
                            variant="default"
                            onClick={handleStartLearning}
                        >
                            <PlayCircle className="h-4 w-4" />
                            Mulai Belajar
                        </Button>
                    )}
                    {isOwner && (
                        <>
                            <Button
                                variant="outline"
                                className="gap-2"
                                onClick={() =>
                                    router.visit(`/courses/${course.slug}/edit`)
                                }
                            >
                                <Edit className="h-4 w-4" />
                                Edit Course
                            </Button>
                            <Button
                                variant="outline"
                                className="gap-2"
                                onClick={handleDelete}
                            >
                                <Trash2 className="h-4 w-4" />
                                Delete
                            </Button>
                        </>
                    )}
                </div>

                <Separator />

                {/* Lessons List */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">
                            {lessons.length} episodes siap untuk dipelajari.
                        </h2>
                        {/* {isOwner && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    router.visit(
                                        `/courses/${course.slug}/lessons/create`,
                                    )
                                }
                            >
                                Add Lesson
                            </Button>
                        )} */}
                    </div>

                    {lessons.length > 0 ? (
                        <div className="space-y-2">
                            {lessons.map((lesson: any, index: number) => (
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
                    ) : (
                        <div className="py-12 text-center">
                            <p className="text-muted-foreground">
                                Belum ada lesson untuk course ini.
                            </p>
                            {isOwner && (
                                <Button
                                    variant="default"
                                    className="mt-4"
                                    onClick={() =>
                                        router.visit(
                                            `/courses/${course.slug}/lessons/create`,
                                        )
                                    }
                                >
                                    Create First Lesson
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </Container>
        </>
    );
}
