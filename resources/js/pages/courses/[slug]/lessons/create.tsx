import AppNavbar from '@/components/app-navbar';
import LessonForm from '@/components/lesson-form';
import { Container } from '@/components/ui/container';
import { Course } from '@/types';

interface CreateLessonProps {
    course: Course;
}

export default function CreateLesson({ course }: CreateLessonProps) {
    return (
        <>
            <Container className="py-6 sm:py-12">
                <AppNavbar />
            </Container>

            <Container className="max-w-3xl pb-16">
                <div className="mb-8 space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">
                        Add Episode to {course.title}
                    </h1>
                    <p className="text-muted-foreground">
                        Create a new video or article lesson for this course.
                    </p>
                </div>

                <div className="rounded-xl border bg-card p-6 shadow-sm">
                    <LessonForm
                        course={course}
                        submitLabel="Create Lesson"
                        action={`/courses/${course.slug}/lessons`}
                    />
                </div>
            </Container>
        </>
    );
}
