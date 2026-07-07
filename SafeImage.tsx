import { useCallback, useEffect, useRef, useState } from "react";
import { AlertTriangle, ArrowLeft, ArrowRight, Check, Flag, RotateCcw, Timer, X, ChevronDown, ChevronUp } from "lucide-react";
import type { PracticeModeType, Question, TryDetail } from "../lib/types";
import { cn, formatDateTime, to800 } from "../lib/utils";
import { AnswerResult } from "./AnswerResult";
import { MascotLoader } from "./MascotLoader";
import { ProgressRing } from "./ProgressRing";
import { QuestionCard } from "./QuestionCard";
import { submitQuestionGroup, getTryDetail } from "../lib/api-service";
import { useI18n } from "../contexts/I18nContext";
import { useNavigate } from "react-router-dom";
import { QuestionStatusGrid } from "./QuestionStatusGrid";
import ImagePreviewModal from "./ImagePreviewModal";
import { FullscreenStartModal } from "./FullscreenStartModal";
import { FullscreenExitOverlay } from "./FullscreenExitOverlay";

interface PracticeModeProps {
  id: string | number;
  title: string;
  questions: Question[];
  mode: PracticeModeType;
  timedSeconds?: number;
  hideRevealButton?: boolean;
  requireAllAnswersBeforeFinish?: boolean;
  showExplanationLabel?: boolean;
  showFinishAlways?: boolean;
}

export function PracticeMode({
  id,
  title,
  questions,
  mode,
  timedSeconds,
  hideRevealButton = false,
  requireAllAnswersBeforeFinish = false,
  showExplanationLabel = false,
  showFinishAlways = false,
}: PracticeModeProps) {
  const { t } = useI18n();
  const navigate = useNavigate();
  const modeLabel: Record<PracticeModeType, string> = {
    questions: t("practiceQuestions"),
    all: t("practiceAll"),
    retake: t("retake"),
    weak: t("weakPoints"),
  };
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});
  const [finished, setFinished] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [tryDetail, setTryDetail] = useState<TryDetail | null>(null);
  const [showCorrectOnly, setShowCorrectOnly] = useState(false);
  const [expandedExplanations, setExpandedExplanations] = useState<Record<number, boolean>>({});
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [selectedResultIndex, setSelectedResultIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timedSeconds ?? null);
  const [finishWarning, setFinishWarning] = useState<string | null>(null);
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});
  const [notStarted, setNotStarted] = useState(true);
  const [fullscreenExited, setFullscreenExited] = useState(false);
  const [fullscreenExitCountdown, setFullscreenExitCountdown] = useState(5);
  const exitCountdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const autoSubmittedRef = useRef(false);
  const [blurWarning, setBlurWarning] = useState(false);
  const blurOffenseCountRef = useRef(0);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 420);
    return () => window.clearTimeout(timer);
  }, []);

  const current = questions[index];
  const answeredCount = questions.filter((question) => Boolean(answers[question.id])).length;
  const unansweredCount = Math.max(questions.length - answeredCount, 0);
  const progress = questions.length ? Math.round((answeredCount / questions.length) * 100) : 0;

  const toggleFlag = useCallback((questionId: string) => {
    setFlagged((prev) => ({ ...prev, [questionId]: !prev[questionId] }));
  }, []);

  const submitPractice = useCallback(async (options: { ignoreMissingAnswers?: boolean } = {}) => {
    if (!options.ignoreMissingAnswers && requireAllAnswersBeforeFinish && unansweredCount > 0) {
      const firstUnansweredIndex = questions.findIndex((question) => !answers[question.id]);
      if (firstUnansweredIndex >= 0) setIndex(firstUnansweredIndex);
      setFinishWarning(
        t("finishMissingAnswersDesc")
          .replace("{count}", String(unansweredCount))
          .replace("{total}", String(questions.length)),
      );
      return;
    }

    setFinishWarning(null);
    setSubmitting(true);
    try {
      const submissionAnswers = questions.map(q => {
        const selectedId = answers[q.id];
        return { questionId: Number(q.id), choiceId: Number(selectedId) };
      }).filter(a => !isNaN(a.choiceId) && a.choiceId !== 0);

      const result = await submitQuestionGroup(id, submissionAnswers);
      const detail = await getTryDetail(result.tryId);
      setTryDetail(detail);
      setFinished(true);
    } catch (error) {
      console.error("Submission failed", error);
      setFinished(true);
    } finally {
      setSubmitting(false);
    }
  }, [answers, id, questions, requireAllAnswersBeforeFinish, t, unansweredCount]);

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0 || finished || submitting) return undefined;
    const timer = window.setInterval(() => {
      setTimeLeft((current) => {
        if (current === null) return null;
        return Math.max(current - 1, 0);
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [finished, submitting, timeLeft]);

  useEffect(() => {
    if (timeLeft !== 0 || finished || submitting || autoSubmittedRef.current) return;
    autoSubmittedRef.current = true;
    void submitPractice({ ignoreMissingAnswers: true });
  }, [finished, submitting, submitPractice, timeLeft]);

  useEffect(() => {
    const handleChange = () => {
      if (!document.fullscreenElement && !finished && !submitting) {
        setFullscreenExited(true);
        setFullscreenExitCountdown(5);
        exitCountdownRef.current = setInterval(() => {
          setFullscreenExitCountdown((prev) => {
            if (prev <= 1) {
              if (exitCountdownRef.current) {
                clearInterval(exitCountdownRef.current);
                exitCountdownRef.current = null;
              }
              submitPractice({ ignoreMissingAnswers: true });
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else if (document.fullscreenElement) {
        setFullscreenExited(false);
        if (exitCountdownRef.current) {
          clearInterval(exitCountdownRef.current);
          exitCountdownRef.current = null;
        }
      }
    };

    document.addEventListener("fullscreenchange", handleChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleChange);
      if (exitCountdownRef.current) {
        clearInterval(exitCountdownRef.current);
      }
    };
  }, [finished, submitting, submitPractice]);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden || finished || submitting) return;
      if (blurOffenseCountRef.current >= 1) {
        submitPractice({ ignoreMissingAnswers: true });
      } else {
        blurOffenseCountRef.current++;
        setBlurWarning(true);
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [finished, submitting, submitPractice]);

  if (loading) {
    return (
      <div className="practice-gradient grid min-h-screen place-items-center rounded-card">
        <MascotLoader />
      </div>
    );
  }

  if (!questions.length) {
    return (
      <section className="practice-gradient grid min-h-screen place-items-center rounded-card p-6 text-center">
        <div className="max-w-md">
          <h1 className="mt-5 text-2xl font-extrabold text-ziad-ink">{t("noQuestionsHereYet")}</h1>
          <p className="mt-2 text-ziad-ink/68">{t("practiceModeAppearsWhenPublished")}</p>
        </div>
      </section>
    );
  }

  const handleFinish = async () => {
    await submitPractice();
  };

  const handleStartPractice = async () => {
    try {
      await document.documentElement.requestFullscreen();
      setNotStarted(false);
    } catch {
      setNotStarted(false);
    }
  };

  const handleCancelPractice = () => {
    navigate(-1);
  };

  const handleReturnToFullscreen = () => {
    document.documentElement.requestFullscreen().catch(() => {});
  };

  if (notStarted) {
    return (
      <FullscreenStartModal
        title={title}
        modeLabel={modeLabel[mode]}
        onStart={handleStartPractice}
        onCancel={handleCancelPractice}
      />
    );
  }

  if (submitting) {
    return (
      <div className="practice-gradient grid min-h-screen place-items-center rounded-card">
        <div className="text-center">
          <MascotLoader />
          <p className="mt-4 font-bold text-ziad-primary">{t("submittingAnswers")}</p>
        </div>
      </div>
    );
  }

  if (finished) {
    const detail = tryDetail;
    const filteredAnswers = detail
      ? detail.answers.filter(a => !showCorrectOnly || a.isCorrect)
      : [];
    return (
      <section className="practice-gradient min-h-screen rounded-card p-5 sm:p-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-5 flex flex-col gap-4 rounded-card border border-ziad-line bg-ziad-panel/92 p-4 shadow-soft sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-extrabold uppercase text-ziad-primary">{t("thinkSolveSucceed")}</p>
              <h1 className="text-xl font-extrabold text-ziad-ink">{t("practiceComplete")}</h1>
              {detail && (
                <p className="text-sm text-ziad-ink/62">
                  {formatDateTime(detail.submittedAt)} • {t("scoreCorrectTotal").replace("{correct}", detail.correctAnswers.toString()).replace("{total}", detail.totalQuestions.toString()).replace("{score}", to800(detail.scorePercentage).toString())}
                </p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setIndex(0);
                  setAnswers({});
                  setSubmitted({});
                  setFlagged({});
                  setTryDetail(null);
                  setFinished(false);
                  setTimeLeft(timedSeconds ?? null);
                  setFinishWarning(null);
                  setSelectedResultIndex(0);
                  autoSubmittedRef.current = false;
                }}
                className="inline-flex items-center justify-center gap-2 rounded-button bg-red-600 px-4 py-2.5 text-sm font-bold text-red-50 transition hover:bg-red-700"
              >
                <RotateCcw className="h-4 w-4" />
                {t("retakeButton")}
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-ziad-line bg-ziad-light text-ziad-ink transition hover:bg-red-100 hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {detail && (
            <>
              <div className="mb-6 flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => setShowCorrectOnly(prev => !prev)}
                  className="group relative rounded-full transition hover:scale-105 active:scale-95"
                  title={t("clickToFilter")}
                >
                  <ProgressRing
                    value={Math.round(detail.scorePercentage)}
                    size={88}
                    stroke={7}
                    className="cursor-pointer"
                  />
                </button>
                <span className="mt-2 text-xs font-bold uppercase tracking-wider text-ziad-ink/55">
                  {showCorrectOnly ? t("correctFilter") : t("allFilter")}
                </span>
              </div>

              <div>
                <QuestionStatusGrid
                  answers={detail.answers}
                  selectedIndex={selectedResultIndex}
                  onSelect={setSelectedResultIndex}
                  showCorrectOnly={showCorrectOnly}
                />
                {filteredAnswers.length === 0 ? (
                  <div className="mt-4 rounded-card border border-ziad-line bg-ziad-panel p-8 text-center">
                    <p className="text-sm font-medium text-ziad-ink/70">{t("noQuestionsMatchFilter")}</p>
                  </div>
                ) : (() => {
                  const answer = filteredAnswers[selectedResultIndex];
                  if (!answer) return null;
                  const expanded = expandedExplanations[answer.questionId] ?? false;
                  return (
                    <div key={answer.questionId} className={cn(
                      "mt-4 rounded-card border p-4",
                      answer.isCorrect ? "border-green-300 bg-green-50" : answer.selectedChoiceId === null ? "border-amber-300 bg-amber-50" : "border-red-300 bg-red-50"
                    )}>
                      <div className="mb-3 flex items-start gap-3">
                        <span className={cn(
                          "mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white",
                          answer.isCorrect ? "bg-green-600" : answer.selectedChoiceId === null ? "bg-amber-600" : "bg-red-600"
                        )}>
                          {answer.isCorrect ? <Check className="h-4 w-4" /> : answer.selectedChoiceId === null ? "–" : "✗"}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-ziad-ink">{t("questionNumber").replace("{n}", String(selectedResultIndex + 1))}</p>
                          <p className="mt-1 text-sm text-ziad-ink">{answer.questionText || t("questionWithoutText")}</p>
                          {answer.questionImageUrl && (
                            <button type="button" onClick={() => setPreviewImageUrl(answer.questionImageUrl!)} className="block mt-2">
                              <img src={answer.questionImageUrl} alt="" loading="lazy" onError={(e) => { e.currentTarget.style.display = "none"; }} className="max-h-48 rounded-lg border border-ziad-line object-contain cursor-pointer hover:opacity-80 transition" />
                            </button>
                          )}
                        </div>
                      </div>

                      {answer.selectedChoiceText && (
                        <div className="mb-2 ml-9">
                          <p className="text-xs font-bold text-ziad-ink/75">{t("yourAnswer")}:</p>
                          <div className={cn(
                            "mt-0.5 inline-flex items-center gap-1.5 rounded-button px-3 py-1 text-sm font-semibold",
                            answer.isCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          )}>
                            {answer.selectedChoiceText}
                            {answer.selectedChoiceImageUrl && (
                              <button type="button" onClick={() => setPreviewImageUrl(answer.selectedChoiceImageUrl!)} className="shrink-0">
                                <img src={answer.selectedChoiceImageUrl} alt="" loading="lazy" onError={(e) => { e.currentTarget.style.display = "none"; }} className="max-h-10 rounded border border-ziad-line object-contain cursor-pointer hover:opacity-80 transition" />
                              </button>
                            )}
                          </div>
                        </div>
                      )}

                      {!answer.isCorrect && answer.correctChoiceText && (
                        <div className="mb-2 ml-9">
                          <p className="text-xs font-bold text-ziad-ink/75">{t("correctAnswer")}:</p>
                          <div className="mt-0.5 inline-flex items-center gap-1.5 rounded-button bg-green-100 px-3 py-1 text-sm font-semibold text-green-800">
                            <Check className="h-3 w-3" />
                            {answer.correctChoiceText}
                            {answer.correctChoiceImageUrl && (
                              <button type="button" onClick={() => setPreviewImageUrl(answer.correctChoiceImageUrl!)} className="shrink-0">
                                <img src={answer.correctChoiceImageUrl} alt="" loading="lazy" onError={(e) => { e.currentTarget.style.display = "none"; }} className="max-h-10 rounded border border-ziad-line object-contain cursor-pointer hover:opacity-80 transition" />
                              </button>
                            )}
                          </div>
                        </div>
                      )}

                      {answer.explanation && (
                        <div className="ml-9 mt-2">
                          <button
                            type="button"
                            onClick={() => setExpandedExplanations(prev => ({ ...prev, [answer.questionId]: !expanded }))}
                            className="inline-flex items-center gap-1 rounded-button border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-100"
                          >
                            {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                            {t("explanationLabel")}
                          </button>
                          {expanded && (
                            <div className="mt-2 rounded-button bg-blue-50 p-3">
                              <p className="text-sm text-blue-900">{answer.explanation}</p>
                              {answer.explanationImageUrl && (
                                <button type="button" onClick={() => setPreviewImageUrl(answer.explanationImageUrl!)} className="block mt-3">
                                  <img
                                    src={answer.explanationImageUrl}
                                    alt={t("altExplanationFigure")}
                                    loading="lazy"
                                    onError={(e) => { e.currentTarget.style.display = "none"; }}
                                    className="max-h-48 rounded-lg border border-blue-200 object-contain cursor-pointer hover:opacity-80 transition"
                                  />
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            </>
          )}
        </div>
      </section>
    );
  }

  const currentAnswer = answers[current.id];
  const currentSubmitted = submitted[current.id];

  return (
    <>
      <section className="practice-gradient min-h-screen rounded-card p-4 sm:p-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-5 flex flex-col gap-4 rounded-card border border-ziad-line bg-ziad-panel/92 p-4 shadow-soft sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase text-ziad-primary">{t("thinkSolveSucceed")}</p>
            <h1 className="text-xl font-extrabold text-ziad-ink">{title}</h1>
            <p className="text-sm text-ziad-ink/62">{modeLabel[mode]}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {timeLeft !== null ? (
              <span className="inline-flex items-center gap-2 rounded-button border border-amber-200 bg-amber-50 px-4 py-2.5 text-lg font-extrabold text-amber-700">
                <Timer className="h-5 w-5" />
                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
              </span>
            ) : null}
            <span className="rounded-button border border-ziad-line bg-ziad-light px-3 py-2 text-sm font-bold text-ziad-primary">
              {t("questionXofY").replace("{current}", String(index + 1)).replace("{total}", String(questions.length))}
            </span>
          </div>
        </div>

        <div className="mb-5 h-2 overflow-hidden rounded-full bg-ziad-panel">
          <div className="h-full rounded-full bg-ziad-primary transition-all" style={{ width: `${progress}%` }} />
        </div>

        <QuestionCard
          question={current}
          value={currentAnswer}
          onChange={(value) => {
            setFinishWarning(null);
            setAnswers((currentAnswers) => ({ ...currentAnswers, [current.id]: value }));
          }}
          disabled={currentSubmitted}
          flagged={flagged[current.id] ?? false}
          onToggleFlag={() => toggleFlag(current.id)}
        />

        <div className="mt-4">
          {currentSubmitted ? <AnswerResult question={current} selectedAnswer={currentAnswer} /> : null}
        </div>

        {finishWarning ? (
          <div className="mt-5 rounded-card border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-800" role="alert">
            {finishWarning}
          </div>
        ) : null}

        <div className="mt-5 flex flex-wrap items-center justify-center gap-1.5 rounded-card border border-ziad-line bg-ziad-panel p-3 shadow-sm">
          {questions.map((q, i) => {
            const isCurrent = i === index;
            const isAnswered = Boolean(answers[q.id]);
            const isFlagged = flagged[q.id];
            return (
              <button
                key={q.id}
                type="button"
                onClick={() => setIndex(i)}
                className={cn(
                  "relative inline-flex h-8 w-8 items-center justify-center rounded-button text-xs font-bold transition hover:scale-110",
                  isCurrent
                    ? "bg-ziad-primary text-white shadow-sm"
                    : isAnswered
                      ? "border border-ziad-primary text-ziad-primary bg-ziad-light"
                      : "border border-ziad-line text-ziad-ink/62 hover:border-ziad-accent hover:text-ziad-ink",
                )}
              >
                {i + 1}
                {isFlagged && (
                  <Flag className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 fill-red-500 text-red-500" />
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => setIndex((currentIndex) => Math.max(0, currentIndex - 1))}
            disabled={index === 0}
            className={cn(
              "inline-flex items-center justify-center gap-2 rounded-button border border-ziad-line bg-ziad-panel px-4 py-2.5 text-sm font-bold text-ziad-ink transition hover:bg-ziad-light disabled:cursor-not-allowed disabled:opacity-45",
            )}
          >
            <ArrowLeft className="h-4 w-4" />
            {t("previousButton")}
          </button>

          <div className="flex flex-col gap-3 sm:flex-row">
            {!hideRevealButton && (
              <button
                type="button"
                onClick={() => setSubmitted((currentSubmittedMap) => ({ ...currentSubmittedMap, [current.id]: true }))}
                disabled={!currentAnswer || currentSubmitted}
                className="inline-flex items-center justify-center gap-2 rounded-button bg-ziad-primary px-4 py-2.5 text-sm font-bold text-ziad-light transition hover:bg-ziad-ink disabled:cursor-not-allowed disabled:opacity-45"
              >
                <Check className="h-4 w-4" />
                {showExplanationLabel ? t("showExplanation") : t("submitButton")}
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                if (showFinishAlways || index === questions.length - 1) handleFinish();
                else setIndex((currentIndex) => Math.min(questions.length - 1, currentIndex + 1));
              }}
              className="inline-flex items-center justify-center gap-2 rounded-button bg-practice-blue px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700"
            >
              {showFinishAlways || index === questions.length - 1 ? t("finishButton") : t("nextButton")}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      {previewImageUrl ? (
        <ImagePreviewModal src={previewImageUrl} onClose={() => setPreviewImageUrl(null)} />
      ) : null}
    </section>
      {fullscreenExited && (
        <FullscreenExitOverlay
          countdown={fullscreenExitCountdown}
          onReturnToFullscreen={handleReturnToFullscreen}
        />
      )}
      {blurWarning && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ziad-ink/80 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-sm rounded-card border border-amber-200 bg-white p-8 text-center shadow-lift">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
              <AlertTriangle className="h-8 w-8 text-amber-600" />
            </div>
            <h2 className="text-xl font-extrabold text-ziad-ink">{t("tabSwitchWarningTitle")}</h2>
            <p className="mt-2 text-sm text-ziad-ink/70">
              {t("tabSwitchWarningDesc")}
            </p>
            <button
              type="button"
              onClick={() => setBlurWarning(false)}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-button bg-practice-blue px-6 py-3 text-base font-bold text-white transition hover:bg-blue-700"
            >
              {t("tabSwitchContinue")}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
