import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpenCheck, Loader2 } from "lucide-react";
import { getBooks } from "../../lib/api-service";
import { useCourse } from "../../contexts/CourseContext";
import { useI18n } from "../../contexts/I18nContext";
import type { Book } from "../../lib/types";

export default function StudentBooks() {
  const { t } = useI18n();
  const { selectedCourse, loading: courseLoading } = useCourse();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (courseLoading) return;

    setLoading(true);
    getBooks()
      .then(setBooks)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [courseLoading]);

  const courseId = selectedCourse?.id;
  const filteredBooks = courseId ? books.filter((b) => b.courseId === courseId) : books;

  if (loading || courseLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-ziad-primary" />
      </div>
    );
  }

  if (!courseId) {
    return (
      <div className="flex items-center justify-center py-12 text-ziad-ink/62">
        {t("noCourseSelected")}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <section className="rounded-card border border-ziad-line bg-ziad-panel p-5 shadow-sm">
        <div>
          <p className="text-xs font-bold uppercase text-ziad-primary">{t("books")}</p>
          <h1 className="text-3xl font-extrabold text-ziad-ink">{t("books")}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-ziad-ink/65">
            {t("practiceAllQuestionsDesc")}
          </p>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filteredBooks.map((book, index) => (
          <Link
            key={book.id}
            to={`/student/assignments?bookId=${book.id}`}
            className="group overflow-hidden rounded-card border border-ziad-line bg-ziad-panel shadow-sm transition hover:-translate-y-0.5 hover:border-ziad-accent hover:shadow-lift"
          >
            <div className="relative min-h-28 overflow-hidden bg-ziad-light p-5">
              <div className="absolute inset-0 opacity-80" style={{ background: `radial-gradient(circle at ${30 + index * 16}% 25%, rgba(102,187,106,.55), transparent 32%), linear-gradient(135deg, #F1F8E9, #DDEFD7)` }} />
              <div className="relative flex h-full flex-col justify-between">
                <BookOpenCheck className="h-8 w-8 text-ziad-primary" />
                <div>
                  <p className="text-xs font-bold uppercase text-ziad-primary">{book.year}</p>
                  <h2 className="mt-1 text-xl font-extrabold text-ziad-ink">{book.title}</h2>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
