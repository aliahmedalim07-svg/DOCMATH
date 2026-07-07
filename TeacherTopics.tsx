import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { PracticeMode } from "../../components/PracticeMode";
import { useCourse } from "../../contexts/CourseContext";
import { getWeeklyExams, getQuestionsByGroup } from "../../lib/api-service";
import type { Question, PracticeModeType, Assignment } from "../../lib/types";
import { useI18n } from "../../contexts/I18nContext";

export default function WeeklyExamPractice() {
  const { t } = useI18n();
  const { examId } = useParams();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const { selectedCourse } = useCourse();
  const mode = (searchParams.get("mode") ?? "questions") as PracticeModeType;

  const [exam, setExam] = useState<Assignment | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!examId) return;

    setLoading(true);

    const loadExamData = async () => {
      const examFromState = (location.state as { exam?: Assignment })?.exam;

      if (examFromState && examFromState.id === examId) {
        setExam(examFromState);
      } else {
        const list = await getWeeklyExams(selectedCourse?.id);
        const found = list.find(e => e.id === examId);
        if (!found) {
          setLoading(false);
          return;
        }
        setExam(found);
      }

      const qs = await getQuestionsByGroup(examId);
      setQuestions(qs);
      setLoading(false);
    };

    loadExamData().catch(() => setLoading(false));
  }, [examId, location.state]);

  if (loading) return <div className="flex items-center justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-ziad-primary" /></div>;

  if (!exam) {
    return (
      <section className="rounded-card border border-red-200 bg-red-50 p-5">
        <h1 className="text-xl font-extrabold text-red-900">{t("weeklyExamNotFound")}</h1>
        <Link to="/student/checkpoint" className="mt-3 inline-flex font-bold text-red-700">{t("backToCheckpoint")}</Link>
      </section>
    );
  }

  return (
    <PracticeMode
      id={examId!}
      title={exam.title}
      questions={questions}
      mode={mode}
      requireAllAnswersBeforeFinish
    />
  );
}
