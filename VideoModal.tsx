import { cn } from "../lib/utils";
import type { QuestionAnswer } from "../lib/types";

interface QuestionStatusGridProps {
  answers: QuestionAnswer[];
  selectedIndex: number | null;
  onSelect: (index: number) => void;
  showCorrectOnly?: boolean;
}

export function QuestionStatusGrid({ answers, selectedIndex, onSelect, showCorrectOnly }: QuestionStatusGridProps) {
  const filtered = showCorrectOnly ? answers.filter(a => a.isCorrect) : answers;

  return (
    <div className="flex flex-wrap gap-1.5">
      {filtered.map((answer, i) => {
        const isSelected = selectedIndex === i;
        const isCorrect = answer.isCorrect;
        const isSkipped = !isCorrect && answer.selectedChoiceId === null;
        const isWrong = !isCorrect && answer.selectedChoiceId !== null;
        return (
          <button
            key={answer.questionId}
            type="button"
            onClick={() => onSelect(i)}
            className={cn(
              "inline-flex h-8 w-8 items-center justify-center rounded-button text-xs font-bold transition hover:scale-110",
              isSelected && "ring-2 ring-ziad-primary ring-offset-1",
              isCorrect && "bg-green-200 text-green-800",
              isSkipped && "bg-amber-200 text-amber-800",
              isWrong && "bg-red-200 text-red-800",
            )}
          >
            {i + 1}
          </button>
        );
      })}
    </div>
  );
}
