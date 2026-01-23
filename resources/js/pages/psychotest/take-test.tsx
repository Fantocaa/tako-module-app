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
}

const QUESTIONS = [
    {
        id: 'q1',
        text: 'Bagaimana cara Anda menghadapi tekanan di tempat kerja?',
        options: [
            { id: 'a', text: 'Tetap tenang dan menyusun rencana' },
            { id: 'b', text: 'Mencari bantuan dari rekan kerja' },
            { id: 'c', text: 'Bekerja lebih keras tanpa henti' },
            {
                id: 'd',
                text: 'Merasa cemas tapi tetap mencoba menyelesaikannya',
            },
        ],
    },
    {
        id: 'q2',
        text: 'Apa yang Anda lakukan jika menemukan kesalahan pada pekerjaan rekan Anda?',
        options: [
            { id: 'a', text: 'Memberitahu atasan secara langsung' },
            { id: 'b', text: 'Mengajaknya berdiskusi secara privat' },
            {
                id: 'c',
                text: 'Memperbaikinya sendiri tanpa memberitahu siapa pun',
            },
            { id: 'd', text: 'Mengabaikannya jika tidak berdampak pada saya' },
        ],
    },
    {
        id: 'q3',
        text: 'Seberapa penting kerja tim bagi Anda?',
        options: [
            { id: 'a', text: 'Sangat penting, lebih baik bekerja bersama' },
            { id: 'b', text: 'Penting, tapi saya lebih suka bekerja sendiri' },
            { id: 'c', text: 'Tergantung pada jenis proyeknya' },
            { id: 'd', text: 'Hanya formalitas untuk mencapai tujuan' },
        ],
    },
];

export default function TakeTest({ link }: Props) {
    const { data, setData, post, processing } = useForm({
        answers: {} as Record<string, string>,
    });

    const handleAnswerChange = (questionId: string, answer: string) => {
        setData('answers', {
            ...data.answers,
            [questionId]: answer,
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/p/${link.uuid}/submit`);
    };

    const isAllAnswered = QUESTIONS.every((q) => data.answers[q.id]);

    return (
        <div className="min-h-screen bg-muted/40 p-4 md:p-8">
            <Head title={`Psychotest - ${link.applicant_name}`} />
            <div className="mx-auto max-w-2xl">
                <Card className="border-t-4 border-t-primary shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-2xl">
                            Psychological Assessment
                        </CardTitle>
                        <CardDescription>
                            Welcome,{' '}
                            <span className="font-semibold text-foreground">
                                {link.applicant_name}
                            </span>
                            . Please answer the questions below honestly.
                        </CardDescription>
                    </CardHeader>
                    <Separator />
                    <CardContent className="pt-6">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {QUESTIONS.map((q, index) => (
                                <div key={q.id} className="space-y-4">
                                    <h3 className="text-lg font-semibold">
                                        {index + 1}. {q.text}
                                    </h3>
                                    <div className="space-y-3">
                                        {q.options.map((option) => (
                                            <button
                                                key={option.id}
                                                type="button"
                                                onClick={() =>
                                                    handleAnswerChange(
                                                        q.id,
                                                        option.id,
                                                    )
                                                }
                                                className={`flex w-full items-center space-x-3 rounded-lg border p-4 text-left transition ${
                                                    data.answers[q.id] ===
                                                    option.id
                                                        ? 'border-primary bg-primary/5 ring-1 ring-primary'
                                                        : 'hover:bg-muted'
                                                }`}
                                            >
                                                <div
                                                    className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                                                        data.answers[q.id] ===
                                                        option.id
                                                            ? 'border-primary'
                                                            : 'border-muted-foreground'
                                                    }`}
                                                >
                                                    {data.answers[q.id] ===
                                                        option.id && (
                                                        <div className="h-2 w-2 rounded-full bg-primary" />
                                                    )}
                                                </div>
                                                <span className="flex-1 font-normal">
                                                    {option.text}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}

                            <div className="pt-4">
                                <Button
                                    type="submit"
                                    className="w-full"
                                    size="lg"
                                    disabled={processing || !isAllAnswered}
                                >
                                    {processing
                                        ? 'Submitting...'
                                        : 'Complete Assessment'}
                                </Button>
                                {!isAllAnswered && (
                                    <p className="mt-2 text-center text-xs text-muted-foreground italic">
                                        Please answer all questions to proceed.
                                    </p>
                                )}
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

// Simple Separator because I forgot to import it if it's not available or to keep it simple
function Separator() {
    return <div className="h-[1px] w-full bg-border" />;
}
