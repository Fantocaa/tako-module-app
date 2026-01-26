import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Link, router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import {
    Copy,
    ExternalLink,
    Eye,
    FileText,
    MoreHorizontal,
    RefreshCw,
} from 'lucide-react';
import { toast } from 'sonner';

export interface PsychotestLink {
    id: number;
    uuid: string;
    applicant_name: string;
    applicant_email: string | null;
    expires_at: string;
    started_at: string | null;
    used_at: string | null;
    duration: string | null;
    is_expired: boolean;
    results: any | null;
    created_at: string;
}

const copyLink = (uuid: string) => {
    const url = `${window.location.origin}/p/${uuid}`;
    navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard!');
};

export const columns: ColumnDef<PsychotestLink>[] = [
    {
        accessorKey: 'applicant_name',
        header: 'Applicant',
        cell: ({ row }) => {
            const link = row.original;
            return (
                <div>
                    <div className="font-medium">{link.applicant_name}</div>
                    <div className="text-xs text-muted-foreground">
                        {link.applicant_email || 'No email'}
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: 'used_at',
        header: 'Status',
        cell: ({ row }) => {
            const link = row.original;

            // 1. Completed: Submitted manually
            if (
                link.used_at &&
                link.results &&
                Object.keys(link.results).length > 0
            ) {
                return (
                    <Badge
                        variant="default"
                        className="bg-green-500 text-white"
                    >
                        Completed
                    </Badge>
                );
            }

            // 2. Timed Out: Started but session expired (locked by controller OR still in progress but past time)
            if (link.is_expired && link.started_at) {
                return (
                    <Badge
                        variant="destructive"
                        className="border-none bg-amber-500 text-white"
                    >
                        Timed Out
                    </Badge>
                );
            }

            // 3. Link Expired: Never started and 24h passed
            if (link.is_expired && !link.started_at) {
                return (
                    <Badge
                        variant="secondary"
                        className="border-none bg-gray-500 text-white"
                    >
                        Link Expired
                    </Badge>
                );
            }

            return <Badge variant="default">Active</Badge>;
        },
    },
    {
        accessorKey: 'duration',
        header: 'Duration',
        cell: ({ row }) => row.getValue('duration') || '-',
    },
    {
        accessorKey: 'expires_at',
        header: 'Expires At',
        cell: ({ row }) =>
            new Date(row.getValue('expires_at')).toLocaleString(),
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const link = row.original;

            return (
                <div className="text-right">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>

                            <DropdownMenuItem
                                onClick={() => copyLink(link.uuid)}
                            >
                                <Copy className="mr-2 h-4 w-4" />
                                Copy Link
                            </DropdownMenuItem>

                            <DropdownMenuItem asChild>
                                <a
                                    href={`/p/${link.uuid}`}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <ExternalLink className="mr-2 h-4 w-4" />
                                    Visit Link
                                </a>
                            </DropdownMenuItem>

                            {link.used_at && (
                                <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link
                                            href={`/psychotest-admin/${link.uuid}/report`}
                                        >
                                            <Eye className="mr-2 h-4 w-4" />
                                            View Report
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <a
                                            href={`/psychotest-admin/${link.uuid}/pdf`}
                                        >
                                            <FileText className="mr-2 h-4 w-4" />
                                            Download PDF
                                        </a>
                                    </DropdownMenuItem>
                                </>
                            )}

                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="text-amber-600 focus:bg-amber-50 focus:text-amber-600"
                                onClick={() => {
                                    if (
                                        confirm(
                                            'Are you sure you want to restart this test? All progress and results will be cleared.',
                                        )
                                    ) {
                                        router.post(
                                            `/psychotest-admin/${link.uuid}/restart`,
                                        );
                                    }
                                }}
                            >
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Restart Test
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            );
        },
    },
];
