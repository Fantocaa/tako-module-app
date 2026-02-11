import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Download, Printer } from 'lucide-react';

interface PsychotestLink {
    id: number;
    uuid: string;
    applicant_name: string;
    applicant_email: string | null;
    expires_at: string;
    used_at: string | null;
    started_at: string | null;
    finished_at: string | null;
    duration: string | null;
    results: Record<string, any> | null;
    created_at: string;
}

interface Props {
    link: PsychotestLink;
}

export default function PsychotestReport({ link }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Psychotest Management',
            href: '/psychotest',
        },
        {
            title: `Report: ${link.applicant_name}`,
            href: `/psychotest-link/${link.uuid}/report`,
        },
    ];

    const handlePrint = () => {
        window.print();
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Report - ${link.applicant_name}`} />
            <div className="flex-1 p-4 md:p-6">
                <div className="mx-auto max-w-4xl space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-3xl font-bold tracking-tight">
                            Psychotest Report
                        </h2>
                        <div className="flex gap-2 print:hidden">
                            <Button variant="outline" onClick={handlePrint}>
                                <Printer className="mr-2 h-4 w-4" />
                                Print
                            </Button>
                            <Button asChild>
                                <a href={`/psychotest-link/${link.uuid}/pdf`}>
                                    <Download className="mr-2 h-4 w-4" />
                                    Download PDF
                                </a>
                            </Button>
                        </div>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Applicant Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Full Name
                                    </label>
                                    <p className="text-lg font-semibold">
                                        {link.applicant_name}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Email Address
                                    </label>
                                    <p className="text-lg">
                                        {link.applicant_email || '-'}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Test Duration
                                    </label>
                                    <p className="text-lg">
                                        {link.duration || '-'}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Completed At
                                    </label>
                                    <p className="text-lg">
                                        {link.finished_at
                                            ? new Date(
                                                  link.finished_at,
                                              ).toLocaleString()
                                            : '-'}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Test Results</CardTitle>
                        </CardHeader>
                        <Separator />
                        <CardContent className="pt-6">
                            {!link.results ||
                            Object.keys(link.results).length === 0 ? (
                                <p className="py-8 text-center text-muted-foreground">
                                    No answers recorded.
                                </p>
                            ) : (
                                <div className="space-y-8">
                                    {Object.entries(link.results).map(
                                        ([sessionKey, sessionData]: [
                                            string,
                                            any,
                                        ]) => {
                                            const sessionNum = parseInt(
                                                sessionKey.replace(
                                                    'session_',
                                                    '',
                                                ),
                                            );
                                            const sessionNames: Record<
                                                number,
                                                string
                                            > = {
                                                1: 'PAPICOSTIC',
                                                2: 'CFIT',
                                                3: 'DISC',
                                                4: 'Skill Test',
                                            };

                                            return (
                                                <div
                                                    key={sessionKey}
                                                    className="space-y-4"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-8 w-1 rounded-full bg-indigo-500" />
                                                        <h3 className="text-lg font-bold tracking-tight text-foreground uppercase">
                                                            {sessionNames[
                                                                sessionNum
                                                            ] ||
                                                                `Section ${sessionNum}`}
                                                        </h3>
                                                    </div>

                                                    <div className="grid grid-cols-1 gap-4">
                                                        {Object.entries(
                                                            sessionData.answers ||
                                                                {},
                                                        ).map(
                                                            ([qId, answer]: [
                                                                string,
                                                                any,
                                                            ]) => (
                                                                <div
                                                                    key={qId}
                                                                    className="group rounded-xl border border-border bg-muted/20 p-4 transition-colors hover:bg-muted/30"
                                                                >
                                                                    <div className="mb-2 flex items-center justify-between">
                                                                        <span className="text-xs font-bold text-muted-foreground uppercase">
                                                                            Question
                                                                            ID:{' '}
                                                                            {
                                                                                qId
                                                                            }
                                                                        </span>
                                                                    </div>

                                                                    {sessionNum ===
                                                                    4 ? (
                                                                        /* Skill Test Specialized Rendering */
                                                                        <div className="flex items-center justify-between gap-4">
                                                                            <div className="flex items-center gap-3">
                                                                                <div className="rounded-lg bg-blue-500/10 p-2 text-blue-500">
                                                                                    <Download className="h-5 w-5" />
                                                                                </div>
                                                                                <div>
                                                                                    <p className="text-sm font-medium">
                                                                                        {answer.original_name ||
                                                                                            'candidate_submission.file'}
                                                                                    </p>
                                                                                    <p className="text-[10px] text-muted-foreground">
                                                                                        Uploaded
                                                                                        at:{' '}
                                                                                        {
                                                                                            answer.uploaded_at
                                                                                        }
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                            <Button
                                                                                variant="outline"
                                                                                size="sm"
                                                                                asChild
                                                                                className="shrink-0 bg-background"
                                                                            >
                                                                                <a
                                                                                    href={
                                                                                        answer.full_url
                                                                                    }
                                                                                    target="_blank"
                                                                                    rel="noopener noreferrer"
                                                                                >
                                                                                    Download
                                                                                    File
                                                                                </a>
                                                                            </Button>
                                                                        </div>
                                                                    ) : (
                                                                        /* Standard Result Rendering */
                                                                        <p className="text-sm font-medium text-foreground">
                                                                            {Array.isArray(
                                                                                answer,
                                                                            )
                                                                                ? answer.join(
                                                                                      ', ',
                                                                                  )
                                                                                : typeof answer ===
                                                                                    'object'
                                                                                  ? JSON.stringify(
                                                                                        answer,
                                                                                    )
                                                                                  : String(
                                                                                        answer,
                                                                                    )}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            ),
                                                        )}
                                                    </div>
                                                    <Separator className="mt-6 opacity-50" />
                                                </div>
                                            );
                                        },
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
