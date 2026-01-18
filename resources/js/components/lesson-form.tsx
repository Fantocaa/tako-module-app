import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useForm } from '@inertiajs/react';
import { useState } from 'react';

interface LessonFormProps {
    course: any;
    lesson?: any;
    submitLabel: string;
    action: string;
    method?: 'post' | 'put' | 'patch';
}

export default function LessonForm({
    course,
    lesson,
    submitLabel,
    action,
    method = 'post',
}: LessonFormProps) {
    const { data, setData, post, put, processing, errors } = useForm({
        title: lesson?.title || '',
        content_type: lesson?.content_type || 'video',
        video_url: lesson?.video_url || '',
        video_file: null as File | null,
        content: lesson?.content || '',
        duration: lesson?.duration || 0,
        order: lesson?.order || '',
    });

    const [videoSource, setVideoSource] = useState<'url' | 'file'>(
        lesson?.video_path ? 'file' : 'url',
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Clear the other field based on source
        if (videoSource === 'url') {
            // data.video_file = null; // Can't easily mutate data directly with useForm helper if we want to ensure it's null, but we can just ignore it or set it before submit?
            // Actually useForm's setData is async/state based.
            // Best to just ensure data is correct in form state.
        } else {
            // data.video_url = '';
        }

        if (method === 'post') {
            post(action);
        } else {
            // Workaround for file uploads with PUT method in Inertia/Laravel
            // Laravel cannot read multipart/form-data for PUT requests
            if (data.video_file && videoSource === 'file') {
                (data as any)._method = 'put';
                post(action);
            } else {
                put(action);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                    id="title"
                    value={data.title}
                    onChange={(e) => setData('title', e.target.value)}
                    placeholder="e.g. Introduction to Routing"
                    required
                />
                {errors.title && (
                    <p className="text-sm text-destructive">{errors.title}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="content_type">Content Type</Label>
                <Select
                    value={data.content_type}
                    onValueChange={(value) =>
                        setData('content_type', value as any)
                    }
                >
                    <SelectTrigger id="content_type">
                        <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="video">Video</SelectItem>
                        <SelectItem value="article">Article</SelectItem>
                    </SelectContent>
                </Select>
                {errors.content_type && (
                    <p className="text-sm text-destructive">
                        {errors.content_type}
                    </p>
                )}
            </div>

            {data.content_type === 'video' ? (
                <>
                    <div className="space-y-3 rounded-md border p-4">
                        <Label>Video Source</Label>
                        <div className="flex items-center gap-4">
                            <label className="flex cursor-pointer items-center gap-2 text-sm">
                                <input
                                    type="radio"
                                    name="video_source"
                                    value="url"
                                    checked={videoSource === 'url'}
                                    onChange={() => {
                                        setVideoSource('url');
                                        setData('video_file', null);
                                    }}
                                    className="accent-primary"
                                />
                                External URL (YouTube)
                            </label>
                            <label className="flex cursor-pointer items-center gap-2 text-sm">
                                <input
                                    type="radio"
                                    name="video_source"
                                    value="file"
                                    checked={videoSource === 'file'}
                                    onChange={() => {
                                        setVideoSource('file');
                                        setData('video_url', '');
                                    }}
                                    className="accent-primary"
                                />
                                Upload File
                            </label>
                        </div>
                    </div>

                    {videoSource === 'url' ? (
                        <div className="space-y-2">
                            <Label htmlFor="video_url">Video URL</Label>
                            <Input
                                id="video_url"
                                value={data.video_url}
                                onChange={(e) =>
                                    setData('video_url', e.target.value)
                                }
                                placeholder="https://www.youtube.com/watch?v=..."
                            />
                            {errors.video_url && (
                                <p className="text-sm text-destructive">
                                    {errors.video_url}
                                </p>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <Label htmlFor="video_file">
                                Upload Video (MP4)
                            </Label>
                            <Input
                                id="video_file"
                                type="file"
                                accept="video/mp4,video/webm"
                                onChange={(e) =>
                                    setData(
                                        'video_file',
                                        e.target.files
                                            ? e.target.files[0]
                                            : null,
                                    )
                                }
                            />
                            {lesson?.video_path && !data.video_file && (
                                <p className="text-xs text-muted-foreground">
                                    Current file: {lesson.video_path}
                                </p>
                            )}
                            {errors.video_file && (
                                <p className="text-sm text-destructive">
                                    {errors.video_file}
                                </p>
                            )}
                        </div>
                    )}
                </>
            ) : null}

            <div className="space-y-2">
                <Label htmlFor="content">
                    {data.content_type === 'video'
                        ? 'Description (Optional)'
                        : 'Article Content'}
                </Label>
                <textarea
                    id="content"
                    className="flex min-h-[200px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                    value={data.content}
                    onChange={(e) => setData('content', e.target.value)}
                    placeholder={
                        data.content_type === 'video'
                            ? 'Video description...'
                            : 'Write your article here (Markdown supported)...'
                    }
                    required={data.content_type === 'article'}
                />
                {errors.content && (
                    <p className="text-sm text-destructive">{errors.content}</p>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="duration">Duration (seconds)</Label>
                    <Input
                        id="duration"
                        type="number"
                        min="0"
                        value={data.duration}
                        onChange={(e) =>
                            setData('duration', parseInt(e.target.value) || 0)
                        }
                        required
                    />
                    {errors.duration && (
                        <p className="text-sm text-destructive">
                            {errors.duration}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="order">Order (Optional)</Label>
                    <Input
                        id="order"
                        type="number"
                        min="1"
                        value={data.order}
                        onChange={(e) => setData('order', e.target.value)}
                        placeholder="Automatic if empty"
                    />
                    {errors.order && (
                        <p className="text-sm text-destructive">
                            {errors.order}
                        </p>
                    )}
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => window.history.back()}
                    disabled={processing}
                >
                    Cancel
                </Button>
                <Button type="submit" variant="default" disabled={processing}>
                    {processing ? 'Saving...' : submitLabel}
                </Button>
            </div>
        </form>
    );
}
