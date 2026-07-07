import { useEffect, useState } from "react";
import { BookOpen, Calendar, Clock, FileText, Video, AlertCircle } from "lucide-react";
import { getCourses, getCourse, type AdminCourse, type BackendCourseDetail } from "../../lib/api-service";
import { formatDate } from "../../lib/utils";
import { useI18n } from "../../contexts/I18nContext";

export default function StudentCourses() {
  const { t } = useI18n();
  const [courses, setCourses] = useState<AdminCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<BackendCourseDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    getCourses().then(data => {
      setCourses(data);
      setLoading(false);
    });
  }, []);

  const handleCourseClick = async (courseId: number) => {
    setLoadingDetail(true);
    try {
      const detail = await getCourse(courseId);
      setSelectedCourse(detail);
    } finally {
      setLoadingDetail(false);
    }
  };

  const closeModal = () => setSelectedCourse(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase text-ziad-primary">{t("myCourses")}</p>
          <h1 className="text-2xl font-extrabold text-ziad-ink">Your Enrolled Courses</h1>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-ziad-primary border-t-transparent" />
        </div>
      ) : courses.length === 0 ? (
        <div className="rounded-card border border-ziad-line bg-ziad-panel p-8 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-ziad-ink/55" />
          <h3 className="mt-4 text-lg font-bold text-ziad-ink">{t("noCoursesFound")}</h3>
          <p className="mt-2 font-medium text-ziad-ink/72">You are not enrolled in any courses yet.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {courses.map(course => (
            <div
              key={course.id}
              className={`rounded-card border bg-ziad-panel p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lift ${
                course.isActive ? "border-amber-200 opacity-75" : "border-ziad-line hover:border-ziad-accent"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-card bg-ziad-light text-2xl">
                  📚
                </div>
                {!course.isActive && (
                  <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-bold text-amber-700">
                    {t("courseEnded")}
                  </span>
                )}
              </div>

              <h3 className="mt-4 text-lg font-extrabold text-ziad-ink">{course.name}</h3>

              <div className="mt-2 flex items-center gap-2 text-sm font-medium text-ziad-ink/72">
                <Calendar className="h-4 w-4" />
                <span>{t("deadline")}: {formatDate(course.examDate)}</span>
              </div>

              <button
                onClick={() => handleCourseClick(Number(course.id))}
                className="mt-4 w-full rounded-button bg-ziad-primary px-4 py-2 text-sm font-bold text-white transition hover:bg-ziad-primary/90"
              >
                {t("viewCourse")}
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-card border border-ziad-line bg-ziad-panel shadow-xl">
            <div className="flex items-center justify-between border-b border-ziad-line p-4">
              <h2 className="text-xl font-extrabold text-ziad-ink">{selectedCourse.title}</h2>
              <button
                onClick={closeModal}
                className="rounded-button p-2 hover:bg-ziad-light"
              >
                ✕
              </button>
            </div>

            <div className="p-4">
              {selectedCourse.isEnded ? (
                <div className="rounded-card border border-amber-200 bg-amber-50 p-4 text-center">
                  <AlertCircle className="mx-auto h-12 w-12 text-amber-600" />
                  <h3 className="mt-3 text-lg font-bold text-amber-800">{t("courseEnded")}</h3>
                  <p className="mt-2 text-amber-700">
                    {t("courseMaterialsUnavailable").replace("{date}", formatDate(selectedCourse.deadline))}
                  </p>
                </div>
              ) : (
                <>
                  <div className="mb-4 flex items-center gap-2 rounded-card bg-ziad-light p-3">
                    <Clock className="h-5 w-5 text-ziad-primary" />
                    <span className="text-sm font-medium text-ziad-ink">
                      {t("deadline")}: {formatDate(selectedCourse.deadline)}
                    </span>
                  </div>

                  {selectedCourse.books && selectedCourse.books.length > 0 && (
                    <div className="mb-4">
                      <h4 className="mb-2 flex items-center gap-2 text-sm font-bold uppercase text-ziad-primary">
                        <BookOpen className="h-4 w-4" /> {t("books")}
                      </h4>
                      <div className="space-y-2">
                        {selectedCourse.books.map(book => (
                          <div key={book.id} className="rounded-button border border-ziad-line bg-white p-3">
                            <span className="font-medium text-ziad-ink">{book.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedCourse.questionGroups && selectedCourse.questionGroups.length > 0 && (
                    <div className="mb-4">
                      <h4 className="mb-2 flex items-center gap-2 text-sm font-bold uppercase text-ziad-primary">
                        <FileText className="h-4 w-4" /> {t("assignments")} & {t("skills")}
                      </h4>
                      <div className="space-y-2">
                        {selectedCourse.questionGroups.map(group => (
                          <div key={group.id} className="rounded-button border border-ziad-line bg-white p-3">
                            <span className="font-medium text-ziad-ink">{group.title}</span>
                            <span className="ml-2 text-xs font-medium text-ziad-ink/72">
                              ({group.type === 0 ? "Assignment" : group.type === 1 ? "Skill" : "Exam"})
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedCourse.sessions && selectedCourse.sessions.length > 0 && (
                    <div>
                      <h4 className="mb-2 flex items-center gap-2 text-sm font-bold uppercase text-ziad-primary">
                        <Video className="h-4 w-4" /> Sessions
                      </h4>
                      <div className="space-y-2">
                        {selectedCourse.sessions.map(session => (
                          <div key={session.id} className="rounded-button border border-ziad-line bg-white p-3">
                            <span className="font-medium text-ziad-ink">{session.title || `Session ${session.id}`}</span>
                            {session.url && (
                              <a
                                href={session.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ml-2 text-sm text-ziad-primary hover:underline"
                              >
                                Join
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {loadingDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent" />
        </div>
      )}
    </div>
  );
}
