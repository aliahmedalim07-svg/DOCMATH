import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FileText, Loader2, PlayCircle, X, Check } from "lucide-react";
import { PdfModal } from "../../components/PdfModal";
import { ProgressRing } from "../../components/ProgressRing";
import { QuestionStatusGrid } from "../../components/QuestionStatusGrid";
import { VideoModal } from "../../components/VideoModal";
import { getBooks, getAssignments, getTriesByAssignment, getTryDetail } from "../../lib/api-service";
import { cn, formatDateTime, to800 } from "../../lib/utils";
import { useCourse } from "../../contexts/CourseContext";
import { useI18n } from "../../contexts/I18nContext";
import type { Book, Assignment, TrySummary, TryDetail } from "../../lib/types";

interface AssignmentTries {
  assignmentId: string;
  tries: TrySummary[];
}

export default function StudentAssignments() {
  const { t } = useI18n();
  const { selectedCourse, loading: courseLoading, isCourseEnded } = useCourse();
  const courseId = selectedCourse?.id;
  const [searchParams] = useSearchParams();
  const initialBookId = searchParams.get("bookId") || "all";

  const [books, setBooks] = useState<Book[]>([]);
  const [assignmentsList, setAssignmentsList] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookFilter, setBookFilter] = useState(initialBookId);
  const [yearFilter, setYearFilter] = useState("all");
  const [videoAssignmentId, setVideoAssignmentId] = useState<string | null>(null);
  const [pdfId, setPdfId] = useState<string | null>(null);
  const [assignmentTries, setAssignmentTries] = useState<AssignmentTries[]>([]);
  const [loadingTries, setLoadingTries] = useState(true);

  const [selectedTryDetail, setSelectedTryDetail] = useState<TryDetail | null>(null);
  const [tryDetailLoading, setTryDetailLoading] = useState(false);
  const [tryCorrectOnly, setTryCorrectOnly] = useState(false);
  const [selectedResultIndex, setSelectedResultIndex] = useState(0);

  useEffect(() => {
    if (!courseId || isCourseEnded) {
      setAssignmentsList([]);
      setBooks([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    Promise.all([getBooks(), getAssignments(courseId)])
      .then(([b, a]) => {
        setBooks(b);
        setAssignmentsList(a);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [courseId, isCourseEnded]);

  useEffect(() => {
    const fetchTries = async () => {
      setLoadingTries(true);
      try {
        const assignments = await getAssignments(courseId);
        const triesPromises = assignments.map(async (a) => {
          try {
            const tries = await getTriesByAssignment(a.id);
            return { assignmentId: a.id, tries };
          } catch {
            return { assignmentId: a.id, tries: [] as TrySummary[] };
          }
        });
        const results = await Promise.all(triesPromises);
        setAssignmentTries(results);
      } catch (err) {
        console.error("Failed to fetch tries:", err);
      } finally {
        setLoadingTries(false);
      }
    };
    if (!loading && courseId && !isCourseEnded) {
      fetchTries();
    }
  }, [loading, courseId, isCourseEnded]);

  const getBookById = (id: string) => books.find((b) => b.id === id);

  const getTriesForAssignment = (assignmentId: string): TrySummary[] => {
    const found = assignmentTries.find(at => at.assignmentId === assignmentId);
    return found?.tries || [];
  };

  const filtered = assignmentsList.filter((assignment) => {
    const book = getBookById(assignment.bookId!);
    const matchesBook = bookFilter === "all" || assignment.bookId === bookFilter;
    const matchesYear = yearFilter === "all" || String(book?.year) === yearFilter;
    return matchesBook && matchesYear;
  });

  const selectedVideoAssignment = assignmentsList.find(a => a.id === videoAssignmentId);
  const selectedVideos = selectedVideoAssignment?.videos || [];
  const selectedPdf = assignmentsList.flatMap(a => a.pdfs || []).find(p => p.id === pdfId);

  const handleViewTryDetail = async (tryId: number) => {
    setTryDetailLoading(true);
    setSelectedTryDetail(null);
    try {
      const detail = await getTryDetail(tryId);
      setSelectedTryDetail(detail);
      setSelectedResultIndex(0);
    } catch (err) {
      console.error("Failed to fetch try detail:", err);
    } finally {
      setTryDetailLoading(false);
    }
  };

  if (courseLoading) return <div className="flex items-center justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-ziad-primary" /></div>;
  if (!courseId) return <div className="flex items-center justify-center py-12 font-semibold text-ziad-ink/75">{t("noCourseSelected")}</div>;
  if (isCourseEnded) return <div className="flex items-center justify-center py-12 font-semibold text-ziad-ink/75">{t("courseMaterialsUnavailable")}</div>;

  const columns = [
    { label: t("nameColumn").toUpperCase(), className: "w-[26%] text-start" },
    { label: t("modelAnswersColumn").toUpperCase(), className: "w-[22%] text-center" },
    { label: t("degreeColumn").toUpperCase(), className: "w-[12%] text-center" },
    { label: t("examColumn").toUpperCase(), className: "w-[18%] text-center" },
    { label: t("videosColumn").toUpperCase(), className: "w-[11%] text-center" },
    { label: t("pdfColumn").toUpperCase(), className: "w-[11%] text-center" },
  ];

  return (
    <div className="space-y-5">
      <section className="rounded-card border border-ziad-line bg-ziad-panel p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase text-ziad-primary">{t("assignments")}</p>
            <h1 className="text-3xl font-extrabold text-ziad-ink">{t("practiceAndResources")}</h1>
            <p className="mt-2 text-sm text-ziad-ink/72">{t("practiceAllQuestionsDesc")}</p>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <select
              value={bookFilter}
              onChange={(event) => setBookFilter(event.target.value)}
              className="h-10 rounded-button border border-ziad-line bg-white px-3 text-sm font-bold text-ziad-ink"
            >
              <option value="all">{t("allBooks")}</option>
              {books.map((book) => (
                <option key={book.id} value={book.id}>{book.title}</option>
              ))}
            </select>
            <select
              value={yearFilter}
              onChange={(event) => setYearFilter(event.target.value)}
              className="h-10 rounded-button border border-ziad-line bg-white px-3 text-sm font-bold text-ziad-ink"
            >
              <option value="all">{t("allYears")}</option>
              <option value="2023">2023</option>
              <option value="2024">2024</option>
            </select>
          </div>
        </div>
      </section>

      <div className="table-scroll overflow-x-auto rounded-card border border-ziad-line bg-ziad-panel shadow-sm">
        <table className="min-w-[900px] w-full border-collapse text-sm">
          <thead className="bg-ziad-light text-xs uppercase text-ziad-ink/68">
            <tr>
              {columns.map((column) => (
                <th key={column.label} className={cn("px-4 py-3 font-extrabold", column.className)}>{column.label}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-ziad-line">
            {filtered.map((assignment) => {
              const assignmentPdfs = assignment.pdfs || [];
              const tries = getTriesForAssignment(assignment.id);
              const degree = assignment.totalQuestions || assignment.questionBelongings?.length || 0;

              return (
                <tr key={assignment.id} className="align-middle hover:bg-ziad-light/35">
                  <td className="px-4 py-4">
                    <p className="font-extrabold text-ziad-ink">{assignment.title}</p>
                  </td>
                  <td className="px-4 py-4 text-center">
                    {loadingTries ? (
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
                      <span className="text-xl font-extrabold text-ziad-ink">{degree}</span>
                        <span className="text-xs font-semibold text-ziad-ink/72">{t("questionsCount")}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <Link
                      to={`/student/assignments/${assignment.id}/practice?mode=all`}
                      className="inline-flex items-center gap-2 rounded-button bg-practice-blue px-4 py-2.5 text-xs font-extrabold text-white hover:bg-blue-700"
                    >
                        {t("practiceAllQuestionsLink")}
                    </Link>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <button
                      type="button"
                      onClick={() => setVideoAssignmentId(assignment.id)}
                      disabled={!assignment.videos?.length}
                      className="inline-flex items-center gap-2 rounded-button bg-ziad-primary px-3 py-2 text-xs font-extrabold text-ziad-light hover:bg-ziad-ink disabled:opacity-45"
                    >
                      <PlayCircle className="h-4 w-4" />
                        {t("videosSection")}
                      </button>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <button
                        type="button"
                        onClick={() => setPdfId(assignmentPdfs[0]?.id ?? null)}
                        disabled={!assignmentPdfs.length}
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

      <VideoModal open={Boolean(videoAssignmentId)} onClose={() => setVideoAssignmentId(null)} title={selectedVideoAssignment?.title ?? t("videosSection")} videos={selectedVideos} />
      <PdfModal open={Boolean(pdfId)} onClose={() => setPdfId(null)} resource={selectedPdf} />

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
              <QuestionStatusGrid
                answers={selectedTryDetail.answers}
                selectedIndex={selectedResultIndex}
                onSelect={setSelectedResultIndex}
                showCorrectOnly={tryCorrectOnly}
              />
              {(() => {
                const filtered = tryCorrectOnly
                  ? selectedTryDetail.answers.filter(a => a.isCorrect)
                  : selectedTryDetail.answers;
                if (filtered.length === 0) {
                  return (
                    <div className="mt-4 rounded-card border border-ziad-line bg-ziad-panel p-8 text-center">
                      <p className="text-sm font-medium text-ziad-ink/70">{t("noQuestionsMatchFilter")}</p>
                    </div>
                  );
                }
                const answer = filtered[selectedResultIndex];
                if (!answer) return null;
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
                      <div>
                        <p className="text-sm font-semibold text-ziad-ink">{t("questionNumber").replace("{n}", String(selectedResultIndex + 1))}</p>
                        <p className="mt-1 text-sm text-ziad-ink">{answer.questionText || t("questionWithoutText")}</p>
                        {answer.questionImageUrl && (
                          <img src={answer.questionImageUrl} alt="" loading="lazy" onError={(e) => { e.currentTarget.style.display = "none"; }} className="mt-2 max-h-48 rounded-lg border border-ziad-line object-contain" />
                        )}
                      </div>
                    </div>

                    {answer.selectedChoiceText && (
                      <div className="mb-2 ml-9">
                        <p className="text-xs font-bold text-ziad-ink/75">{t("yourAnswer")}:</p>
                        <p className={cn(
                          "mt-0.5 inline-flex items-center gap-1.5 rounded-button px-3 py-1 text-sm font-semibold",
                          answer.isCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        )}>
                          {answer.selectedChoiceText}
                          {answer.selectedChoiceImageUrl && (
                            <img src={answer.selectedChoiceImageUrl} alt="" loading="lazy" onError={(e) => { e.currentTarget.style.display = "none"; }} className="max-h-10 rounded border border-ziad-line object-contain" />
                          )}
                        </p>
                      </div>
                    )}

                    {!answer.isCorrect && answer.correctChoiceText && (
                      <div className="mb-2 ml-9">
                        <p className="text-xs font-bold text-ziad-ink/75">{t("correctAnswer")}:</p>
                        <p className="mt-0.5 inline-flex items-center gap-1.5 rounded-button bg-green-100 px-3 py-1 text-sm font-semibold text-green-800">
                          <Check className="h-3 w-3" />
                          {answer.correctChoiceText}
                          {answer.correctChoiceImageUrl && (
                            <img src={answer.correctChoiceImageUrl} alt="" loading="lazy" onError={(e) => { e.currentTarget.style.display = "none"; }} className="max-h-10 rounded border border-ziad-line object-contain" />
                          )}
                        </p>
                      </div>
                    )}

                    {answer.explanation && (
                      <div className="ml-9 mt-2 rounded-button bg-blue-50 p-3">
                        <p className="text-xs font-bold uppercase text-ziad-ink/70">{t("explanationLabel")}</p>
                        <p className="mt-1 text-sm text-blue-900">{answer.explanation}</p>
                        {answer.explanationImageUrl && (
                          <img
                            src={answer.explanationImageUrl}
                            alt={t("altExplanationFigure")}
                            className="mt-3 max-h-48 rounded-lg border border-blue-200 object-contain"
                          />
                        )}
                      </div>
                    )}
                  </div>
                );
              })()}
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
