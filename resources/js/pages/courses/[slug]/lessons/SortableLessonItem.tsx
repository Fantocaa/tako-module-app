import { cn } from '@/lib/utils';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

interface Props {
    id: string;
    children: React.ReactNode;
}

export default function SortableLessonItem({ id, children }: Props) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                'relative flex items-center gap-3 rounded-lg border bg-card p-3 shadow-sm transition-all',
                isDragging && 'z-50 opacity-50 ring-2 ring-primary',
            )}
        >
            <button
                {...attributes}
                {...listeners}
                className="cursor-grab text-muted-foreground hover:text-foreground active:cursor-grabbing"
            >
                <GripVertical className="h-5 w-5" />
            </button>
            <div className="flex-1">{children}</div>
        </div>
    );
}
