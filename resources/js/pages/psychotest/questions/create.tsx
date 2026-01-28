import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import QuestionForm from './form';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Psychotest Questions',
        href: '/psychotest-questions',
    },
    {
        title: 'Create',
        href: '/psychotest-questions/create',
    },
];

export default function CreateQuestion() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Question" />
            <div className="flex-1 p-4 md:p-6">
                <Card className="mx-auto max-w-3xl">
                    <CardHeader>
                        <CardTitle>Create New Question</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <QuestionForm mode="create" />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
