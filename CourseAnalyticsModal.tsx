import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Loader2, Trash2 } from "lucide-react";
import ImagePreviewModal from "./ImagePreviewModal";

interface BelongingItem {
  id: number;
  question: {
    id: number;
    text?: string;
    difficulty?: string;
    yearAppeared?: number;
    questionImageUrl?: string;
    choices?: { id: number; text: string; isCorrect: boolean }[];
  };
  orderIndex?: number | null;
}

interface SortableQuestionListProps {
  belongings: BelongingItem[];
  groupId: number;
  removingQuestionId: number | null;
  onRemove: (groupId: number, questionId: number) => void;
  onReorder: (groupId: number, belongingIds: number[]) => void;
}

function SortableItem({
  qb,
  idx,
  groupId,
  removingQuestionId,
  onRemove,
  onImageClick,
}: {
  qb: BelongingItem;
  idx: number;
  groupId: number;
  removingQuestionId: number | null;
  onRemove: (groupId: number, questionId: number) => void;
  onImageClick: (url: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: qb.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-start gap-2 rounded-button border border-ziad-line bg-white p-3">
      <button
        className="mt-1 flex-shrink-0 cursor-grab rounded p-0.5 text-ziad-ink/40 hover:text-ziad-ink active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4" />
      </button>
      <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-ziad-light text-xs font-bold text-ziad-ink">{idx + 1}</span>
      <div className="min-w-0 flex-1">
        <div className="flex items-start gap-2">
          <p className="text-sm font-semibold text-ziad-ink line-clamp-2">{qb.question.text || "..."}</p>
        </div>
        <p className="mt-0.5 text-xs font-medium text-ziad-ink/70">
          {qb.question.difficulty} &bull; Year {qb.question.yearAppeared} &bull; {qb.question.choices?.length || 0} choices
        </p>
      </div>
      {qb.question.questionImageUrl && (
        <button onClick={() => onImageClick(qb.question.questionImageUrl!)} className="flex-shrink-0 p-0">
          <img src={qb.question.questionImageUrl} alt="" className="h-12 w-20 rounded-lg border border-ziad-line object-cover cursor-pointer transition hover:scale-105 hover:shadow-md" />
        </button>
      )}
      <button
        onClick={() => onRemove(groupId, qb.question.id)}
        disabled={removingQuestionId === qb.question.id}
        className="flex-shrink-0 rounded-button p-1.5 text-red-500 hover:bg-red-50 disabled:opacity-50"
      >
        {removingQuestionId === qb.question.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
      </button>
    </div>
  );
}

export default function SortableQuestionList({ belongings, groupId, removingQuestionId, onRemove, onReorder }: SortableQuestionListProps) {
  const [activeItem, setActiveItem] = useState<BelongingItem | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const sorted = [...belongings].sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));

  const handleDragStart = (event: DragStartEvent) => {
    const item = sorted.find(b => b.id === event.active.id);
    if (item) setActiveItem(item);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveItem(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = sorted.findIndex(b => b.id === active.id);
    const newIndex = sorted.findIndex(b => b.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const newOrder = [...sorted];
    const [moved] = newOrder.splice(oldIndex, 1);
    newOrder.splice(newIndex, 0, moved);

    onReorder(groupId, newOrder.map(b => b.id));
  };

  if (sorted.length === 0) return null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={sorted.map(b => b.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {sorted.map((qb, idx) => (
            <SortableItem
              key={qb.id}
              qb={qb}
              idx={idx}
              groupId={groupId}
              removingQuestionId={removingQuestionId}
              onRemove={onRemove}
              onImageClick={(url) => setPreviewImageUrl(url)}
            />
          ))}
        </div>
      </SortableContext>
      <DragOverlay>
        {activeItem && (
          <div className="flex items-start gap-2 rounded-button border border-ziad-primary/30 bg-white p-3 shadow-lg">
            <GripVertical className="mt-1 h-4 w-4 flex-shrink-0 text-ziad-primary/60" />
            <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-ziad-light text-xs font-bold text-ziad-ink">
              {sorted.findIndex(b => b.id === activeItem.id) + 1}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-ziad-ink line-clamp-2">{activeItem.question.text || "..."}</p>
            </div>
            {activeItem.question.questionImageUrl && (
              <img src={activeItem.question.questionImageUrl} alt="" className="h-10 w-16 rounded-lg border border-ziad-line object-cover" />
            )}
          </div>
        )}
      </DragOverlay>
      {previewImageUrl && (
        <ImagePreviewModal src={previewImageUrl} onClose={() => setPreviewImageUrl(null)} />
      )}
    </DndContext>
  );
}
