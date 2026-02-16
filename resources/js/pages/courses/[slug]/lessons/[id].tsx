import AppNavbar from '@/components/app-navbar';
import { Container } from '@/components/ui/container';
import {
    MediaPlayer,
    MediaPlayerControls,
    MediaPlayerControlsOverlay,
    MediaPlayerFullscreen,
    MediaPlayerPlay,
    MediaPlayerSeek,
    MediaPlayerTime,
    MediaPlayerVideo,
    MediaPlayerVolume,
} from '@/components/ui/media-player';
import type { Course, Lesson } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, PlayCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface LessonShowProps {
    course: Course;
    lesson: Lesson;
    lessons: Lesson[];
    prevLesson: Lesson | null;
    nextLesson: Lesson | null;
}

function formatDuration(seconds: number | null) {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function getYouTubeId(url: string) {
    const regExp =
        /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
}

export default function LessonShow({
    course,
    lesson,
    lessons,
    prevLesson,
    nextLesson,
}: LessonShowProps) {
    const { auth } = usePage().props as any;
    const isOwner = auth?.user?.id === course.instructor?.id;

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#202020] to-black text-white">
            <Head title={lesson.title} />
            <Container className="py-6 sm:py-12">
                <AppNavbar />
            </Container>
            <Container>
                <div className="mx-auto px-4 py-8">
                    {/* Breadcrumbs */}
                    <div className="mb-8 flex items-center gap-2 text-sm font-medium text-white/40">
                        <Link href="/courses" className="hover:text-white">
                            Series
                        </Link>
                        <ChevronRight className="h-4 w-4" />
                        <Link
                            href={`/courses/${course.slug}`}
                            className="hover:text-white"
                        >
                            {course.title}
                        </Link>
                        <ChevronRight className="h-4 w-4" />
                        <span className="text-white/60">
                            {lessons.findIndex((l) => l.id === lesson.id) + 1}
                        </span>
                    </div>

                    <div className="flex flex-col gap-8 lg:flex-row">
                        {/* Sidebar - Lessons List */}
                        <div className="w-full shrink-0 lg:w-[350px]">
                            <div className="overflow-hidden rounded-2xl border border-white/5 bg-[#121212]">
                                <div className="border-b border-white/5 p-6">
                                    <Link href={`/courses/${course.slug}`}>
                                        <h2 className="mb-2 text-lg leading-tight font-bold text-white transition-colors hover:text-white/80">
                                            {course.title}
                                        </h2>
                                    </Link>
                                    <p className="text-sm font-medium text-white/30">
                                        {lessons.length} videos
                                    </p>
                                </div>

                                <div className="p-2">
                                    {lessons.map((l, index) => (
                                        <button
                                            key={l.id}
                                            onClick={() =>
                                                router.visit(
                                                    `/courses/${course.slug}/lessons/${l.id}`,
                                                )
                                            }
                                            className={`group flex w-full items-center gap-4 rounded-xl p-4 text-left transition-all ${
                                                l.id === lesson.id
                                                    ? 'bg-white/5 text-white'
                                                    : 'text-white/40 hover:bg-white/[0.02] hover:text-white/70'
                                            }`}
                                        >
                                            <div
                                                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                                                    l.id === lesson.id
                                                        ? 'bg-white text-black'
                                                        : 'bg-white/5 text-white/30 group-hover:bg-white/10 group-hover:text-white/50'
                                                }`}
                                            >
                                                {index + 1}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <h3 className="truncate text-sm leading-tight font-semibold">
                                                    {l.title}
                                                </h3>
                                                <div className="mt-1 flex items-center gap-2 text-[10px] font-bold tracking-wider uppercase">
                                                    <span>
                                                        {formatDuration(
                                                            l.duration,
                                                        )}
                                                    </span>
                                                    <svg
                                                        className="h-3 w-3 fill-current"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path d="M18 10h-1.58A7 7 0 1 0 10 16.42V18h4v-1.58A7 7 0 0 0 18 10zM10 4a5 5 0 1 1 0 10 5 5 0 0 1 0-10z" />
                                                    </svg>
                                                </div>
                                            </div>
                                            {l.id === lesson.id && (
                                                <PlayCircle className="h-5 w-5 fill-current text-white/20" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="min-w-0 flex-1">
                            {/* Video Area */}
                            {lesson.content_type === 'video' && (
                                <div className="overflow-hidden rounded-2xl border border-white/5 bg-black shadow-2xl">
                                    {lesson.video_path ? (
                                        <MediaPlayer
                                            className="aspect-video w-full"
                                            autoHide
                                            label={lesson.title}
                                        >
                                            <MediaPlayerVideo
                                                src={`/storage/${lesson.video_path}`}
                                            />
                                            <MediaPlayerControlsOverlay />
                                            <MediaPlayerControls>
                                                <MediaPlayerPlay />
                                                <MediaPlayerSeek />
                                                <MediaPlayerTime />
                                                <MediaPlayerVolume />
                                                <MediaPlayerFullscreen />
                                            </MediaPlayerControls>
                                        </MediaPlayer>
                                    ) : lesson.video_url &&
                                      getYouTubeId(lesson.video_url) ? (
                                        <div className="aspect-video w-full">
                                            <iframe
                                                className="h-full w-full"
                                                src={`https://www.youtube.com/embed/${getYouTubeId(
                                                    lesson.video_url,
                                                )}`}
                                                title={lesson.title}
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            ></iframe>
                                        </div>
                                    ) : null}
                                </div>
                            )}

                            {/* Lesson Info */}
                            <div className="mt-10">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="min-w-0 flex-1 space-y-4">
                                        <h1 className="text-3xl font-bold tracking-tight text-white">
                                            {lesson.title}
                                        </h1>

                                        <div className="prose prose-lg max-w-none text-white/80 prose-invert">
                                            {lesson.content ? (
                                                <ReactMarkdown
                                                    remarkPlugins={[remarkGfm]}
                                                >
                                                    {lesson.content}
                                                </ReactMarkdown>
                                            ) : (
                                                <p className="text-white/50">
                                                    Mari kita mulai belajar
                                                    materi ini.
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex shrink-0 items-center gap-2">
                                        <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/5 bg-white/5 text-white/40 transition-all hover:bg-white/10 hover:text-white">
                                            <ChevronLeft className="h-5 w-5" />
                                        </button>
                                        <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/5 bg-white/5 text-white/40 transition-all hover:bg-white/10 hover:text-white">
                                            <ChevronRight className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
}
