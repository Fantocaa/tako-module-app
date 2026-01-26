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

interface Props {
    link: PsychotestLink;
    timeLimit: number;
    remainingTime: number;
}

interface QuestionOption {
    id: string;
    text: string;
}

interface Question {
    id: string;
    type: 'forced' | 'standard' | 'disc' | 'checkbox' | 'comparison';
    text?: string;
    text2?: string; // For comparison type
    options: QuestionOption[];
}

interface Section {
    id: string;
    title: string;
    description: string;
    passCode?: string;
    questions: Question[];
}

const SECTIONS: Section[] = [
    {
        id: 'papi',
        title: 'Section 1: PAPI Kostick',
        description:
            'Pilih satu pernyataan yang paling menggambarkan diri Anda.',
        questions: [
            {
                id: 'papi_1',
                type: 'forced',
                options: [
                    { id: 'a', text: 'Saya suka bekerja keras.' },
                    {
                        id: 'b',
                        text: 'Saya bukan seorang yang mudah menyerah.',
                    },
                ],
            },
        ],
    },
    {
        id: 'cfit_1',
        title: 'CFIT: Subtes 1 – Series (3 menit)',
        description:
            'Isilah kotak terakhir dengan gambar yang sesuai dari enam pilihan jawaban (A-F).',
        questions: [
            {
                id: 'cfit_1_1',
                type: 'standard',
                text: 'Pola: Lingkaran Kecil, Lingkaran Sedang, Lingkaran Besar, ...',
                options: [
                    { id: 'a', text: 'A' },
                    { id: 'b', text: 'B' },
                    { id: 'c', text: 'C' },
                    { id: 'd', text: 'D' },
                    { id: 'e', text: 'E' },
                    { id: 'f', text: 'F' },
                ],
            },
        ],
    },
    {
        id: 'cfit_2',
        title: 'CFIT: Subtes 2 – Classification (4 menit)',
        description:
            'Temukan tepat DUA gambar yang memiliki karakteristik serupa.',
        questions: [
            {
                id: 'cfit_2_1',
                type: 'checkbox',
                text: 'Pilih dua gambar yang memiliki kesamaan pola:',
                options: [
                    { id: '1', text: 'Gambar 1' },
                    { id: '2', text: 'Gambar 2' },
                    { id: '3', text: 'Gambar 3' },
                    { id: '4', text: 'Gambar 4' },
                    { id: '5', text: 'Gambar 5' },
                ],
            },
        ],
    },
    {
        id: 'cfit_3',
        title: 'CFIT: Subtes 3 – Matrices (3 menit)',
        description:
            'Lengkapi bagian kosong pada sapu tangan dengan salah satu dari 5 pilihan jawaban.',
        questions: [
            {
                id: 'cfit_3_1',
                type: 'standard',
                text: 'Lengkapi pola matriks 2x2 berikut:',
                options: [
                    { id: 'a', text: 'A' },
                    { id: 'b', text: 'B' },
                    { id: 'c', text: 'C' },
                    { id: 'd', text: 'D' },
                    { id: 'e', text: 'E' },
                ],
            },
        ],
    },
    {
        id: 'cfit_4',
        title: 'CFIT: Subtes 4 – Condition (2,5 menit)',
        description:
            'Pilihlah satu jawaban yang mencerminkan kondisi / memiliki konsep yang sama dengan contoh.',
        questions: [
            {
                id: 'cfit_4_1',
                type: 'standard',
                text: 'Pilih gambar yang memenuhi kondisi titik di dalam lingkaran dan kotak:',
                options: [
                    { id: 'a', text: 'A' },
                    { id: 'b', text: 'B' },
                    { id: 'c', text: 'C' },
                    { id: 'd', text: 'D' },
                    { id: 'e', text: 'E' },
                ],
            },
        ],
    },
    {
        id: 'cfit_5',
        title: 'CFIT: Subtes 5 – Cepat Teliti (3 menit)',
        description:
            'Tentukan apakah dua urutan angka berikut Sama (S) atau Tidak Sama (TS).',
        questions: [
            {
                id: 'cfit_5_1',
                type: 'comparison',
                text: '65479',
                text2: '65478',
                options: [
                    { id: 's', text: 'S (Sama)' },
                    { id: 'ts', text: 'TS (Tidak Sama)' },
                ],
            },
        ],
    },
    {
        id: 'disc',
        title: 'Section 4: DISC Profile',
        description:
            'Pilih satu yang PALING (M) dan satu yang PALING TIDAK (L) menggambarkan Anda.',
        questions: [
            {
                id: 'disc_1',
                type: 'disc',
                options: [
                    { id: '1', text: 'Penuh keyakinan, berani' },
                    { id: '2', text: 'Suka meyakinkan, persuasif' },
                    { id: '3', text: 'Baik hati, tenang' },
                    { id: '4', text: 'Teliti, waspada' },
                ],
            },
        ],
    },
];

interface PsychotestFormData {
    answers: Record<string, any>;
}

export default function TakeTest({ link, timeLimit, remainingTime }: Props) {
    const [timeLeft, setTimeLeft] = React.useState(remainingTime);
    const { data, setData, post, processing } = useForm<PsychotestFormData>({
        answers: {},
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

    const handleAnswerChange = (questionId: string, answer: any) => {
        setData('answers', {
            ...data.answers,
            [questionId]: answer,
        });
    };

    const handleCheckboxChoice = (questionId: string, optionId: string) => {
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
        questionId: string,
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

    const isAllAnswered = SECTIONS.every((section: Section) =>
        section.questions.every((q: Question) => {
            if (q.type === 'disc') {
                return data.answers[q.id]?.most && data.answers[q.id]?.least;
            }
            if (q.type === 'checkbox') {
                return (data.answers[q.id] as string[])?.length === 2;
            }
            return data.answers[q.id];
        }),
    );

    return (
        <div className="min-h-screen bg-muted/40 p-4 text-slate-900 md:p-8">
            <Head title={`Psychotest - ${link.applicant_name}`} />
            <div className="mx-auto max-w-4xl">
                <div className="sticky top-4 z-10 mb-6 flex justify-center">
                    <div
                        className={`flex items-center gap-3 rounded-full px-8 py-3 text-xl font-black shadow-xl ring-2 transition-all ${
                            timeLeft < 60
                                ? 'animate-pulse bg-red-600 text-white ring-red-400'
                                : 'bg-white ring-primary'
                        }`}
                    >
                        <span className="text-xs font-bold tracking-[0.2em] uppercase opacity-80">
                            Time:
                        </span>
                        {formatTime(timeLeft)}
                    </div>
                </div>

                <Card className="overflow-hidden rounded-3xl border-none bg-white dark:bg-primary">
                    <CardHeader className="bg-gradient-to-br from-primary/95 to-primary p-8 text-white">
                        <div className="flex items-start justify-between">
                            <div className="space-y-2">
                                <CardTitle className="text-2xl leading-none font-bold tracking-tight text-primary-foreground">
                                    Official Assessment Tako Recruitment
                                </CardTitle>
                                <CardDescription className="text-lg text-primary-foreground/80">
                                    Applicant ID:{' '}
                                    <span className="rounded bg-white/10 px-2 py-0.5 font-mono italic">
                                        {link.uuid.split('-')[0]}
                                    </span>
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

                    <CardContent className="bg-white p-0">
                        <form onSubmit={handleSubmit}>
                            <div className="divide-y divide-slate-100">
                                {SECTIONS.map((section: Section) => (
                                    <div
                                        key={section.id}
                                        className="space-y-8 p-8 transition-colors hover:bg-slate-50/30"
                                    >
                                        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                                            <div className="space-y-1">
                                                <h2 className="text-2xl font-black tracking-tight text-slate-800">
                                                    {section.title}
                                                </h2>
                                                <p className="font-medium text-slate-500">
                                                    {section.description}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid gap-6">
                                            {section.questions.map(
                                                (q: Question, idx: number) => (
                                                    <div
                                                        key={q.id}
                                                        className="group relative rounded-3xl border-2 border-slate-100 bg-white p-8 shadow-sm transition-all hover:border-primary/20 hover:shadow-md"
                                                    >
                                                        <div className="absolute top-8 -left-3 h-8 w-1 rounded-full bg-primary opacity-0 transition-opacity group-hover:opacity-100" />

                                                        {q.type ===
                                                        'comparison' ? (
                                                            <div className="flex flex-col items-center">
                                                                <div className="mb-8 flex flex-col items-center gap-4 text-slate-800 md:flex-row md:gap-12">
                                                                    <span className="rounded-2xl bg-slate-100 px-4 py-3 text-2xl font-black tracking-normal md:px-6 md:py-4 md:text-4xl md:tracking-[0.2em]">
                                                                        {q.text}
                                                                    </span>

                                                                    {/* Divider — desktop only */}
                                                                    <div className="hidden flex-col items-center gap-1 opacity-20 md:flex">
                                                                        <div className="h-1 w-8 rounded-full bg-slate-900" />
                                                                        <div className="h-1 w-8 rounded-full bg-slate-900" />
                                                                    </div>

                                                                    <span className="rounded-2xl bg-slate-100 px-4 py-3 text-2xl font-black tracking-normal md:px-6 md:py-4 md:text-4xl md:tracking-[0.2em]">
                                                                        {
                                                                            q.text2
                                                                        }
                                                                    </span>
                                                                </div>

                                                                <div className="grid w-full max-w-md grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
                                                                    {q.options.map(
                                                                        (
                                                                            option: QuestionOption,
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
                                                                                            : 'border-slate-200 bg-white text-slate-400 hover:border-slate-300 hover:text-slate-600'
                                                                                    } `}
                                                                                >
                                                                                    {
                                                                                        option.text
                                                                                    }

                                                                                    {isSelected && (
                                                                                        <div className="absolute top-2 right-2">
                                                                                            <div className="rounded-full bg-white/20 p-1">
                                                                                                <div className="h-1.5 w-1.5 rounded-full bg-white" />
                                                                                            </div>
                                                                                        </div>
                                                                                    )}
                                                                                </button>
                                                                            );
                                                                        },
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ) : q.type ===
                                                          'disc' ? (
                                                            <div className="overflow-hidden rounded-2xl border-2 border-slate-100">
                                                                <table className="w-full">
                                                                    <thead>
                                                                        <tr className="border-b-2 border-slate-100 bg-slate-50/50">
                                                                            <th className="w-24 px-4 py-4 text-center text-[10px] font-black tracking-widest text-slate-400 uppercase">
                                                                                Most
                                                                                (M)
                                                                            </th>
                                                                            <th className="w-24 px-4 py-4 text-center text-[10px] font-black tracking-widest text-slate-400 uppercase">
                                                                                Least
                                                                                (L)
                                                                            </th>
                                                                            <th className="px-6 py-4 text-left text-[10px] font-black tracking-widest text-slate-400 uppercase">
                                                                                Statement
                                                                            </th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody className="divide-y divide-slate-100">
                                                                        {q.options.map(
                                                                            (
                                                                                option: QuestionOption,
                                                                            ) => (
                                                                                <tr
                                                                                    key={
                                                                                        option.id
                                                                                    }
                                                                                    className="group transition hover:bg-slate-50/30"
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
                                                                                                    : 'border-slate-200 bg-white text-slate-300 hover:border-blue-400 hover:text-blue-400'
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
                                                                                                    : 'border-slate-200 bg-white text-slate-300 hover:border-red-400 hover:text-red-400'
                                                                                            }`}
                                                                                        >
                                                                                            L
                                                                                        </button>
                                                                                    </td>
                                                                                    <td className="px-6 py-4 text-lg font-bold text-slate-700">
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
                                                                {q.text && (
                                                                    <div className="flex items-start gap-4">
                                                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-black text-primary">
                                                                            {idx +
                                                                                1}
                                                                        </div>
                                                                        <h3 className="text-xl leading-snug font-bold text-slate-800">
                                                                            {
                                                                                q.text
                                                                            }
                                                                        </h3>
                                                                    </div>
                                                                )}
                                                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                                    {q.options.map(
                                                                        (
                                                                            option: QuestionOption,
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
                                                                                        : 'border-slate-100 bg-slate-50/10 hover:border-slate-200 hover:bg-slate-50/50'
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
                                                                                    } ${(q.type === 'checkbox' ? (data.answers[q.id] as string[])?.includes(option.id) : data.answers[q.id] === option.id) ? 'scale-110 border-primary bg-primary shadow-lg shadow-primary/20' : 'border-slate-200 bg-white'}`}
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
                                                                                    className={`font-bold transition-colors ${
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
                                                                                            ? 'text-primary'
                                                                                            : 'text-slate-500 group-hover:text-slate-700'
                                                                                    }`}
                                                                                >
                                                                                    {
                                                                                        option.text
                                                                                    }
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
                                                                            (Selected:{' '}
                                                                            {(
                                                                                data
                                                                                    .answers[
                                                                                    q
                                                                                        .id
                                                                                ] as string[]
                                                                            )
                                                                                ?.length ||
                                                                                0}
                                                                            /2)
                                                                        </p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t-2 border-slate-100 bg-slate-50 p-12">
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
                                            'FINALIZE ALL TESTS'
                                        )}
                                    </Button>
                                    {!isAllAnswered && (
                                        <div className="flex items-center justify-center gap-3 rounded-2xl border-2 border-red-100 bg-red-50 p-4">
                                            <div className="h-2 w-2 rounded-full bg-red-500" />
                                            <p className="text-sm font-black tracking-tight text-red-600 uppercase">
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
