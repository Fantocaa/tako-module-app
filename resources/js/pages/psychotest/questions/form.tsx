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
import { Trash } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface QuestionFormProps {
    question?: any;
    mode: 'create' | 'edit';
}

interface FormState {
    test_type: string;
    session_number: number;
    section_number: string | number;
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
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Test Type</Label>
                        <Select
                            value={data.test_type}
                            onValueChange={(val) => setData('test_type', val)}
                        >
                            <SelectTrigger>
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
                </div>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Question Type</Label>
                        <Select
                            value={data.type}
                            onValueChange={(val) => setData('type', val)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select format" />
                            </SelectTrigger>
                            <SelectContent>
                                {data.test_type === 'disc' && (
                                    <SelectItem value="disc">
                                        DISC (Most/Least)
                                    </SelectItem>
                                )}
                                {data.test_type === 'papicostic' && (
                                    <SelectItem value="forced">
                                        Forced Choice (A/B)
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
                                            Comparison
                                        </SelectItem>
                                    </>
                                )}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
                <div className="hidden space-y-2">
                    <Label>Session Number</Label>
                    <Input
                        type="number"
                        value={data.session_number}
                        onChange={(e) =>
                            setData('session_number', parseInt(e.target.value))
                        }
                        readOnly
                        className="bg-slate-100"
                    />
                </div>
                <div className="space-y-2">
                    <Label>Subtest</Label>
                    <Input
                        type="number"
                        placeholder="e.g 1"
                        value={data.section_number}
                        onChange={(e) =>
                            setData('section_number', e.target.value)
                        }
                    />
                </div>
                <div className="space-y-2">
                    <Label>Question Number</Label>
                    <Input
                        type="number"
                        placeholder="e.g 1"
                        value={data.question_number}
                        onChange={(e) =>
                            setData('question_number', e.target.value)
                        }
                    />
                </div>
            </div>

            <div className="space-y-6 rounded-xl border p-6">
                <h3 className="text-lg font-semibold">Question Content</h3>

                {data.type === 'comparison' ? (
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Text Left (1)</Label>
                            <Input
                                value={data.content_text}
                                onChange={(e) =>
                                    setData('content_text', e.target.value)
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Text Right (2)</Label>
                            <Input
                                value={data.content_text2}
                                onChange={(e) =>
                                    setData('content_text2', e.target.value)
                                }
                            />
                        </div>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <Label>Question Text</Label>
                        <Textarea
                            placeholder={
                                data.type === 'disc'
                                    ? 'Optional description...'
                                    : 'Type question here...'
                            }
                            value={data.content_text}
                            onChange={(e) =>
                                setData('content_text', e.target.value)
                            }
                            rows={3}
                        />
                    </div>
                )}
            </div>

            <div className="space-y-6 rounded-xl border p-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Response Options</h3>
                    {(data.type === 'standard' ||
                        data.type === 'multiple_select') && (
                        <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={addOption}
                        >
                            + Add Option
                        </Button>
                    )}
                </div>

                <div className="space-y-4">
                    {data.options.map((option: any, idx: number) => (
                        <div key={idx} className="flex items-start gap-4">
                            <div className="w-24 shrink-0">
                                <Label className="mb-1 block text-xs text-muted-foreground">
                                    ID/Code
                                </Label>
                                <Input
                                    value={option.id}
                                    onChange={(e) =>
                                        updateOptionId(idx, e.target.value)
                                    }
                                    placeholder="ID"
                                />
                            </div>
                            <div className="flex-1">
                                <Label className="mb-1 block text-xs text-muted-foreground">
                                    Option Text
                                </Label>
                                <Input
                                    value={option.text}
                                    onChange={(e) =>
                                        updateOption(idx, e.target.value)
                                    }
                                    placeholder={`Option text...`}
                                />
                            </div>
                            {(data.type === 'standard' ||
                                data.type === 'multiple_select') && (
                                <div className="pt-6">
                                    <Button
                                        type="button"
                                        size="icon"
                                        variant="ghost"
                                        className="text-red-500 hover:bg-red-50 hover:text-red-600"
                                        onClick={() => removeOption(idx)}
                                    >
                                        <Trash className="h-4 w-4" />
                                    </Button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => window.history.back()}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="min-w-[120px]"
                >
                    {isSubmitting
                        ? 'Saving...'
                        : mode === 'create'
                          ? 'Create Question'
                          : 'Save Changes'}
                </Button>
            </div>
        </form>
    );
}
