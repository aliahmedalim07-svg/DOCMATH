import { useEffect, useState, useMemo } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { PracticeMode } from "../../components/PracticeMode";
import { getAssignments, getQuestionsByGroup } from "../../lib/api-service";
import type { Question, PracticeModeType, Assignment } from "../../lib/types";
import { useI18n } from "../../contexts/I18nContext";

export default function AssignmentPractice() {
  const { t } = useI18n();
  const { assignmentId } = useParams();
  const [searchParams] = useSearchParams();
  const mode = (searchParams.get("mode") ?? "questions") as PracticeModeType;
  const skillId = searchParams.get("skill");

  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [, setLoading] = useState(true);

  useEffect(() => {
    if (!assignmentId) return;
    
    setLoading(true);
    getAssignments().then(list => {
      const found = list.find(a => a.id === assignmentId);
      if (found) {
        setAssignment(found);
        return getQuestionsByGroup(assignmentId);
      }
      return [];
    }).then(qs => {
      setQuestions(qs);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [assignmentId]);

  const filteredQuestions = useMemo(() => {
    let base = [...questions];
    if (skillId) base = base.filter((question) => question.skillId === skillId);
    // Note: Student individual progress filtering is temporarily disabled 
    // until the backend studentAnswers endpoint is implemented.
    return base;
  }, [questions, skillId]);

  if (!assignment) {
    return (
      <section className="rounded-card border border-red-200 bg-red-50 p-5">
        <h1 className="text-xl font-extrabold text-red-900">{t("assignmentNotFound")}</h1>
        <Link to="/student/assignments" className="mt-3 inline-flex font-bold text-red-700">{t("backToAssignments")}</Link>
      </section>
    );
  }

  return (
    <PracticeMode
      id={assignmentId!}
      title={assignment.title}
      questions={filteredQuestions}
      mode={mode}
      timedSeconds={assignment.durationInMinutes ? assignment.durationInMinutes * 60 : undefined}
      hideRevealButton
      requireAllAnswersBeforeFinish
    />
  );
}
