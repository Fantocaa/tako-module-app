import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Head, useForm } from '@inertiajs/react';
import React from 'react';

interface PsychotestLink {
    id: number;
    uuid: string;
    applicant_name: string;
}

interface Question {
    id: number;
    test_type: string;
    session_number: number;
    section_number: number | null;
    question_number: number;
    type: string;
    content: any;
    options: any;
}

interface Props {
    link: PsychotestLink;
    session: number;
    questions: Question[];
    timeLimit: number;
    remainingTime: number;
}

interface ProcessedSection {
    id: string;
    title: string;
    description: string;
    questions: Question[];
}

export default function TakeTest({
    link,
    session,
    questions,
    timeLimit,
    remainingTime,
}: Props) {
    const [timeLeft, setTimeLeft] = React.useState(remainingTime);
    const { data, setData, post, processing } = useForm<{
        answers: Record<string, any>;
        session: number;
    }>({
        answers: {},
        session: session,
    });

    React.useEffect(() => {
        if (timeLeft <= 0) {
            autoSubmit();
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleAnswerChange = (questionId: number, answer: any) => {
        setData('answers', {
            ...data.answers,
            [questionId]: answer,
        });
    };

    const handleCheckboxChoice = (questionId: number, optionId: string) => {
        const current = (data.answers[questionId] as string[]) || [];
        if (current.includes(optionId)) {
            handleAnswerChange(
                questionId,
                current.filter((id) => id !== optionId),
            );
        } else {
            if (current.length < 2) {
                handleAnswerChange(questionId, [...current, optionId]);
            }
        }
    };

    const handleDiscChoice = (
        questionId: number,
        optionId: string,
        mode: 'most' | 'least',
    ) => {
        const current = data.answers[questionId] || { most: null, least: null };

        // If picking the same as the other mode, clear the other mode
        if (mode === 'most' && current.least === optionId) current.least = null;
        if (mode === 'least' && current.most === optionId) current.most = null;

        handleAnswerChange(questionId, {
            ...current,
            [mode]: optionId,
        });
    };

    const autoSubmit = () => {
        post(`/p/${link.uuid}/submit`);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/p/${link.uuid}/submit`);
    };

    // Group questions into sections
    const sections: ProcessedSection[] = React.useMemo(() => {
        const groups: Record<number, Question[]> = {};
        questions.forEach((q) => {
            const sec = q.section_number || 0; // Default section 0 if null
            if (!groups[sec]) groups[sec] = [];
            groups[sec].push(q);
        });

        return Object.entries(groups).map(([secNum, qs]) => {
            // Try to infer title/desc from first question content if available, or generic
            const guide = qs[0]?.content;
            return {
                id: `sec_${secNum}`,
                title:
                    qs[0]?.test_type === 'cfit'
                        ? `Subtes ${secNum}`
                        : guide?.section_title || `Section ${secNum}`,
                description:
                    guide?.section_description ||
                    `Please answer the following questions.`,
                questions: qs,
            };
        });
    }, [questions]);

    const isAllAnswered = questions.every((q) => {
        if (q.type === 'disc') {
            return data.answers[q.id]?.most && data.answers[q.id]?.least;
        }
        if (q.type === 'checkbox') {
            return (data.answers[q.id] as string[])?.length === 2; // Assuming min 2 for checkbox
        }
        return data.answers[q.id];
    });

    return (
        <div className="min-h-screen bg-background p-4 text-foreground md:p-8">
            <Head title={`Psychotest - ${link.applicant_name}`} />
            <div className="mx-auto max-w-4xl">
                <div className="sticky top-4 z-10 mb-6 flex justify-center">
                    <div
                        className={`flex items-center gap-3 rounded-full px-8 py-3 text-xl font-black shadow-xl ring-2 transition-all ${
                            timeLeft < 60
                                ? 'animate-pulse bg-red-600 text-white ring-red-400'
                                : 'bg-card text-foreground ring-primary'
                        }`}
                    >
                        <span className="text-xs font-bold tracking-[0.2em] uppercase opacity-80">
                            Time:
                        </span>
                        {formatTime(timeLeft)}
                    </div>
                </div>

                <Card className="overflow-hidden rounded-3xl border-none bg-card shadow-lg">
                    <CardHeader className="bg-gradient-to-br from-primary/95 to-primary p-8 text-white">
                        <div className="flex items-start justify-between">
                            <div className="space-y-2">
                                <CardTitle className="text-2xl leading-none font-bold tracking-tight text-primary-foreground">
                                    Official Assessment
                                </CardTitle>
                                <CardDescription className="text-lg text-primary-foreground/80">
                                    Link ID:{' '}
                                    <span className="font-mono">
                                        {link.uuid.split('-')[0]}
                                    </span>{' '}
                                    • Session {session}
                                </CardDescription>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-bold tracking-widest text-primary-foreground uppercase opacity-60">
                                    Candidate
                                </p>
                                <p className="text-xl font-bold text-primary-foreground">
                                    {link.applicant_name}
                                </p>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="bg-card p-0">
                        <form onSubmit={handleSubmit}>
                            <div className="divide-y divide-border">
                                {sections.map((section) => (
                                    <div
                                        key={section.id}
                                        className="space-y-8 p-8 transition-colors hover:bg-muted/30"
                                    >
                                        <div className="space-y-1">
                                            <h2 className="text-2xl font-black tracking-tight text-foreground">
                                                {section.title}
                                            </h2>
                                            <p className="font-medium text-muted-foreground">
                                                {section.description}
                                            </p>
                                        </div>

                                        <div className="grid gap-6">
                                            {section.questions.map(
                                                (q: Question, idx: number) => {
                                                    // Map DB 'content' and 'options' to UI
                                                    const text =
                                                        q.content?.text;
                                                    const text2 =
                                                        q.content?.text2;
                                                    // const imageUrl = q.content?.image_url; // Not used yet
                                                    const options =
                                                        q.options || [];

                                                    return (
                                                        <div
                                                            key={q.id}
                                                            className="group relative rounded-3xl border-2 border-border bg-card p-8 shadow-sm transition-all hover:border-primary/20 hover:shadow-md"
                                                        >
                                                            {q.type ===
                                                            'comparison' ? (
                                                                <div className="flex flex-col items-center">
                                                                    <div className="mb-8 flex flex-col items-center gap-4 text-foreground md:flex-row md:gap-12">
                                                                        <span className="rounded-2xl bg-muted/50 px-4 py-3 text-2xl font-black tracking-normal md:px-6 md:py-4 md:text-4xl md:tracking-[0.2em]">
                                                                            {
                                                                                text
                                                                            }
                                                                        </span>
                                                                        <div className="hidden flex-col items-center gap-1 opacity-20 md:flex">
                                                                            <div className="h-1 w-8 rounded-full bg-foreground" />
                                                                            <div className="h-1 w-8 rounded-full bg-foreground" />
                                                                        </div>
                                                                        <span className="rounded-2xl bg-muted/50 px-4 py-3 text-2xl font-black tracking-normal md:px-6 md:py-4 md:text-4xl md:tracking-[0.2em]">
                                                                            {
                                                                                text2
                                                                            }
                                                                        </span>
                                                                    </div>

                                                                    <div className="grid w-full max-w-md grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
                                                                        {options.map(
                                                                            (
                                                                                option: any,
                                                                            ) => {
                                                                                const isSelected =
                                                                                    data
                                                                                        .answers[
                                                                                        q
                                                                                            .id
                                                                                    ] ===
                                                                                    option.id;
                                                                                return (
                                                                                    <button
                                                                                        key={
                                                                                            option.id
                                                                                        }
                                                                                        type="button"
                                                                                        onClick={() =>
                                                                                            handleAnswerChange(
                                                                                                q.id,
                                                                                                option.id,
                                                                                            )
                                                                                        }
                                                                                        className={`group relative overflow-hidden rounded-2xl border-2 py-4 text-base font-bold transition-all md:py-5 md:text-lg md:font-black ${
                                                                                            isSelected
                                                                                                ? 'scale-105 border-primary bg-primary text-white shadow-xl shadow-primary/20'
                                                                                                : 'border-input bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                                                                                        } `}
                                                                                    >
                                                                                        {option.text ||
                                                                                            option.label}
                                                                                    </button>
                                                                                );
                                                                            },
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            ) : q.type ===
                                                              'disc' ? (
                                                                <div className="overflow-hidden rounded-2xl border-2 border-border">
                                                                    <table className="w-full">
                                                                        <thead>
                                                                            <tr className="border-b-2 border-border bg-muted/50">
                                                                                <th className="w-24 px-4 py-4 text-center text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                                                                                    Most
                                                                                    (M)
                                                                                </th>
                                                                                <th className="w-24 px-4 py-4 text-center text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                                                                                    Least
                                                                                    (L)
                                                                                </th>
                                                                                <th className="px-6 py-4 text-left text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                                                                                    Statement
                                                                                </th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody className="divide-y divide-border">
                                                                            {options.map(
                                                                                (
                                                                                    option: any,
                                                                                ) => (
                                                                                    <tr
                                                                                        key={
                                                                                            option.id
                                                                                        }
                                                                                        className="group transition hover:bg-muted/30"
                                                                                    >
                                                                                        <td className="py-4 text-center">
                                                                                            <button
                                                                                                type="button"
                                                                                                onClick={() =>
                                                                                                    handleDiscChoice(
                                                                                                        q.id,
                                                                                                        option.id,
                                                                                                        'most',
                                                                                                    )
                                                                                                }
                                                                                                className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border-2 font-black transition-all ${
                                                                                                    data
                                                                                                        .answers[
                                                                                                        q
                                                                                                            .id
                                                                                                    ]
                                                                                                        ?.most ===
                                                                                                    option.id
                                                                                                        ? 'scale-110 border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                                                                                                        : 'border-input bg-background text-muted-foreground hover:border-blue-400 hover:text-blue-400'
                                                                                                }`}
                                                                                            >
                                                                                                M
                                                                                            </button>
                                                                                        </td>
                                                                                        <td className="py-4 text-center">
                                                                                            <button
                                                                                                type="button"
                                                                                                onClick={() =>
                                                                                                    handleDiscChoice(
                                                                                                        q.id,
                                                                                                        option.id,
                                                                                                        'least',
                                                                                                    )
                                                                                                }
                                                                                                className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border-2 font-black transition-all ${
                                                                                                    data
                                                                                                        .answers[
                                                                                                        q
                                                                                                            .id
                                                                                                    ]
                                                                                                        ?.least ===
                                                                                                    option.id
                                                                                                        ? 'scale-110 border-red-600 bg-red-600 text-white shadow-lg shadow-red-500/20'
                                                                                                        : 'border-input bg-background text-muted-foreground hover:border-red-400 hover:text-red-400'
                                                                                                }`}
                                                                                            >
                                                                                                L
                                                                                            </button>
                                                                                        </td>
                                                                                        <td className="px-6 py-4 text-lg font-bold text-foreground">
                                                                                            {
                                                                                                option.text
                                                                                            }
                                                                                        </td>
                                                                                    </tr>
                                                                                ),
                                                                            )}
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            ) : (
                                                                <div className="space-y-6">
                                                                    {text && (
                                                                        <div className="flex items-start gap-4">
                                                                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-black text-primary">
                                                                                {idx +
                                                                                    1}
                                                                            </div>
                                                                            <h3 className="text-xl leading-snug font-bold text-foreground">
                                                                                {
                                                                                    text
                                                                                }
                                                                            </h3>
                                                                        </div>
                                                                    )}
                                                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                                        {options.map(
                                                                            (
                                                                                option: any,
                                                                            ) => (
                                                                                <button
                                                                                    key={
                                                                                        option.id
                                                                                    }
                                                                                    type="button"
                                                                                    onClick={() =>
                                                                                        q.type ===
                                                                                        'checkbox'
                                                                                            ? handleCheckboxChoice(
                                                                                                  q.id,
                                                                                                  option.id,
                                                                                              )
                                                                                            : handleAnswerChange(
                                                                                                  q.id,
                                                                                                  option.id,
                                                                                              )
                                                                                    }
                                                                                    className={`group relative flex items-center gap-4 rounded-2xl border-2 p-5 transition-all duration-200 ${
                                                                                        (
                                                                                            q.type ===
                                                                                            'checkbox'
                                                                                                ? (
                                                                                                      data
                                                                                                          .answers[
                                                                                                          q
                                                                                                              .id
                                                                                                      ] as string[]
                                                                                                  )?.includes(
                                                                                                      option.id,
                                                                                                  )
                                                                                                : data
                                                                                                      .answers[
                                                                                                      q
                                                                                                          .id
                                                                                                  ] ===
                                                                                                  option.id
                                                                                        )
                                                                                            ? 'border-primary bg-primary/[0.03] shadow-inner'
                                                                                            : 'border-input bg-background/50 hover:border-accent hover:bg-accent/50'
                                                                                    }`}
                                                                                >
                                                                                    <div
                                                                                        className={`flex h-6 w-6 shrink-0 items-center justify-center border-2 transition-all duration-200 ${
                                                                                            q.type ===
                                                                                                'standard' ||
                                                                                            q.type ===
                                                                                                'forced'
                                                                                                ? 'rounded-full'
                                                                                                : 'rounded-lg'
                                                                                        } ${(q.type === 'checkbox' ? (data.answers[q.id] as string[])?.includes(option.id) : data.answers[q.id] === option.id) ? 'scale-110 border-primary bg-primary shadow-lg shadow-primary/20' : 'border-input bg-background'}`}
                                                                                    >
                                                                                        {(q.type ===
                                                                                        'checkbox'
                                                                                            ? (
                                                                                                  data
                                                                                                      .answers[
                                                                                                      q
                                                                                                          .id
                                                                                                  ] as string[]
                                                                                              )?.includes(
                                                                                                  option.id,
                                                                                              )
                                                                                            : data
                                                                                                  .answers[
                                                                                                  q
                                                                                                      .id
                                                                                              ] ===
                                                                                              option.id) && (
                                                                                            <div
                                                                                                className={
                                                                                                    q.type ===
                                                                                                    'checkbox'
                                                                                                        ? 'text-[10px] font-black text-white'
                                                                                                        : 'h-2 w-2 rounded-full bg-white'
                                                                                                }
                                                                                            >
                                                                                                {q.type ===
                                                                                                'checkbox'
                                                                                                    ? '✓'
                                                                                                    : ''}
                                                                                            </div>
                                                                                        )}
                                                                                    </div>
                                                                                    <span
                                                                                        className={`font-bold transition-colors ${(q.type === 'checkbox' ? (data.answers[q.id] as string[])?.includes(option.id) : data.answers[q.id] === option.id) ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`}
                                                                                    >
                                                                                        {option.text ||
                                                                                            option.label}
                                                                                    </span>
                                                                                </button>
                                                                            ),
                                                                        )}
                                                                    </div>
                                                                    {q.type ===
                                                                        'checkbox' && (
                                                                        <div className="flex items-center gap-2 px-1">
                                                                            <div className="h-2 w-2 animate-pulse rounded-full bg-amber-400" />
                                                                            <p className="text-xs font-bold tracking-widest text-amber-600 uppercase">
                                                                                Select
                                                                                exactly
                                                                                2
                                                                                candidates
                                                                            </p>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                },
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t-2 border-border bg-muted/20 p-12">
                                <div className="mx-auto max-w-md space-y-4">
                                    <Button
                                        type="submit"
                                        className="h-20 w-full rounded-3xl text-2xl font-black shadow-2xl transition-all active:scale-95 disabled:grayscale"
                                        size="lg"
                                        disabled={processing || !isAllAnswered}
                                    >
                                        {processing ? (
                                            <div className="flex items-center gap-3">
                                                <div className="h-5 w-5 animate-spin rounded-full border-4 border-white border-t-transparent" />
                                                SUBMITTING...
                                            </div>
                                        ) : (
                                            'FINALIZE TEST'
                                        )}
                                    </Button>
                                    {!isAllAnswered && (
                                        <div className="flex items-center justify-center gap-3 rounded-2xl border-2 border-red-100 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-900/20">
                                            <div className="h-2 w-2 rounded-full bg-red-500" />
                                            <p className="text-sm font-black tracking-tight text-red-600 uppercase dark:text-red-400">
                                                Incomplete subtests detected
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>
                <div className="mt-8 text-center">
                    <p className="text-sm font-bold tracking-widest text-slate-400 uppercase opacity-50">
                        © 2026 Tako Assessment Module v2.4.0
                    </p>
                </div>
            </div>
        </div>
    );
}
