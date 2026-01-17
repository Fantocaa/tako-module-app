import type { Course } from '@/types';
import { Link } from '@inertiajs/react';
import { Clock, PlayCircle } from 'lucide-react';
import { Badge } from './ui/badge';
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
    const formatDuration = (minutes: number | undefined) => {
        if (!minutes) return '0m';
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
    };

    return (
        <Link href={`/courses/${course.slug}`}>
            <Card className="group overflow-hidden border-border/40 bg-card/50 backdrop-blur transition-all hover:border-border hover:bg-card/80 hover:shadow-lg">
                {/* <div className="relative aspect-video overflow-hidden bg-muted">
                    {course.thumbnail ? (
                        <img
                            src={course.thumbnail}
                            alt={course.title}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                            <PlayCircle className="h-16 w-16 text-primary/40" />
                        </div>
                    )}
                </div> */}
                <CardHeader className="space-y-2">
                    
                    <CardTitle className="line-clamp-2 text-lg group-hover:text-primary">
                        {course.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                        {course.description}
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex items-center gap-4 text-sm text-muted-foreground">
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
                            <Badge
                                key={tag.id}
                                variant="secondary"
                                className="text-xs font-medium"
                            >
                                {tag.name}
                            </Badge>
                        ))}
                    </div>
                </CardFooter>
            </Card>
        </Link>
    );
}
