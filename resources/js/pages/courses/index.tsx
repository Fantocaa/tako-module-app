import AppNavbar from '@/components/app-navbar';
import { CourseCard } from '@/components/course-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { Input } from '@/components/ui/input';
import type { Course, Tag } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { Plus, Search } from 'lucide-react';
import { useEffect, useState } from 'react';

interface CoursesIndexProps {
    courses: {
        data: Course[];
        links: any[];
        meta: any;
    };
    tags: Tag[];
    filters: {
        tag?: string;
        search?: string;
    };
}

export default function CoursesIndex({
    courses,
    tags,
    filters,
}: CoursesIndexProps) {
    const { auth } = usePage().props as any;
    const [selectedTag, setSelectedTag] = useState<string | null>(
        filters.tag || null,
    );
    const [searchQuery, setSearchQuery] = useState(filters.search || '');

    // Update filters when they change
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            router.get(
                '/courses',
                {
                    tag: selectedTag || undefined,
                    search: searchQuery || undefined,
                },
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                },
            );
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [selectedTag, searchQuery]);

    return (
        <>
            <Head title="Series" />
            <Container className="py-6 sm:py-12">
                <AppNavbar />
            </Container>

            <Container className="space-y-8 pb-16">
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                    <div className="space-y-4">
                        <h1 className="text-4xl font-bold tracking-tight">
                            Series
                        </h1>
                        <p className="max-w-2xl text-lg text-muted-foreground">
                            Pelajari topik-topik penting dalam pengembangan
                            aplikasi web dan jadilah developer handal di era
                            teknologi modern.
                        </p>
                    </div>
                    {auth?.user && (
                        <Button
                            variant="default"
                            className="gap-2"
                            onClick={() => router.visit('/courses/create')}
                        >
                            <Plus className="h-4 w-4" />
                            Create Course
                        </Button>
                    )}
                </div>

                {/* Filter Tags */}
                <div className="flex flex-wrap gap-2">
                    <Badge
                        variant={selectedTag === null ? 'default' : 'outline'}
                        className="cursor-pointer px-4 py-1.5 text-sm transition-colors"
                        onClick={() => setSelectedTag(null)}
                    >
                        Semua
                    </Badge>
                    {tags.map((tag) => (
                        <Badge
                            key={tag.id}
                            variant={
                                selectedTag === tag.slug ? 'default' : 'outline'
                            }
                            className="cursor-pointer px-4 py-1.5 text-sm transition-colors"
                            onClick={() => setSelectedTag(tag.slug)}
                        >
                            {tag.name}
                        </Badge>
                    ))}
                </div>

                {/* Search */}
                <div className="relative max-w-md">
                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Cari course..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Courses Grid */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {courses.data.map((course) => (
                        <CourseCard key={course.id} course={course} />
                    ))}
                </div>

                {courses.data.length === 0 && (
                    <div className="py-12 text-center">
                        <p className="text-muted-foreground">
                            Tidak ada course yang ditemukan.
                        </p>
                    </div>
                )}

                {/* Pagination */}
                {courses.links && courses.links.length > 3 && (
                    <div className="flex justify-center gap-2">
                        {courses.links.map((link: any, index: number) => (
                            <button
                                key={index}
                                onClick={() => {
                                    if (link.url) {
                                        router.visit(link.url, {
                                            preserveState: true,
                                            preserveScroll: false,
                                        });
                                    }
                                }}
                                disabled={!link.url}
                                className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                                    link.active
                                        ? 'bg-primary text-primary-foreground'
                                        : link.url
                                          ? 'bg-muted hover:bg-muted/80'
                                          : 'cursor-not-allowed bg-muted/50 text-muted-foreground'
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </Container>
        </>
    );
}
