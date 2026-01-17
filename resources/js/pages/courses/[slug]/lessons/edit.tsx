import AppNavbar from '@/components/app-navbar';
import LessonForm from '@/components/lesson-form';
import { Container } from '@/components/ui/container';
import { Course, Lesson } from '@/types';

interface EditLessonProps {
    course: Course;
    lesson: Lesson;
}

export default function EditLesson({ course, lesson }: EditLessonProps) {
    return (
        <>
            <Container className="py-6 sm:py-12">
                <AppNavbar />
            </Container>

            <Container className="max-w-3xl pb-16">
                <div className="mb-8 space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">
                        Edit Episode: {lesson.title}
                    </h1>
                    <p className="text-muted-foreground">
                        Update the content or details for this lesson in {course.title}.
                    </p>
                </div>

                <div className="rounded-xl border bg-card p-6 shadow-sm">
                    <LessonForm
                        course={course}
                        lesson={lesson}
                        submitLabel="Update Lesson"
                        action={`/courses/${course.slug}/lessons/${lesson.id}`}
                        method="put"
                    />
                </div>
            </Container>
        </>
    );
}
