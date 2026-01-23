import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Head, Link } from '@inertiajs/react';
import { CheckCircle2 } from 'lucide-react';

export default function PsychotestSuccess() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
            <Head title="Success - Psychotest" />
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                        <CheckCircle2 className="h-6 w-6 text-green-600" />
                    </div>
                    <CardTitle className="text-2xl text-green-600">
                        Assessment Completed
                    </CardTitle>
                    <CardDescription>
                        Thank you for completing the psychotest.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pb-8 text-center">
                    <p className="text-muted-foreground">
                        Your responses have been successfully submitted. We will
                        review your assessment and get back to you soon.
                    </p>
                    <div className="pt-2">
                        <Button asChild>
                            <Link href="/">Close Page</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
