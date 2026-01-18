import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Course } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import dayjs from 'dayjs';
import { Edit, MoreHorizontal, Plus, Search, Trash } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Posts',
        href: '/courses/index',
    },
];

interface CoursesIndexProps {
    courses: {
        data: Course[];
        links: any[];
        meta: any;
    };
    filters: {
        search?: string;
        status?: string;
    };
}

export default function CoursesIndex({ courses, filters }: CoursesIndexProps) {
    const [searchQuery, setSearchQuery] = useState(filters.search || '');

    const handleSearch = (term: string) => {
        setSearchQuery(term);
        router.get(
            '/courses/index',
            { search: term },
            { preserveState: true, replace: true },
        );
    };

    const handleDelete = (course: Course) => {
        if (confirm('Are you sure you want to delete this course?')) {
            router.delete(`/courses/${course.id}`, {
                onSuccess: () => toast.success('Course deleted successfully'),
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Posts" />
            <div className="flex-1 space-y-6 p-4 md:p-8">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Posts
                        </h1>
                        <p className="text-muted-foreground">
                            Manage your blog posts and articles
                        </p>
                    </div>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="relative w-full sm:w-72">
                        <Search className="absolute top-2.5 left-2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search posts..."
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="pl-8"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                            Sort by:
                        </span>
                        <Select defaultValue="newest">
                            <SelectTrigger className="w-[120px]">
                                <SelectValue placeholder="Sort" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="newest">Newest</SelectItem>
                                <SelectItem value="oldest">Oldest</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button asChild>
                            <Link href="/courses/create">
                                <Plus className="mr-2 h-4 w-4" /> New post
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {courses.data.map((course) => (
                        <Card key={course.id} className="flex flex-col">
                            <CardHeader className="flex-row items-start justify-between space-y-0 pb-2">
                                <div className="space-y-1">
                                    <CardTitle className="line-clamp-1 text-base font-semibold">
                                        {course.title}
                                    </CardTitle>
                                    <CardDescription>
                                        {course.created_at
                                            ? dayjs(course.created_at).format(
                                                  'MMM DD, YYYY',
                                              )
                                            : '-'}
                                    </CardDescription>
                                </div>
                                {/* Optional: Add image thumbnail here if exists */}
                            </CardHeader>
                            <CardContent className="flex-1">
                                <p className="line-clamp-3 text-sm text-muted-foreground">
                                    {course.description ||
                                        'No description available.'}
                                </p>
                            </CardContent>
                            <CardFooter className="flex items-center justify-between border-t p-4">
                                <Badge
                                    variant={
                                        course.is_published
                                            ? 'default'
                                            : 'secondary'
                                    }
                                >
                                    {course.is_published
                                        ? 'Published'
                                        : 'Draft'}
                                </Badge>
                                <div className="flex items-center gap-1">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 p-0"
                                            >
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem asChild>
                                                <Link
                                                    href={`/courses/${course.id}/edit`}
                                                >
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Edit
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                className="text-red-600 focus:text-red-500"
                                                onClick={() =>
                                                    handleDelete(course)
                                                }
                                            >
                                                <Trash className="mr-2 h-4 w-4" />
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                    <Button variant="outline" size="sm" asChild>
                                        <Link
                                            href={`/courses/${course.id}/edit`}
                                        >
                                            Edit post
                                        </Link>
                                    </Button>
                                </div>
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                {courses.data.length === 0 && (
                    <div className="py-12 text-center">
                        <p className="text-muted-foreground">No posts found.</p>
                    </div>
                )}

                {/* Pagination */}
                {courses.links && courses.links.length > 3 && (
                    <div className="mt-6 flex justify-center gap-2">
                        {courses.links.map((link: any, index: number) => (
                            <Button
                                key={index}
                                variant={link.active ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => {
                                    if (link.url) {
                                        router.visit(link.url, {
                                            preserveState: true,
                                            preserveScroll: true,
                                        });
                                    }
                                }}
                                disabled={!link.url}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
