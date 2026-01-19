import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

export default function SortableLessonItem({
    id,
    children,
}: {
    id: string;
    children: React.ReactNode;
}) {
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
        willChange: 'transform',
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`rounded-md border bg-background p-4 ${
                isDragging ? 'opacity-80 shadow-lg' : ''
            }`}
        >
            <div className="flex items-center gap-4">
                {/* HANDLE */}
                <button
                    {...attributes}
                    {...listeners}
                    className="cursor-grab text-muted-foreground hover:text-foreground"
                >
                    <GripVertical className="h-5 w-5" />
                </button>

                {/* CONTENT */}
                <div className="flex-1">{children}</div>
            </div>
        </div>
    );
}
