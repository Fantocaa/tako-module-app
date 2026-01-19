import type { Course } from '@/types';
import { Link } from '@inertiajs/react';
import { Clock, PlayCircle } from 'lucide-react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from './ui/card';

interface CourseCardProps {
    course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
    const formatDuration = (seconds: number | undefined) => {
        if (!seconds) return '0m';
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
    };

    return (
        <Link href={`/courses/${course.slug}`}>
            <Card className="group flex h-full flex-col overflow-hidden border-border/40 bg-card/50 backdrop-blur transition-all hover:border-border hover:bg-card/80 hover:shadow-lg">
                <CardHeader className="space-y-2">
                    <CardTitle className="line-clamp-2 text-lg group-hover:text-primary">
                        {course.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                        {course.description}
                    </CardDescription>
                </CardHeader>
                <CardContent className="mt-auto flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                        <PlayCircle className="h-4 w-4" />
                        <span>{course.lesson_count || 0} pelajaran</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4" />
                        <span>{formatDuration(course.total_duration)}</span>
                    </div>
                </CardContent>
                <CardFooter>
                    <div className="flex flex-wrap gap-1.5">
                        {course.tags?.map((tag) => (
                            <span
                                key={tag.id}
                                className="rounded-xl px-2 py-0.5 text-xs font-medium"
                                style={{
                                    color: tag.color || '#000000',
                                    backgroundColor: `color-mix(in srgb, ${tag.color || '#000000'}, transparent 80%)`,
                                }}
                            >
                                {tag.name}
                            </span>
                        ))}
                    </div>
                </CardFooter>
            </Card>
        </Link>
    );
}
