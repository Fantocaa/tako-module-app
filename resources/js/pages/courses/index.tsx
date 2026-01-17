import AppNavbar from '@/components/app-navbar';
import { CourseCard } from '@/components/course-card';
import { Badge } from '@/components/ui/badge';
import { Container } from '@/components/ui/container';
import { Input } from '@/components/ui/input';
import type { Course } from '@/types';
import { Search } from 'lucide-react';
import { useState } from 'react';

const DUMMY_COURSES: Course[] = [
    {
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
    },
    {
        id: 2,
        title: 'Laravel team',
        slug: 'laravel-team',
        description:
            'Di seri ini kamu belajar membangun fitur tim di Laravel dan cara simpan serta melindungi data termasuk...',
        thumbnail: null,
        is_published: true,
        lesson_count: 20,
        total_duration: 840,
        tags: [
            { id: 4, name: 'Laravel', slug: 'laravel' },
            { id: 5, name: 'Inertia', slug: 'inertia' },
            { id: 6, name: 'React', slug: 'react' },
        ],
        created_at: '2026-01-01',
        updated_at: '2026-01-01',
    },
    {
        id: 3,
        title: 'Laravel Wayfinder',
        slug: 'laravel-wayfinder',
        description:
            'Hargai Wayfinder dari nol, pelajari apa itu routing dan bagaimana cara menggunakan Wayfinder untuk...',
        thumbnail: null,
        is_published: true,
        lesson_count: 27,
        total_duration: 1020,
        tags: [
            { id: 4, name: 'Laravel', slug: 'laravel' },
            { id: 7, name: 'Server', slug: 'server' },
        ],
        created_at: '2026-01-01',
        updated_at: '2026-01-01',
    },
    {
        id: 4,
        title: 'Laravel Cloud',
        slug: 'laravel-cloud',
        description:
            'Hoster aplikasi tentang cara deploy aplikasi Laravel ke Laravel Cloud, deployment atau dari sisi pem...',
        thumbnail: null,
        is_published: true,
        lesson_count: 15,
        total_duration: 660,
        tags: [
            { id: 4, name: 'Laravel', slug: 'laravel' },
            { id: 7, name: 'Server', slug: 'server' },
        ],
        created_at: '2026-01-01',
        updated_at: '2026-01-01',
    },
    {
        id: 5,
        title: 'Apa yang baru Laravel 12',
        slug: 'apa-yang-baru-laravel-12',
        description:
            'Series ini membahas fitur baru dan update terbaru di Laravel 12 termasuk upgrade ke versi terbaru...',
        thumbnail: null,
        is_published: true,
        lesson_count: 10,
        total_duration: 360,
        tags: [{ id: 4, name: 'Laravel', slug: 'laravel' }],
        created_at: '2026-01-01',
        updated_at: '2026-01-01',
    },
    {
        id: 6,
        title: 'Intent UI 101',
        slug: 'intent-ui-101',
        description:
            'Dokumentasi tentang cara mengimplementasikan Intent UI lengkap dengan contoh code...',
        thumbnail: null,
        is_published: true,
        lesson_count: 12,
        total_duration: 540,
        tags: [
            { id: 3, name: 'TypeScript', slug: 'typescript' },
            { id: 2, name: 'React', slug: 'react' },
        ],
        created_at: '2026-01-01',
        updated_at: '2026-01-01',
    },
    {
        id: 7,
        title: 'Belajar Tailwind CSS 4',
        slug: 'belajar-tailwind-css-4',
        description:
            'Di seri ini kamu belajar cara menggunakan Tailwind CSS 4 dari dasar hingga advanced...',
        thumbnail: null,
        is_published: true,
        lesson_count: 15,
        total_duration: 720,
        tags: [
            { id: 1, name: 'TailwindCSS', slug: 'tailwindcss' },
            { id: 8, name: 'CSS', slug: 'css' },
        ],
        created_at: '2026-01-01',
        updated_at: '2026-01-01',
    },
    {
        id: 8,
        title: 'Belajar Layout di Inertia',
        slug: 'belajar-layout-di-inertia',
        description:
            'Di seri ini kamu belajar berbagai macam cara membuat layout di Inertia, dari layout dasar hingga...',
        thumbnail: null,
        is_published: true,
        lesson_count: 8,
        total_duration: 360,
        tags: [
            { id: 4, name: 'Laravel', slug: 'laravel' },
            { id: 5, name: 'Inertia', slug: 'inertia' },
        ],
        created_at: '2026-01-01',
        updated_at: '2026-01-01',
    },
    {
        id: 9,
        title: 'Belajar Routing di Next.js 15',
        slug: 'belajar-routing-di-nextjs-15',
        description:
            'Pelajari cara routing di Next.js 15 mulai dari basic routing hingga advanced...',
        thumbnail: null,
        is_published: true,
        lesson_count: 18,
        total_duration: 900,
        tags: [
            { id: 2, name: 'React', slug: 'react' },
            { id: 3, name: 'TypeScript', slug: 'typescript' },
        ],
        created_at: '2026-01-01',
        updated_at: '2026-01-01',
    },
    {
        id: 10,
        title: 'Belajar Inertia v2',
        slug: 'belajar-inertia-v2',
        description:
            'Update terbaru dari Inertia.js v2 dengan fitur-fitur baru yang powerful...',
        thumbnail: null,
        is_published: true,
        lesson_count: 14,
        total_duration: 600,
        tags: [
            { id: 4, name: 'Laravel', slug: 'laravel' },
            { id: 5, name: 'Inertia', slug: 'inertia' },
        ],
        created_at: '2026-01-01',
        updated_at: '2026-01-01',
    },
];

const ALL_TAGS = [
    { id: 0, name: 'Laravel', slug: 'laravel' },
    { id: 1, name: 'Inertia', slug: 'inertia' },
    { id: 2, name: 'Filament', slug: 'filament' },
    { id: 3, name: 'React.jsx', slug: 'react' },
    { id: 4, name: 'PHP', slug: 'php' },
    { id: 5, name: 'Queues', slug: 'queues' },
    { id: 6, name: 'TailwindCSS', slug: 'tailwindcss' },
    { id: 7, name: 'Bootstrap', slug: 'bootstrap' },
];

export default function CoursesIndex() {
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredCourses = DUMMY_COURSES.filter((course) => {
        const matchesTag =
            !selectedTag ||
            course.tags?.some((tag) => tag.slug === selectedTag);
        const matchesSearch =
            !searchQuery ||
            course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.description
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase());
        return matchesTag && matchesSearch;
    });

    return (
        <>
            <Container className="py-6 sm:py-12">
                <AppNavbar />
            </Container>

            <Container className="space-y-8 pb-16">
                {/* Header */}
                <div className="space-y-4">
                    <h1 className="text-4xl font-bold tracking-tight">
                        Series
                    </h1>
                    <p className="max-w-2xl text-lg text-muted-foreground">
                        Pelajari topik-topik penting dalam pengembangan aplikasi
                        web dan jadilah developer handal di era teknologi
                        modern.
                    </p>
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
                    {ALL_TAGS.map((tag) => (
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
                    {filteredCourses.map((course) => (
                        <CourseCard key={course.id} course={course} />
                    ))}
                </div>

                {filteredCourses.length === 0 && (
                    <div className="py-12 text-center">
                        <p className="text-muted-foreground">
                            Tidak ada course yang ditemukan.
                        </p>
                    </div>
                )}
            </Container>
        </>
    );
}
