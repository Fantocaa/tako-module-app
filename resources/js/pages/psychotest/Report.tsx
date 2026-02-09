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
            href: `/psychotest/${link.uuid}/report`,
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
                                <a href={`/psychotest/${link.uuid}/pdf`}>
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
                            {link.results ? (
                                <div className="space-y-6">
                                    {Object.entries(link.results).map(
                                        ([key, value]) => (
                                            <div
                                                key={key}
                                                className="space-y-1"
                                            >
                                                <h4 className="font-semibold text-muted-foreground">
                                                    Question {key}
                                                </h4>
                                                <p className="rounded-md bg-muted p-3">
                                                    {typeof value ===
                                                        'object' &&
                                                    value !== null
                                                        ? JSON.stringify(value)
                                                        : String(value)}
                                                </p>
                                            </div>
                                        ),
                                    )}
                                </div>
                            ) : (
                                <p className="py-8 text-center text-muted-foreground">
                                    No answers recorded.
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
