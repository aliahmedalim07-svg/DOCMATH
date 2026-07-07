import { useMemo, useState } from "react";
import { useEffect } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { PracticeMode } from "../../components/PracticeMode";
import { getSkills, getQuestionsByGroup } from "../../lib/api-service";
import type { Question, PracticeModeType, Skill } from "../../lib/types";
import { useI18n } from "../../contexts/I18nContext";
import { cn } from "../../lib/utils";

export default function SkillPractice() {
  const { t } = useI18n();
  const { skillId } = useParams();
  const [searchParams] = useSearchParams();
  const mode = (searchParams.get("mode") ?? "questions") as PracticeModeType;

  const [skill, setSkill] = useState<Skill | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [, setLoading] = useState(true);
  const [selectedBookIds, setSelectedBookIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!skillId) return;
    
    setLoading(true);
    getSkills().then(list => {
      const found = list.find(s => s.id === skillId);
      if (found) {
        setSkill(found);
        return getQuestionsByGroup(skillId);
      }
      return [];
    }).then(qs => {
      setQuestions(qs);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [skillId]);

  const books = useMemo(() => {
    const bookMap = new Map<string, string>();
    questions.forEach(q => {
      if (q.bookId && q.bookTitle) {
        bookMap.set(q.bookId, q.bookTitle);
      }
    });
    return Array.from(bookMap.entries()).map(([id, title]) => ({ id, title }));
  }, [questions]);

  const filteredQuestions = useMemo(() => {
    if (selectedBookIds.size === 0) return questions;
    return questions.filter(q => q.bookId && selectedBookIds.has(q.bookId));
  }, [questions, selectedBookIds]);

  const toggleBook = (bookId: string) => {
    setSelectedBookIds(prev => {
      const next = new Set(prev);
      if (next.has(bookId)) next.delete(bookId);
      else next.add(bookId);
      return next;
    });
  };

  if (!skill) {
    return (
      <section className="rounded-card border border-red-200 bg-red-50 p-5">
        <h1 className="text-xl font-extrabold text-red-900">{t("skillNotFound")}</h1>
        <Link to="/student/skills" className="mt-3 inline-flex font-bold text-red-700">{t("backToSkills")}</Link>
      </section>
    );
  }

  return (
    <div className="space-y-4">
      {books.length > 0 && (
        <section className="rounded-card border border-ziad-line bg-ziad-panel p-4 shadow-sm">
          <p className="mb-3 text-xs font-bold uppercase text-ziad-ink/60">{t("filterByBook")}</p>
          <div className="flex flex-wrap gap-2">
            {books.map(book => (
              <button
                key={book.id}
                type="button"
                onClick={() => toggleBook(book.id)}
                className={cn(
                  "rounded-button border px-3 py-1.5 text-xs font-bold transition",
                  selectedBookIds.has(book.id)
                    ? "border-ziad-primary bg-ziad-primary text-white"
                    : "border-ziad-line bg-white text-ziad-ink hover:border-ziad-accent",
                )}
              >
                {book.title}
              </button>
            ))}
            {selectedBookIds.size > 0 && (
              <button
                type="button"
                onClick={() => setSelectedBookIds(new Set())}
                className="rounded-button border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-100"
              >
                {t("clearFilter")}
              </button>
            )}
          </div>
        </section>
      )}

      <PracticeMode
        id={skillId!}
        title={skill.name}
        questions={filteredQuestions}
        mode={mode}
        showExplanationLabel
        showFinishAlways
      />
    </div>
  );
}