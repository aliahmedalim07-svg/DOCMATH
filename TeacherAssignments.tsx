import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, Check, X, PlayCircle, FileText } from "lucide-react";
import { ProgressRing } from "../../components/ProgressRing";
import { VideoModal } from "../../components/VideoModal";
import { PdfModal } from "../../components/PdfModal";
import { useCourse } from "../../contexts/CourseContext";
import { useI18n } from "../../contexts/I18nContext";
import { getTries, getTryDetail, getWeeklyExams } from "../../lib/api-service";
import { formatDate, formatDateTime, cn, to800 } from "../../lib/utils";
import type { TrySummary, TryDetail, Assignment } from "../../lib/types";

interface ExamTries {
  examId: string;
  tries: TrySummary[];
}

export default function Checkpoint() {
  const { t } = useI18n();
  const { selectedCourse, loading: courseLoading, isCourseEnded } = useCourse();
  const courseId = selectedCourse?.id;

  const [tries, setTries] = useState<TrySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [detail, setDetail] = useState<TryDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const [weeklyExams, setWeeklyExams] = useState<Assignment[]>([]);
  const [examTries, setExamTries] = useState<ExamTries[]>([]);
  const [loadingExams, setLoadingExams] = useState(true);
  const [examTriesLoading, setExamTriesLoading] = useState(true);

  const [videoExamId, setVideoExamId] = useState<string | null>(null);
  const [pdfId, setPdfId] = useState<string | null>(null);

  const [selectedTryDetail, setSelectedTryDetail] = useState<TryDetail | null>(null);
  const [tryDetailLoading, setTryDetailLoading] = useState(false);
  const [tryCorrectOnly, setTryCorrectOnly] = useState(false);

  useEffect(() => {
    if (courseLoading) return;

    if (!courseId || isCourseEnded) {
      setTries([]);
      setWeeklyExams([]);
      setExamTries([]);
      setLoading(false);
      setLoadingExams(false);
      setExamTriesLoading(false);
      return;
    }

    setLoading(true);
    setExamTriesLoading(true);

    Promise.all([getTries(), getWeeklyExams(courseId)])
      .then(([t, exams]) => {
        setTries(t);
        setWeeklyExams(exams);
      })
      .catch(() => {})
      .finally(() => {
        setLoading(false);
        setLoadingExams(false);
      });
  }, [courseId, courseLoading, isCourseEnded]);

  useEffect(() => {
    if (!loading) {
      const results = weeklyExams.map((exam) => ({
        examId: exam.id,
        tries: tries.filter((t) => t.questionGroupId === Number(exam.id)),
      }));
      setExamTries(results);
      setExamTriesLoading(false);
    }
  }, [loading]);

  useEffect(() => {
    if (selectedId) {
      setDetailLoading(true);
      getTryDetail(selectedId)
        .then(setDetail)
        .finally(() => setDetailLoading(false));
    }
  }, [selectedId]);

  const getTriesForExam = (examId: string): TrySummary[] => {
    const found = examTries.find(at => at.examId === examId);
    return found?.tries || [];
  };

  const handleViewTryDetail = async (tryId: number) => {
    setTryDetailLoading(true);
    setSelectedTryDetail(null);
    try {
      const detail = await getTryDetail(tryId);
      setSelectedTryDetail(detail);
    } catch (err) {
      console.error("Failed to fetch try detail:", err);
    } finally {
      setTryDetailLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-ziad-primary" /></div>;
  if (isCourseEnded) return <div className="flex items-center justify-center py-12 font-semibold text-ziad-ink/75">{t("courseMaterialsUnavailable")}</div>;

  const selectedExam = weeklyExams.find(e => e.id === videoExamId);
  const columns = [
    { label: t("nameColumn").toUpperCase(), className: "w-[26%] text-start" },
    { label: t("modelAnswersColumn").toUpperCase(), className: "w-[22%] text-center" },
    { label: t("degreeColumn").toUpperCase(), className: "w-[12%] text-center" },
    { label: t("practiceAllQuestionsLink").toUpperCase(), className: "w-[18%] text-center" },
    { label: t("videosColumn").toUpperCase(), className: "w-[11%] text-center" },
    { label: t("pdfColumn").toUpperCase(), className: "w-[11%] text-center" },
  ];

  return (
    <div className="space-y-5">
      <section className="rounded-card border border-ziad-line bg-ziad-panel p-5 shadow-sm">
        <p className="text-xs font-bold uppercase text-ziad-primary">{t("checkpoint")}</p>
        <h1 className="text-3xl font-extrabold text-ziad-ink">{t("weeklyExams")}</h1>
        <p className="mt-2 text-sm text-ziad-ink/72">{t("practiceWeeklyExams")}</p>
      </section>

      {weeklyExams.length === 0 && !loadingExams ? (
        <div className="flex flex-col items-center justify-center rounded-card border border-ziad-line bg-ziad-panel p-12 shadow-sm">
          <p className="text-lg font-extrabold text-ziad-ink">{t("noWeeklyExamsAvailable")}</p>
          <p className="mt-2 text-sm text-ziad-ink/72">{t("weeklyExamsAppearHere")}</p>
        </div>
      ) : weeklyExams.length > 0 && (
        <div className="table-scroll overflow-x-auto rounded-card border border-ziad-line bg-ziad-panel shadow-sm">
          <table className="min-w-[800px] w-full border-collapse text-sm">
            <thead className="bg-ziad-light text-xs uppercase text-ziad-ink/68">
              <tr>
                {columns.map((column) => (
                  <th key={column.label} className={cn("px-4 py-3 font-extrabold", column.className)}>{column.label}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-ziad-line">
              {weeklyExams.map((exam) => {
                const tries = getTriesForExam(exam.id);
                return (
                  <tr key={exam.id} className="align-middle hover:bg-ziad-light/35">
                    <td className="px-4 py-4">
                      <p className="font-extrabold text-ziad-ink">{exam.title}</p>
                    </td>
                    <td className="px-4 py-4 text-center">
                      {examTriesLoading ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin text-ziad-primary" />
                          <span className="text-xs font-semibold text-ziad-ink/72">{t("loadingDots")}</span>
                        </div>
                      ) : tries.length === 0 ? (
                        <div className="flex flex-col items-center gap-1 py-2">
                          <span className="text-xs font-semibold text-ziad-ink/72">{t("noTriesYet")}</span>
                          <span className="text-xs text-ziad-ink/62">{t("startPracticing")}</span>
                        </div>
                      ) : (
                        <div className="flex flex-wrap justify-center gap-1.5">
                          {tries.map((tryItem) => (
                              <button
                                key={tryItem.id}
                                type="button"
                                onClick={() => handleViewTryDetail(tryItem.id)}
                                className="inline-flex items-center gap-1.5 rounded-button px-2 py-1 text-xs font-bold transition-colors hover:ring-2 hover:ring-ziad-primary/20"
                                style={{
                                  backgroundColor: tryItem.scorePercentage >= 80 ? '#dcfce7' : tryItem.scorePercentage >= 50 ? '#fef3c7' : '#fee2e2',
                                  color: tryItem.scorePercentage >= 80 ? '#166534' : tryItem.scorePercentage >= 50 ? '#92400e' : '#991b1b',
                                }}
                                aria-label={t("viewModelAnswers").replace("{correct}", tryItem.correctAnswers.toString()).replace("{total}", tryItem.totalQuestions.toString())}
                              >
                                {tryItem.scorePercentage === 100 ? (
                                  <Check className="h-3 w-3" />
                                ) : (
                                  <span className="text-xs">✗</span>
                                )}
                                {tryItem.correctAnswers}/{tryItem.totalQuestions}
                              </button>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="flex flex-col items-center">
                        <span className="text-xl font-extrabold text-ziad-ink">{exam.totalQuestions}</span>
                        <span className="text-xs font-semibold text-ziad-ink/72">{t("questionsCount")}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <Link
                        to={`/student/weekly-exams/${exam.id}/practice?mode=all`}
                        state={{ exam }}
                        className="inline-flex items-center gap-2 rounded-button bg-practice-blue px-4 py-2.5 text-xs font-extrabold text-white hover:bg-blue-700"
                      >
                        <PlayCircle className="h-4 w-4" />
                        {t("practiceAllQuestionsLink")}
                      </Link>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <button
                        type="button"
                        onClick={() => setVideoExamId(exam.id)}
                        disabled={!exam.videos?.length}
                        className="inline-flex items-center gap-2 rounded-button bg-ziad-primary px-3 py-2 text-xs font-extrabold text-ziad-light hover:bg-ziad-ink disabled:opacity-45"
                      >
                        <PlayCircle className="h-4 w-4" />
                        {t("videosSection")}
                      </button>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <button
                        type="button"
                        onClick={() => setPdfId(exam.pdfs?.[0]?.id ?? null)}
                        disabled={!exam.pdfs?.length}
                        className="inline-flex items-center gap-2 rounded-button bg-ziad-primary px-3 py-2 text-xs font-extrabold text-ziad-light hover:bg-ziad-ink disabled:cursor-not-allowed disabled:opacity-45"
                      >
                        <FileText className="h-4 w-4" />
                        {t("pdfSection")}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {weeklyExams.length > 0 && (
        <div className="rounded-card border border-ziad-line bg-ziad-panel p-5 shadow-sm">
          <p className="text-xs font-bold uppercase text-ziad-primary">{t("examResults")}</p>
          <h2 className="text-xl font-extrabold text-ziad-ink">{t("yourAttempts")}</h2>
          <p className="mt-2 text-sm text-ziad-ink/72">{t("completedAttemptsReadOnly")}</p>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
        <div className="space-y-3">
          {tries.length === 0 ? (
            <p className="text-sm text-ziad-ink/70 italic">{t("noExamsCompletedYet")}</p>
          ) : tries.map((t) => {
            const percent = Math.round(t.scorePercentage);
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setSelectedId(t.id)}
                className={`flex w-full items-center justify-between gap-3 rounded-card border bg-ziad-panel p-4 text-start shadow-sm transition ${
                  selectedId === t.id ? "border-ziad-primary" : "border-ziad-line hover:border-ziad-accent"
                }`}
              >
                <span>
                  <span className="block text-sm font-extrabold text-ziad-ink">{t.questionGroupTitle}</span>
                  <span className="mt-1 block text-xs font-semibold text-ziad-ink/72">{formatDate(t.submittedAt)}</span>
                </span>
                <ProgressRing value={percent} size={64} stroke={7} label={`${t.correctAnswers}/${t.totalQuestions}`} />
              </button>
            );
          })}
        </div>

        <section className="rounded-card border border-ziad-line bg-ziad-panel p-5 shadow-sm min-h-[400px]">
          {detailLoading ? (
             <div className="flex h-full items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-ziad-primary" /></div>
          ) : detail ? (
            <>
              <p className="text-xs font-bold uppercase text-ziad-primary">{t("readOnlyReview")}</p>
              <h2 className="text-xl font-extrabold text-ziad-ink">{detail.questionGroupTitle}</h2>
              <div className="mt-4 space-y-3">
                {detail.answers.map((ans, index) => (
                  <div key={ans.questionId} className={`rounded-card border p-4 ${ans.isCorrect ? "border-emerald-100 bg-emerald-50/50" : "border-red-100 bg-red-50/50"}`}>
                    <div className="flex justify-between items-start gap-3">
                      <div>
                        <p className="text-xs font-bold uppercase text-ziad-primary">{t("questionNumber").replace("{n}", String(index + 1))}</p>
                        <p className="mt-2 font-semibold text-ziad-ink">{ans.questionText}</p>
                        {ans.questionImageUrl && (
                          <img src={ans.questionImageUrl} alt="" loading="lazy" onError={(e) => { e.currentTarget.style.display = "none"; }} className="mt-2 max-h-48 rounded-lg border border-ziad-line object-contain" />
                        )}
                      </div>
                      <span className={`text-xs font-extrabold uppercase ${ans.isCorrect ? "text-emerald-700" : "text-red-700"}`}>
                        {ans.isCorrect ? t("questionCorrect") : t("questionIncorrect")}
                      </span>
                    </div>
                    <div className="mt-3 grid gap-2">
                      <p className="text-sm">
                        <span className="font-bold">{t("yourAnswer")}:</span> {ans.selectedChoiceText || "None"}
                        {ans.selectedChoiceImageUrl && (
                          <img src={ans.selectedChoiceImageUrl} alt="" loading="lazy" onError={(e) => { e.currentTarget.style.display = "none"; }} className="mt-1 max-h-10 rounded border border-ziad-line object-contain" />
                        )}
                      </p>
                      {!ans.isCorrect && (
                        <p className="text-sm">
                          <span className="font-bold text-emerald-700">{t("correctAnswer")}:</span> {ans.correctChoiceText}
                          {ans.correctChoiceImageUrl && (
                            <img src={ans.correctChoiceImageUrl} alt="" loading="lazy" onError={(e) => { e.currentTarget.style.display = "none"; }} className="mt-1 max-h-10 rounded border border-ziad-line object-contain" />
                          )}
                        </p>
                      )}
                      {ans.explanation && (
                        <div className="mt-2 rounded-button bg-blue-50 p-3">
                          <p className="text-xs font-bold uppercase text-blue-600">Explanation</p>
                          <p className="mt-1 text-sm text-blue-900">{ans.explanation}</p>
                          {ans.explanationImageUrl && (
                            <img src={ans.explanationImageUrl} alt={t("altExplanationFigure")} loading="lazy" onError={(e) => { e.currentTarget.style.display = "none"; }} className="mt-3 max-h-48 rounded-lg border border-blue-200 object-contain" />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-center text-ziad-ink/75">
              <p className="font-extrabold text-ziad-ink">{t("selectAnAttempt")}</p>
              <p className="text-sm font-medium">{t("chooseExamFromList")}</p>
            </div>
          )}
        </section>
      </div>

      <VideoModal
        open={Boolean(videoExamId)}
        onClose={() => setVideoExamId(null)}
        title={selectedExam?.title ?? "Videos"}
        videos={selectedExam?.videos || []}
      />
      <PdfModal
        open={Boolean(pdfId)}
        onClose={() => setPdfId(null)}
        resource={selectedExam?.pdfs?.[0]}
      />

      {selectedTryDetail !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-card border border-ziad-line bg-ziad-panel shadow-xl">
            <div className="flex items-center justify-between border-b border-ziad-line p-4">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setTryCorrectOnly(prev => !prev)}
                  className="group relative shrink-0 rounded-full transition hover:scale-105 active:scale-95"
                >
                  <ProgressRing
                    value={Math.round(selectedTryDetail.scorePercentage)}
                    size={56}
                    stroke={5}
                    className="cursor-pointer"
                  />
                </button>
                <div>
                  <p className="text-xs font-bold uppercase text-ziad-primary">{t("tryDetail")}</p>
                  <h2 className="text-lg font-extrabold text-ziad-ink">{selectedTryDetail.questionGroupTitle}</h2>
                  <p className="text-xs text-ziad-ink/70">
                    {formatDateTime(selectedTryDetail.submittedAt)} • {t("scoreCorrectTotal").replace("{correct}", selectedTryDetail.correctAnswers.toString()).replace("{total}", selectedTryDetail.totalQuestions.toString()).replace("{score}", to800(selectedTryDetail.scorePercentage).toString())}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-ziad-ink/50">
                  {tryCorrectOnly ? t("correctFilter") : t("allFilter")}
                </span>
                <button onClick={() => setSelectedTryDetail(null)} className="rounded-button p-2 hover:bg-ziad-light">
                  <X className="h-5 w-5 text-ziad-ink" />
                </button>
              </div>
            </div>
            <div className="overflow-y-auto p-4" style={{ maxHeight: "calc(90vh - 100px)" }}>
              <div className="space-y-4">
                {selectedTryDetail.answers.filter(a => !tryCorrectOnly || a.isCorrect).length === 0 ? (
                  <div className="rounded-card border border-ziad-line bg-ziad-panel p-8 text-center">
                    <p className="text-sm font-medium text-ziad-ink/70">{t("noQuestionsMatchFilter")}</p>
                  </div>
                ) : selectedTryDetail.answers.filter(a => !tryCorrectOnly || a.isCorrect).map((answer, idx) => {
                  return (
                    <div key={answer.questionId} className={cn(
                      "rounded-card border p-4",
                      answer.isCorrect ? "border-green-300 bg-green-50" : "border-red-300 bg-red-50"
                    )}>
                      <div className="mb-3 flex items-start gap-3">
                        <span className={cn(
                          "mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white",
                          answer.isCorrect ? "bg-green-600" : "bg-red-600"
                        )}>
                          {answer.isCorrect ? <Check className="h-4 w-4" /> : "✗"}
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-ziad-ink">{t("questionNumber").replace("{n}", String(idx + 1))}</p>
                          <p className="mt-1 text-sm text-ziad-ink">{answer.questionText || t("questionWithoutText")}</p>
                          {answer.questionImageUrl && (
                            <img src={answer.questionImageUrl} alt="" loading="lazy" onError={(e) => { e.currentTarget.style.display = "none"; }} className="mt-2 max-h-48 rounded-lg border border-ziad-line object-contain" />
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
                              <img src={answer.selectedChoiceImageUrl} alt="" loading="lazy" onError={(e) => { e.currentTarget.style.display = "none"; }} className="max-h-10 rounded border border-ziad-line object-contain" />
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
                              <img src={answer.correctChoiceImageUrl} alt="" loading="lazy" onError={(e) => { e.currentTarget.style.display = "none"; }} className="max-h-10 rounded border border-ziad-line object-contain" />
                            )}
                          </div>
                        </div>
                      )}

                      {answer.explanation && (
                        <div className="ml-9 mt-2 rounded-button bg-blue-50 p-3">
                          <p className="text-xs font-bold uppercase text-blue-600">Explanation</p>
                          <p className="mt-1 text-sm text-blue-900">{answer.explanation}</p>
                          {answer.explanationImageUrl && (
                            <img src={answer.explanationImageUrl} alt={t("altExplanationFigure")} loading="lazy" onError={(e) => { e.currentTarget.style.display = "none"; }} className="mt-3 max-h-48 rounded-lg border border-blue-200 object-contain" />
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {tryDetailLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="flex items-center gap-3 rounded-card bg-ziad-panel p-4 shadow-xl">
            <Loader2 className="h-6 w-6 animate-spin text-ziad-primary" />
            <span className="text-sm font-semibold text-ziad-ink">{t("loadingTryDetails")}</span>
          </div>
        </div>
      )}
    </div>
  );
}
