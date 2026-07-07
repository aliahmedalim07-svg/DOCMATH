import React, { useState } from "react";
import { AlertCircle, CheckCircle2, X } from "lucide-react";
import { LatexRenderer } from "./LatexRenderer";
import { cn } from "../lib/utils";
import ImagePreviewModal from "./ImagePreviewModal";

type PreviewChoice = {
  id?: number | string;
  text: string;
  isCorrect?: boolean;
  imageUrl?: string;
};

interface QuestionLatexPreviewProps {
  title?: string;
  questionText: string;
  choices?: PreviewChoice[];
  explanation?: string;
  questionImageUrl?: string;
  explanationImageUrl?: string;
  onClose?: () => void;
  className?: string;
}

interface LatexPreviewErrorBoundaryProps {
  children: React.ReactNode;
}

interface LatexPreviewErrorBoundaryState {
  hasError: boolean;
}

export class LatexPreviewErrorBoundary extends React.Component<LatexPreviewErrorBoundaryProps, LatexPreviewErrorBoundaryState> {
  state: LatexPreviewErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): LatexPreviewErrorBoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div role="alert" className="rounded-card border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">
          <div className="flex items-start gap-2">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>Invalid LaTeX Formula. Please check the syntax.</span>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export function QuestionLatexPreview({
  title = "Question Preview",
  questionText,
  choices = [],
  explanation = "",
  questionImageUrl = "",
  explanationImageUrl = "",
  onClose,
  className,
}: QuestionLatexPreviewProps) {
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const nonEmptyChoices = choices.filter((choice) => choice.text.trim());

  return (
    <div className={cn("rounded-card border border-ziad-line bg-white p-4 shadow-sm", className)}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase text-ziad-primary">{title}</p>
          <p className="text-xs font-semibold text-ziad-ink/60">Rendered with KaTeX</p>
        </div>
        {onClose ? (
          <button type="button" onClick={onClose} className="rounded-full p-1 text-ziad-ink/60 transition hover:bg-gray-100 hover:text-ziad-ink" aria-label="Close preview">
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      <LatexPreviewErrorBoundary key={[questionText, explanation, nonEmptyChoices.map((choice) => choice.text).join("|")].join("::")}>
        <div className="space-y-4">
          <div className="rounded-card border border-ziad-line bg-ziad-light/40 p-4">
            <h3 className="text-base font-extrabold leading-7 text-ziad-ink">
              <LatexRenderer text={questionText || "No question text yet."} throwOnError />
            </h3>
            {questionImageUrl ? <img src={questionImageUrl} alt="" loading="lazy" onError={(e) => { e.currentTarget.style.display = "none"; }} className="mt-3 max-h-56 w-full rounded-card border border-ziad-line bg-white object-contain" /> : null}
          </div>

          {nonEmptyChoices.length > 0 ? (
            <div className="grid gap-2">
              {nonEmptyChoices.map((choice, index) => (
                <div key={choice.id ?? index} className={cn(
                  "flex min-h-11 items-center gap-3 rounded-card border px-3 py-2 text-sm font-semibold",
                  choice.isCorrect ? "border-emerald-200 bg-emerald-50 text-emerald-900" : "border-ziad-line bg-white text-ziad-ink/78",
                )}>
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-current text-xs font-extrabold">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="min-w-0 flex-1 space-y-1">
                    {choice.text ? <LatexRenderer text={choice.text} throwOnError /> : null}
                    {choice.imageUrl ? (
                      <button type="button" onClick={() => setPreviewImageUrl(choice.imageUrl!)} className="block">
                        <img src={choice.imageUrl} alt="" loading="lazy" onError={(e) => { e.currentTarget.style.display = "none"; }} className="max-h-16 rounded border border-ziad-line object-contain cursor-pointer hover:opacity-80 transition" />
                      </button>
                    ) : null}
                  </span>
                  {choice.isCorrect ? <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" /> : null}
                </div>
              ))}
            </div>
          ) : null}

          {explanation.trim() || explanationImageUrl ? (
            <div className="rounded-card border border-ziad-line bg-gray-50 p-3">
              <p className="mb-1 text-[10px] font-bold uppercase text-ziad-ink/60">Explanation</p>
              {explanation.trim() ? <div className="text-sm font-semibold leading-6 text-ziad-ink"><LatexRenderer text={explanation} throwOnError /></div> : null}
              {explanationImageUrl ? <img src={explanationImageUrl} alt="" loading="lazy" onError={(e) => { e.currentTarget.style.display = "none"; }} className="mt-3 max-h-56 w-full rounded-card border border-ziad-line bg-white object-contain" /> : null}
            </div>
          ) : null}
        </div>
      </LatexPreviewErrorBoundary>
      {previewImageUrl ? (
        <ImagePreviewModal src={previewImageUrl} onClose={() => setPreviewImageUrl(null)} />
      ) : null}
    </div>
  );
}
