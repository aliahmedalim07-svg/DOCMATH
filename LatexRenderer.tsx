import { CheckCircle2, XCircle } from "lucide-react";
import { useState } from "react";
import { useI18n } from "../contexts/I18nContext";
import { motion } from "framer-motion";
import type { Question } from "../lib/types";
import { renderLatex } from "./LatexRenderer";
import ImagePreviewModal from "./ImagePreviewModal";

interface AnswerResultProps {
  question: Question;
  selectedAnswer?: string;
}

export function AnswerResult({ question, selectedAnswer }: AnswerResultProps) {
  const { t } = useI18n();
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  if (!selectedAnswer) return null;

  const selectedOption = question.options.find((option) => option.id === selectedAnswer);
  const correct = selectedOption?.label === question.correctAnswer;
  const correctOption = question.options.find((option) => option.label === question.correctAnswer);

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
      className={
        correct
          ? "relative overflow-hidden rounded-card border border-emerald-200 bg-emerald-50 p-4 text-emerald-900"
          : "rounded-card border border-red-200 bg-red-50 p-4 text-red-900"
      }
    >
      {correct ? (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          {Array.from({ length: 14 }).map((_, index) => (
            <motion.span
              key={index}
              className="absolute h-2 w-2 rounded-full bg-ziad-accent"
              style={{ left: `${8 + index * 7}%`, top: "45%" }}
              animate={{ y: [-4, -42, 28], opacity: [0, 1, 0] }}
              transition={{ duration: 0.9, delay: index * 0.025, ease: [0.16, 1, 0.3, 1] }}
            />
          ))}
        </div>
      ) : null}
      <div className="relative flex items-start gap-3">
        {correct ? <CheckCircle2 className="h-6 w-6 shrink-0" /> : <XCircle className="h-6 w-6 shrink-0" />}
        <div>
          <h3 className="text-base font-extrabold">{correct ? t("correctAnswerHeading") : t("tryThisIdeaAgain")}</h3>
          {!correct ? (
            <div className="mt-2 space-y-1">
              {selectedOption ? (
                <div className="text-sm font-semibold flex flex-wrap items-center gap-1">
                  <span>{t("yourAnswer")}:</span>
                  <span className="text-red-800">{renderLatex(selectedOption.content || selectedOption.label)}</span>
                  {selectedOption.imageUrl ? (
                    <button type="button" onClick={() => setPreviewImageUrl(selectedOption.imageUrl!)} className="shrink-0">
                      <img src={selectedOption.imageUrl} alt="" loading="lazy" onError={(e) => { e.currentTarget.style.display = "none"; }} className="max-h-12 rounded border border-ziad-line object-contain cursor-pointer hover:opacity-80 transition" />
                    </button>
                  ) : null}
                </div>
              ) : null}
              {correctOption ? (
                <div className="text-sm font-semibold flex flex-wrap items-center gap-1">
                  <span>{t("correctAnswer")}:</span>
                  <span className="text-emerald-800">{renderLatex(correctOption.content || correctOption.label)}</span>
                  {correctOption.imageUrl ? (
                    <button type="button" onClick={() => setPreviewImageUrl(correctOption.imageUrl!)} className="shrink-0">
                      <img src={correctOption.imageUrl} alt="" loading="lazy" onError={(e) => { e.currentTarget.style.display = "none"; }} className="max-h-12 rounded border border-ziad-line object-contain cursor-pointer hover:opacity-80 transition" />
                    </button>
                  ) : null}
                </div>
              ) : null}
            </div>
          ) : null}
          <div className="mt-2 text-sm leading-6">{renderLatex(question.explanation || "")}</div>
          
          {question.expanationImageUrl && (
            <button type="button" onClick={() => setPreviewImageUrl(question.expanationImageUrl!)} className="block mt-3">
              <img 
                src={question.expanationImageUrl} 
                alt={t("altExplanationFigure")} 
                loading="lazy"
                onError={(e) => { e.currentTarget.style.display = "none"; }}
                className="max-h-64 rounded-lg border border-ziad-line object-contain cursor-pointer hover:opacity-80 transition" 
              />
            </button>
          )}

          {question.explanationVideoUrl && (
            <div className="mt-3 overflow-hidden rounded-lg border border-ziad-line bg-black">
              {question.explanationVideoUrl.includes("youtube.com") || question.explanationVideoUrl.includes("youtu.be") ? (
                <iframe
                  className="aspect-video w-full"
                  src={question.explanationVideoUrl.replace("watch?v=", "embed/").replace("youtu.be/", "youtube.com/embed/")}
                  title={t("explanationVideoTitle")}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video controls className="w-full">
                  <source src={question.explanationVideoUrl} />
                  {t("browserNotSupportVideo")}
                </video>
              )}
            </div>
          )}
        </div>
      </div>
      {previewImageUrl ? (
        <ImagePreviewModal src={previewImageUrl} onClose={() => setPreviewImageUrl(null)} />
      ) : null}
    </motion.section>
  );
}
