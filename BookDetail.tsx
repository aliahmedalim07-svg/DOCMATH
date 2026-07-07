import { useEffect, useState } from "react";
import { ProgressRing } from "../../components/ProgressRing";
import { getBooks } from "../../lib/api-service";
// import {
//   demoUsers,
//   getBookProgress,
//   getQuestionById,
//   getSkillById,
//   homework,
//   mistakeHistory,
//   skills,
//   studentProgress,
// } from "../../data/mockData";
import { formatDateTime } from "../../lib/utils";
import type { Book } from "../../lib/types";
import { useI18n } from "../../contexts/I18nContext";

export default function ChildProgress() {
  const { t } = useI18n();
  const [child] = useState<any>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [, setBooksLoading] = useState(true);

  useEffect(() => {
    getBooks().then(setBooks).catch(() => {}).finally(() => setBooksLoading(false));
  }, []);

  if (!child) {
    return <p className="rounded-card border border-red-200 bg-red-50 p-4 font-semibold text-red-700">{t("childNotFound")}</p>;
  }

  const mistakes: any[] = [];
  const skillsList: any[] = [];
  const homeworkList: any[] = [];

  return (
    <div className="space-y-5">
      <section className="rounded-card border border-ziad-line bg-ziad-panel p-5 shadow-sm">
        <p className="text-xs font-bold uppercase text-ziad-primary">{t("childProgress")}</p>
        <h1 className="text-3xl font-extrabold text-ziad-ink">{child.name}</h1>
        <p className="mt-2 text-sm text-ziad-ink/62">{t("trackScoresWeakPoints")}</p>
      </section>

      <section className="rounded-card border border-ziad-line bg-ziad-panel p-5 shadow-sm">
        <p className="text-xs font-bold uppercase text-ziad-primary">{t("booksOverview")}</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {books.map((book) => (
            <div key={book.id} className="rounded-card border border-ziad-line bg-ziad-light/45 p-4">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-extrabold text-ziad-ink">{book.title}</h2>
                <ProgressRing value={0} size={62} stroke={7} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-card border border-ziad-line bg-ziad-panel p-5 shadow-sm">
          <p className="text-xs font-bold uppercase text-ziad-primary">{t("skillsBreakdown")}</p>
          <div className="mt-4 space-y-3">
            {skillsList.map((skill) => (
              <div key={skill.id}>
                 {/* ... */}
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-card border border-ziad-line bg-ziad-panel p-5 shadow-sm">
          <p className="text-xs font-bold uppercase text-ziad-primary">{t("recentMistakesLabel")}</p>
          <div className="mt-4 space-y-3">
            {mistakes.map((item: any) => (
                <div key={item.id} className="rounded-card border border-red-200 bg-red-50 p-3">
                   {/* ... */}
                </div>
            ))}
          </div>
        </section>
      </div>

      <section className="rounded-card border border-ziad-line bg-ziad-panel p-5 shadow-sm">
        <p className="text-xs font-bold uppercase text-ziad-primary">{t("upcomingHomework")}</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {homeworkList.map((task: any) => (
            <div key={task.id} className="rounded-card border border-ziad-line bg-ziad-light/45 p-4">
              <p className="font-extrabold text-ziad-ink">{task.title}</p>
              <p className="mt-1 text-sm text-ziad-ink/62">{t("dueDateLabel").replace("{date}", formatDateTime(task.dueDate))}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

