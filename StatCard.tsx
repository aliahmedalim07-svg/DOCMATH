import { BookOpen, CheckCircle2, Flag } from "lucide-react";
import { useState } from "react";
import type { Question } from "../lib/types";
import { cn } from "../lib/utils";
import { renderLatex } from "./LatexRenderer";
import ImagePreviewModal from "./ImagePreviewModal";

interface QuestionCardProps {
  question: Question;
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  flagged?: boolean;
  onToggleFlag?: () => void;
}


export function QuestionCard({ question, value, onChange, disabled, flagged, onToggleFlag }: QuestionCardProps) {
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  return (
    <section className="rounded-card border border-ziad-line bg-ziad-panel p-4 shadow-soft sm:p-6">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-ziad-line bg-ziad-light px-3 py-1 text-xs font-bold uppercase text-ziad-primary">
          {question.difficulty}
        </span>
        <span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
          {question.yearAppeared}{question.monthAppeared ? `-${question.monthAppeared}` : ''}
        </span>
        {question.bookTitle && (
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
            <BookOpen className="h-3 w-3" />
            {question.bookTitle}
          </span>
        )}
        {onToggleFlag && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onToggleFlag(); }}
            className={cn(
              "ml-auto inline-flex h-8 w-8 items-center justify-center rounded-button transition hover:bg-ziad-light",
              flagged ? "text-red-500" : "text-ziad-ink/30 hover:text-ziad-ink/55",
            )}
            aria-label={flagged ? "Remove flag" : "Flag this question"}
          >
            <Flag className={cn("h-4 w-4", flagged && "fill-red-500")} />
          </button>
        )}
      </div>

      {question.content && (
        <h2 className="text-xl font-extrabold leading-8 text-ziad-ink sm:text-2xl">
          {renderLatex(question.content)}
        </h2>
      )}

      {question.questionImageUrl ? (
        <button type="button" onClick={() => setPreviewImageUrl(question.questionImageUrl!)} className={cn("block w-full", question.content ? "mt-5" : "")}>
          <img
            src={question.questionImageUrl}
            alt=""
            loading="lazy"
            onError={(e) => { e.currentTarget.style.display = "none"; }}
            className="max-h-64 w-full rounded-card border border-ziad-line object-contain cursor-pointer hover:opacity-80 transition"
          />
        </button>
      ) : null}

      <fieldset className="mt-6 grid gap-3">
        <legend className="sr-only">Question options</legend>
        {question.options.map((option) => {
          const selected = value === option.id;
          return (
            <label
              key={option.id}
              className={cn(
                "flex min-h-14 cursor-pointer items-center gap-3 rounded-card border px-4 py-3 text-sm font-semibold transition",
                selected
                  ? "border-ziad-primary bg-ziad-light text-ziad-ink shadow-sm"
                  : "border-ziad-line bg-white/70 text-ziad-ink/78 hover:border-ziad-accent hover:bg-ziad-light/55",
                disabled && "cursor-not-allowed opacity-75",
              )}
            >
              <input
                type="radio"
                name={question.id}
                value={option.id}
                checked={selected}
                onChange={() => onChange(option.id)}
                disabled={disabled}
                className="sr-only"
              />
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-current text-xs font-extrabold uppercase">
                {option.label.split('.')[0] || option.id}
              </span>
              <span className="min-w-0 flex-1 space-y-1">
                {option.content ? <span>{renderLatex(option.content)}</span> : null}
                {option.imageUrl ? (
                  <button type="button" onClick={(e) => { e.stopPropagation(); setPreviewImageUrl(option.imageUrl!); }} className="block">
                    <img src={option.imageUrl} alt="" loading="lazy" onError={(e) => { e.currentTarget.style.display = "none"; }} className="max-h-20 rounded border border-ziad-line object-contain cursor-pointer hover:opacity-80 transition" />
                  </button>
                ) : null}
              </span>
              {selected ? <CheckCircle2 className="h-5 w-5 shrink-0 text-ziad-primary" /> : null}
            </label>
          );
        })}
      </fieldset>
      {previewImageUrl ? (
        <ImagePreviewModal src={previewImageUrl} onClose={() => setPreviewImageUrl(null)} />
      ) : null}
    </section>
  );
}
