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
import { Textarea } from '@/components/ui/textarea';
import { router, useForm } from '@inertiajs/react';
import {
    ClipboardList,
    FileText,
    Hash,
    Layers,
    Layout,
    Plus,
    Save,
    Settings2,
    Timer,
    Trash,
    Undo2,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface QuestionFormProps {
    question?: any;
    mode: 'create' | 'edit';
}

interface FormState {
    test_type: string;
    session_number: number;
    section_number: string | number;
    section_duration: string | number;
    question_number: string | number;
    type: string;
    content_text: string;
    content_text2: string;
    options: { id: string; text: string }[];
}

export default function QuestionForm({ question, mode }: QuestionFormProps) {
    const { data, setData, post, put, processing, errors, transform } =
        useForm<FormState>({
            test_type: question?.test_type || 'disc',
            session_number: question?.session_number || 3,
            section_number: question?.section_number || '',
            section_duration: question?.section_duration
                ? Math.floor(question.section_duration / 60)
                : '',
            question_number: question?.question_number || '',
            type: question?.type || 'disc',
            // Content helpers
            content_text: question?.content?.text || '',
            content_text2: question?.content?.text2 || '', // For comparison
            // Options helper (array of objects)
            options:
                question?.options ||
                ([
                    { id: '1', text: '' },
                    { id: '2', text: '' },
                    { id: '3', text: '' },
                    { id: '4', text: '' },
                ] as any[]),
        });

    // Auto-set session number and type based on test type
    useEffect(() => {
        if (data.test_type === 'papicostic') {
            setData((d) => ({
                ...d,
                session_number: 1,
                type: 'forced',
            }));
        }
        if (data.test_type === 'cfit') {
            const validCfitTypes = [
                'standard',
                'multiple_select',
                'comparison',
            ];
            setData((d) => ({
                ...d,
                session_number: 2,
                type: validCfitTypes.includes(d.type) ? d.type : 'standard',
            }));
        }
        if (data.test_type === 'disc') {
            setData((d) => ({
                ...d,
                session_number: 3,
                type: 'disc',
            }));
        }
    }, [data.test_type]);

    // Initialize options based on type
    useEffect(() => {
        if (!question && mode === 'create') {
            if (data.type === 'disc') {
                setData('options', [
                    { id: '1', text: '' },
                    { id: '2', text: '' },
                    { id: '3', text: '' },
                    { id: '4', text: '' },
                ]);
            } else if (data.type === 'forced') {
                setData('options', [
                    { id: 'a', text: '' },
                    { id: 'b', text: '' },
                ]);
            } else if (data.type === 'comparison') {
                setData('options', [
                    { id: 's', text: 'S (Sama)' },
                    { id: 'ts', text: 'TS (Tidak Sama)' },
                ]);
            }
        }
    }, [data.type]);

    const [isSubmitting, setIsSubmitting] = useState(processing);

    useEffect(() => {
        setIsSubmitting(processing);
    }, [processing]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        setIsSubmitting(true);

        const payload = {
            ...data,
            section_number: data.section_number
                ? parseInt(data.section_number as string)
                : null,
            section_duration: data.section_duration
                ? parseInt(data.section_duration as string) * 60
                : null,
            content: {
                text: data.content_text,
                text2: data.content_text2,
            },
        };

        if (mode === 'edit') {
            router.put(`/psychotest-questions/${question.id}`, payload, {
                onFinish: () => setIsSubmitting(false),
            });
        } else {
            router.post('/psychotest-questions', payload, {
                onFinish: () => setIsSubmitting(false),
            });
        }
    };

    const addOption = () => {
        const id = String(data.options.length + 1);
        setData('options', [...data.options, { id, text: '' }]);
    };

    const removeOption = (index: number) => {
        const newOptions = [...data.options];
        newOptions.splice(index, 1);
        setData('options', newOptions);
    };

    const updateOption = (index: number, val: string) => {
        const newOptions = [...data.options];
        newOptions[index].text = val;
        setData('options', newOptions);
    };

    const updateOptionId = (index: number, val: string) => {
        const newOptions = [...data.options];
        newOptions[index].id = val;
        setData('options', newOptions);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="mx-auto max-w-5xl space-y-8 pb-12"
        >
            {/* Section 1: Assessment Profiling */}
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:shadow-md">
                <div className="flex items-center gap-3 border-b border-border bg-muted/30 px-6 py-4">
                    <div className="rounded-lg bg-indigo-500/10 p-2 text-indigo-500">
                        <Settings2 className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-foreground">
                            Assessment Profiling
                        </h3>
                        <p className="text-xs text-muted-foreground">
                            Configure global settings for this subtest section.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8 p-6 md:grid-cols-3">
                    <div className="space-y-2">
                        <Label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                            Test Type
                        </Label>
                        <Select
                            value={data.test_type}
                            onValueChange={(val) => setData('test_type', val)}
                        >
                            <SelectTrigger className="h-11 border-border bg-background transition-colors focus:ring-ring">
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="disc">DISC</SelectItem>
                                <SelectItem value="papicostic">
                                    Papicostic
                                </SelectItem>
                                <SelectItem value="cfit">CFIT</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                            Subtest Number
                        </Label>
                        <div className="relative">
                            <Input
                                type="number"
                                placeholder="e.g 1"
                                value={data.section_number}
                                onChange={(e) =>
                                    setData('section_number', e.target.value)
                                }
                                className="h-11 border-border bg-background pl-10 transition-colors focus:ring-ring"
                            />
                            <Layers className="absolute top-3 left-3 h-5 w-5 text-muted-foreground" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                            Subtest Duration
                        </Label>
                        <div className="relative">
                            <Input
                                type="number"
                                placeholder="e.g 3"
                                value={data.section_duration}
                                onChange={(e) =>
                                    setData('section_duration', e.target.value)
                                }
                                className="h-11 border-border bg-background pr-12 pl-10 transition-colors focus:ring-ring"
                            />
                            <Timer className="absolute top-3 left-3 h-5 w-5 text-muted-foreground" />
                            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs font-medium text-muted-foreground">
                                min
                            </div>
                        </div>
                        <p className="text-[10px] text-muted-foreground">
                            * Applies to all questions in section{' '}
                            {data.section_number || '#'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Section 2: Question Identity */}
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:shadow-md">
                <div className="flex items-center gap-3 border-b border-border bg-muted/30 px-6 py-4">
                    <div className="rounded-lg bg-amber-500/10 p-2 text-amber-500">
                        <Hash className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-foreground">
                            Question Registry
                        </h3>
                        <p className="text-xs text-muted-foreground">
                            Define the specific identity and format of this
                            question.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8 p-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                            Question Number
                        </Label>
                        <div className="relative">
                            <Input
                                type="number"
                                placeholder="e.g 1"
                                value={data.question_number}
                                onChange={(e) =>
                                    setData('question_number', e.target.value)
                                }
                                className="h-11 border-border bg-background pl-10 transition-colors focus:ring-ring"
                            />
                            <ClipboardList className="absolute top-3 left-3 h-5 w-5 text-muted-foreground" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                            Question Format
                        </Label>
                        <Select
                            value={data.type}
                            onValueChange={(val) => setData('type', val)}
                        >
                            <SelectTrigger className="h-11 border-border bg-background transition-colors focus:ring-ring">
                                <SelectValue placeholder="Select format" />
                            </SelectTrigger>
                            <SelectContent>
                                {data.test_type === 'disc' && (
                                    <SelectItem value="disc">
                                        DISC (Most / Least)
                                    </SelectItem>
                                )}
                                {data.test_type === 'papicostic' && (
                                    <SelectItem value="forced">
                                        Forced Choice (A / B)
                                    </SelectItem>
                                )}
                                {data.test_type === 'cfit' && (
                                    <>
                                        <SelectItem value="standard">
                                            Standard Choice
                                        </SelectItem>
                                        <SelectItem value="multiple_select">
                                            Multiple Select
                                        </SelectItem>
                                        <SelectItem value="comparison">
                                            Image Comparison
                                        </SelectItem>
                                    </>
                                )}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* Section 3: Question Content */}
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:shadow-md">
                <div className="flex items-center gap-3 border-b border-border bg-muted/30 px-6 py-4">
                    <div className="rounded-lg bg-blue-500/10 p-2 text-blue-500">
                        <FileText className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-foreground">
                            Question Content
                        </h3>
                        <p className="text-xs text-muted-foreground">
                            Input the text or comparison data for this question.
                        </p>
                    </div>
                </div>

                <div className="p-6">
                    {data.type === 'comparison' ? (
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-xs font-semibold text-muted-foreground">
                                    Left Content
                                </Label>
                                <Input
                                    value={data.content_text}
                                    onChange={(e) =>
                                        setData('content_text', e.target.value)
                                    }
                                    className="h-11 border-border bg-background focus:ring-ring"
                                    placeholder="e.g. Image URL or text"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-semibold text-muted-foreground">
                                    Right Content
                                </Label>
                                <Input
                                    value={data.content_text2}
                                    onChange={(e) =>
                                        setData('content_text2', e.target.value)
                                    }
                                    className="h-11 border-border bg-background focus:ring-ring"
                                    placeholder="e.g. Image URL or text"
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold text-muted-foreground">
                                {data.type === 'disc'
                                    ? 'Optional Header Text'
                                    : 'Question Prompt'}
                            </Label>
                            <Textarea
                                placeholder={
                                    data.type === 'disc'
                                        ? 'e.g. Choose one most and one least...'
                                        : 'e.g. Which shape follows the pattern?'
                                }
                                value={data.content_text}
                                onChange={(e) =>
                                    setData('content_text', e.target.value)
                                }
                                className="min-h-[100px] border-border bg-background focus:ring-ring"
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Section 4: Response Options */}
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:shadow-md">
                <div className="flex items-center justify-between border-b border-border bg-muted/30 px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-500">
                            <Layout className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-foreground">
                                Response Options
                            </h3>
                            <p className="text-xs text-muted-foreground">
                                Manage the available choices for candidates.
                            </p>
                        </div>
                    </div>
                    {(data.type === 'standard' ||
                        data.type === 'multiple_select') && (
                        <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={addOption}
                            className="bg-background hover:bg-muted hover:text-emerald-500"
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Add Option
                        </Button>
                    )}
                </div>

                <div className="space-y-4 p-6">
                    {data.options.map((option: any, idx: number) => (
                        <div
                            key={idx}
                            className="group flex animate-in items-end gap-4 rounded-xl border border-border bg-muted/20 p-4 transition-colors fade-in slide-in-from-top-2 hover:bg-muted/40"
                        >
                            <div className="w-24 shrink-0">
                                <Label className="mb-1 block text-[10px] font-bold tracking-tighter text-muted-foreground uppercase">
                                    ID Code
                                </Label>
                                <Input
                                    value={option.id}
                                    onChange={(e) =>
                                        updateOptionId(idx, e.target.value)
                                    }
                                    className="h-10 border-border bg-background text-center font-mono focus:ring-ring"
                                    placeholder="ID"
                                />
                            </div>
                            <div className="flex-1">
                                <Label className="mb-1 block text-[10px] font-bold tracking-tighter text-muted-foreground uppercase">
                                    Value / Label
                                </Label>
                                <Input
                                    value={option.text}
                                    onChange={(e) =>
                                        updateOption(idx, e.target.value)
                                    }
                                    className="h-10 border-border bg-background focus:ring-ring"
                                    placeholder={`Enter option label...`}
                                />
                            </div>
                            {(data.type === 'standard' ||
                                data.type === 'multiple_select') && (
                                <Button
                                    type="button"
                                    size="icon"
                                    variant="ghost"
                                    className="h-10 w-10 text-muted-foreground opacity-0 group-hover:text-destructive group-hover:opacity-100"
                                    onClick={() => removeOption(idx)}
                                >
                                    <Trash className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between border-t border-border pt-8">
                <Button
                    type="button"
                    variant="ghost"
                    onClick={() => window.history.back()}
                    className="text-muted-foreground hover:text-foreground"
                >
                    <Undo2 className="mr-2 h-4 w-4" />
                    Discard Changes
                </Button>
                <div className="flex gap-4">
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="h-11 min-w-[160px] bg-indigo-600 shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 dark:shadow-none"
                    >
                        {isSubmitting ? (
                            'Saving...'
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                {mode === 'create'
                                    ? 'Create Question'
                                    : 'Save Changes'}
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </form>
    );
}
