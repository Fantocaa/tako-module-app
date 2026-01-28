import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import QuestionForm from './form';

interface Props {
    question: any;
}

export default function EditQuestion({ question }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Psychotest Questions',
            href: '/psychotest-questions',
        },
        {
            title: 'Edit',
            href: `/psychotest-questions/${question.id}/edit`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Question" />
            <div className="flex-1 p-4 md:p-6">
                <Card className="mx-auto max-w-3xl">
                    <CardHeader>
                        <CardTitle>Edit Question</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <QuestionForm mode="edit" question={question} />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
