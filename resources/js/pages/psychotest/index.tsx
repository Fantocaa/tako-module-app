import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/intent-input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Copy, ExternalLink, Plus } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

interface PsychotestLink {
    id: number;
    uuid: string;
    applicant_name: string;
    applicant_email: string | null;
    expires_at: string;
    used_at: string | null;
    results: any | null;
    created_at: string;
}

interface Props {
    links: PsychotestLink[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Psychotest Management',
        href: '/psychotest-admin',
    },
];

export default function PsychotestIndex({ links }: Props) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        applicant_name: '',
        applicant_email: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/psychotest-admin', {
            onSuccess: () => {
                setIsDialogOpen(false);
                toast.success('Temporary link generated!');
                reset();
            },
        });
    };

    const copyLink = (uuid: string) => {
        const url = `${window.location.origin}/p/${uuid}`;
        navigator.clipboard.writeText(url);
        toast.success('Link copied to clipboard!');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Psychotest Management" />
            <div className="flex-1 p-4 md:p-6">
                <Card>
                    <CardHeader className="flex flex-col gap-4 pb-3 md:flex-row md:items-center md:justify-between">
                        <div>
                            <CardTitle className="text-2xl font-bold">
                                Psychotest Links
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                                Manage and test temporary links for applicants
                            </p>
                        </div>
                        <Dialog
                            open={isDialogOpen}
                            onOpenChange={setIsDialogOpen}
                        >
                            <DialogTrigger asChild>
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Generate Link
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>
                                        Generate Temporary Link
                                    </DialogTitle>
                                    <DialogDescription>
                                        Create a temporary link for an applicant
                                        to take the test.
                                    </DialogDescription>
                                </DialogHeader>
                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-4"
                                >
                                    <div className="space-y-2">
                                        <Label htmlFor="applicant_name">
                                            Applicant Name
                                        </Label>
                                        <Input
                                            id="applicant_name"
                                            value={data.applicant_name}
                                            onChange={(e) =>
                                                setData(
                                                    'applicant_name',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Enter applicant name"
                                        />
                                        {errors.applicant_name && (
                                            <p className="text-sm text-red-500">
                                                {errors.applicant_name}
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="applicant_email">
                                            Applicant Email (Optional)
                                        </Label>
                                        <Input
                                            id="applicant_email"
                                            value={data.applicant_email}
                                            onChange={(e) =>
                                                setData(
                                                    'applicant_email',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Enter applicant email"
                                        />
                                        {errors.applicant_email && (
                                            <p className="text-sm text-red-500">
                                                {errors.applicant_email}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex justify-end pt-2">
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                        >
                                            {processing
                                                ? 'Generating...'
                                                : 'Generate'}
                                        </Button>
                                    </div>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </CardHeader>

                    <Separator />

                    <CardContent className="pt-6">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="border-b bg-muted/50 text-muted-foreground uppercase">
                                    <tr>
                                        <th className="px-4 py-3">Applicant</th>
                                        <th className="px-4 py-3">Status</th>
                                        <th className="px-4 py-3">
                                            Expires At
                                        </th>
                                        <th className="px-4 py-3">Link</th>
                                        <th className="px-4 py-3 text-right">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {links.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={5}
                                                className="px-4 py-8 text-center text-muted-foreground"
                                            >
                                                No links generated yet.
                                            </td>
                                        </tr>
                                    ) : (
                                        links.map((link) => (
                                            <tr
                                                key={link.id}
                                                className="border-b transition hover:bg-muted/30"
                                            >
                                                <td className="px-4 py-3">
                                                    <div className="font-medium">
                                                        {link.applicant_name}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {link.applicant_email ||
                                                            'No email'}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    {link.used_at ? (
                                                        <span className="inline-flex rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                                                            Completed
                                                        </span>
                                                    ) : new Date(
                                                          link.expires_at,
                                                      ) < new Date() ? (
                                                        <span className="inline-flex rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700">
                                                            Expired
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                                                            Active
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-muted-foreground">
                                                    {new Date(
                                                        link.expires_at,
                                                    ).toLocaleString()}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <code className="rounded bg-muted px-1 py-0.5 text-xs">
                                                        /p/
                                                        {link.uuid.substring(
                                                            0,
                                                            8,
                                                        )}
                                                        ...
                                                    </code>
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() =>
                                                                copyLink(
                                                                    link.uuid,
                                                                )
                                                            }
                                                            title="Copy Link"
                                                        >
                                                            <Copy className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            asChild
                                                            title="Visit Link"
                                                        >
                                                            <a
                                                                href={`/p/${link.uuid}`}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                            >
                                                                <ExternalLink className="h-4 w-4" />
                                                            </a>
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
