import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Head, Link } from '@inertiajs/react';
import { CheckCircle, Lock, PlayCircle } from 'lucide-react';

interface Props {
    link: any;
    currentSession: number;
}

const SESSIONS = [
    {
        id: 1,
        title: 'Session 1',
        description: 'Papicostic Test',
        duration: 'Multiple Parts',
    },
    {
        id: 2,
        title: 'Session 2',
        description: 'CFIT Intelligence Test',
        duration: 'Timed Sections',
    },
    {
        id: 3,
        title: 'Session 3',
        description: 'DISC Profile',
        duration: 'Personality Test',
    },
];

export default function PsychotestHub({ link, currentSession }: Props) {
    return (
        <div className="min-h-screen bg-background p-4 md:p-8">
            <Head title={`Assessment Hub - ${link.applicant_name}`} />

            <div className="mx-auto max-w-3xl space-y-8">
                <div className="space-y-2 text-center">
                    <h1 className="text-3xl font-black tracking-tight text-foreground md:text-4xl">
                        Assessment Center
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Welcome,{' '}
                        <span className="font-bold text-foreground">
                            {link.applicant_name}
                        </span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Please complete the sessions in order.
                    </p>
                </div>

                <div className="grid gap-4">
                    {SESSIONS.map((session) => {
                        const isDone = currentSession >= session.id;
                        const isOpen = currentSession === session.id - 1;
                        const isFuture = currentSession < session.id - 1;

                        return (
                            <Card
                                key={session.id}
                                className={`transition-all ${
                                    isOpen
                                        ? 'scale-[1.02] border-primary shadow-lg ring-2 ring-primary/20'
                                        : isDone
                                          ? 'bg-muted/50 opacity-80'
                                          : 'bg-muted/30 opacity-60 grayscale'
                                }`}
                            >
                                <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-4">
                                    <div
                                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 ${
                                            isDone
                                                ? 'border-green-500 bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                                                : isOpen
                                                  ? 'border-primary bg-primary text-white'
                                                  : 'border-border bg-muted text-muted-foreground'
                                        }`}
                                    >
                                        {isDone ? (
                                            <CheckCircle className="h-6 w-6" />
                                        ) : isFuture ? (
                                            <Lock className="h-5 w-5" />
                                        ) : (
                                            <span className="text-lg font-black">
                                                {session.id}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <CardTitle className="text-xl font-bold">
                                            {session.title}
                                        </CardTitle>
                                        <CardDescription className="text-base">
                                            {session.description}
                                        </CardDescription>
                                    </div>
                                    {isOpen && (
                                        <Button
                                            asChild
                                            size="lg"
                                            className="rounded-full px-6 font-bold shadow-lg shadow-primary/20"
                                        >
                                            <Link
                                                href={`/p/${link.uuid}?session=${session.id}`}
                                            >
                                                Start Now{' '}
                                                <PlayCircle className="ml-2 h-5 w-5" />
                                            </Link>
                                        </Button>
                                    )}
                                    {isDone && (
                                        <Badge
                                            variant="outline"
                                            className="border-green-200 bg-green-50 text-green-600 dark:border-green-900 dark:bg-green-900/20 dark:text-green-400"
                                        >
                                            Completed
                                        </Badge>
                                    )}
                                </CardHeader>
                            </Card>
                        );
                    })}
                </div>

                {currentSession >= 3 && (
                    <Card className="border-none bg-green-600 text-white shadow-xl dark:bg-green-700">
                        <CardHeader className="text-center">
                            <CardTitle className="text-2xl font-black text-white">
                                All Assessments Completed!
                            </CardTitle>
                            <CardDescription className="text-lg text-green-100">
                                Thank you for completing the tests. HR will
                                contact you shortly.
                            </CardDescription>
                        </CardHeader>
                    </Card>
                )}
            </div>
        </div>
    );
}
