import AppNavbar from '@/components/app-navbar';
import CourseForm from '@/components/course-form';
import { Container } from '@/components/ui/container';
import { Course, Tag } from '@/types';

interface EditCourseProps {
    course: Course;
    tags: Tag[];
}

export default function EditCourse({ course, tags }: EditCourseProps) {
    return (
        <>
            <Container className="py-6 sm:py-12">
                <AppNavbar />
            </Container>

            <Container className="max-w-3xl pb-16">
                <div className="mb-8 space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">
                        Edit Course: {course.title}
                    </h1>
                    <p className="text-muted-foreground">
                        Update the information for this learning series.
                    </p>
                </div>

                <div className="rounded-xl border bg-card p-6 shadow-sm">
                    <CourseForm
                        course={course}
                        tags={tags}
                        submitLabel="Update Course"
                        action={`/courses/${course.slug}`}
                        method="put"
                    />
                </div>
            </Container>
        </>
    );
}
