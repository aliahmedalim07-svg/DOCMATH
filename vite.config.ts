import { useEffect, useState } from "react";
import { Check, Plus, Search, X, Trash2, Pencil, Loader2 } from "lucide-react";
import { useI18n } from "../../contexts/I18nContext";
import { StatusBadge } from "../../components/StatusBadge";
import { CourseAnalyticsModal } from "../../components/dashboard/CourseAnalyticsModal";
import { getCourses, createCourse, updateCourse, deleteCourse as deleteCourseApi, getBooks, getSessions, getAssignments, getSkills } from "../../lib/api-service";
import type { Book, Session } from "../../lib/types";
import type { AdminCourse } from "../../lib/api-service";
import { formatDate } from "../../lib/utils";

export default function TeacherCourses() {
  const { t } = useI18n();
  const [courses, setCourses] = useState<AdminCourse[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [books, setBooks] = useState<Book[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  /* --- create state --- */
  const [name, setName] = useState("");
  const [deadline, setDeadline] = useState("");
  const [selectedBookIds, setSelectedBookIds] = useState<number[]>([]);
  const [selectedSessionIds, setSelectedSessionIds] = useState<number[]>([]);
  const [selectedActivityIds, setSelectedActivityIds] = useState<number[]>([]);
  const [saving, setSaving] = useState(false);

  /* --- editing state --- */
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDeadline, setEditDeadline] = useState("");

  /* --- toggle UI states --- */
  const [isCreating, setIsCreating] = useState(false);

  /* --- delete confirmation --- */
  const [deleteId, setDeleteId] = useState<string | null>(null);

  /* --- analytics modal --- */
  const [analyticsCourseId, setAnalyticsCourseId] = useState<number | null>(null);
  const [analyticsCourseName, setAnalyticsCourseName] = useState("");

  const reload = () => {
    setLoading(true);
    Promise.allSettled([getCourses(), getBooks(), getSessions(), getAssignments(), getSkills()])
      .then(([coursesResult, booksResult, sessionsResult, assignmentsResult]) => {
        if (coursesResult.status === "fulfilled") setCourses(coursesResult.value);
        if (booksResult.status === "fulfilled") setBooks(booksResult.value);
        if (sessionsResult.status === "fulfilled") setSessions(sessionsResult.value);
        if (assignmentsResult.status === "fulfilled") setAssignments(assignmentsResult.value);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { reload(); }, []);

  const filteredCourses = searchQuery.trim()
    ? courses.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : courses;

  const handleCreate = async () => {
    if (!name.trim() || !deadline) return;
    setSaving(true);
    try {
      await createCourse(name, deadline, selectedBookIds, selectedSessionIds, selectedActivityIds, []);
      setName("");
      setDeadline("");
      setSelectedBookIds([]);
      setSelectedSessionIds([]);
      setSelectedActivityIds([]);
      setIsCreating(false);
      reload();
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const startEdit = (course: AdminCourse) => {
    setEditingId(course.id);
    setEditName(course.name);
    setEditDeadline(course.examDate ? course.examDate.split('T')[0] : "");
  };

  const saveEdit = async () => {
    if (!editingId || !editName.trim() || !editDeadline) return;
    setSaving(true);
    try {
      await updateCourse(editingId, editName, editDeadline);
      setEditingId(null);
      reload();
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    setSaving(true);
    try {
      await deleteCourseApi(id);
      setDeleteId(null);
      reload();
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="flex items-center justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-ziad-primary" /></div>;

  return (
    <div className="space-y-5">
      <section className="rounded-card border border-ziad-line bg-ziad-panel p-5 shadow-sm">
        <p className="text-xs font-bold uppercase text-ziad-primary">{t("courses")}</p>
        <h1 className="text-3xl font-extrabold text-ziad-ink">{t("courseSetup")}</h1>
        <p className="mt-2 text-sm text-ziad-ink/62">{t("createCoursesAndTrack")}</p>
      </section>

      {!isCreating ? (
        <button onClick={() => setIsCreating(true)} className="inline-flex h-11 items-center justify-center gap-2 rounded-button bg-ziad-primary px-4 text-sm font-extrabold text-ziad-light hover:bg-ziad-ink">
          <Plus className="h-4 w-4" /> {t("createNewCourse")}
        </button>
      ) : (
        <section className="rounded-card border border-ziad-line bg-ziad-panel p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-ziad-line pb-3">
            <h2 className="text-xl font-extrabold text-ziad-ink">{t("createNewCourse")}</h2>
            <button onClick={() => setIsCreating(false)} className="text-ziad-ink hover:text-red-500"><X className="h-5 w-5" /></button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="mb-1 text-xs font-bold uppercase text-ziad-primary">{t("courseNamePlaceholder")}</p>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder={t("egAdvancedMath")} className="h-11 w-full rounded-button border border-ziad-line bg-white px-3 text-sm font-semibold outline-none focus:border-ziad-primary" />
            </div>
            <div>
              <p className="mb-1 text-xs font-bold uppercase text-ziad-primary">{t("examDate")}</p>
              <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="h-11 w-full rounded-button border border-ziad-line bg-white px-3 text-sm font-semibold outline-none focus:border-ziad-primary" />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {/* Books Checkboxes */}
            <div className="flex flex-col gap-1">
              <p className="text-xs font-bold uppercase text-ziad-primary">{t("assignBooks")}</p>
              <div className="flex-1 overflow-y-auto rounded-button border border-ziad-line bg-white p-2" style={{ maxHeight: '160px' }}>
                {books.map(b => (
                  <label key={b.id} className="flex cursor-pointer items-center gap-2 rounded p-1 text-sm font-semibold text-ziad-ink hover:bg-ziad-light">
                    <input type="checkbox" checked={selectedBookIds.includes(Number(b.id))} onChange={(e) => {
                      if (e.target.checked) setSelectedBookIds([...selectedBookIds, Number(b.id)]);
                      else setSelectedBookIds(selectedBookIds.filter(id => id !== Number(b.id)));
                    }} /> 
                    <span className="truncate">{b.title}</span>
                  </label>
                ))}
              </div>
            </div>
            {/* Sessions Checkboxes */}
            <div className="flex flex-col gap-1">
              <p className="text-xs font-bold uppercase text-ziad-primary">{t("assignSessions")}</p>
              <div className="flex-1 overflow-y-auto rounded-button border border-ziad-line bg-white p-2" style={{ maxHeight: '160px' }}>
                {sessions.map(s => (
                  <label key={s.id} className="flex cursor-pointer items-center gap-2 rounded p-1 text-sm font-semibold text-ziad-ink hover:bg-ziad-light">
                    <input type="checkbox" checked={selectedSessionIds.includes(Number(s.id))} onChange={(e) => {
                      if (e.target.checked) setSelectedSessionIds([...selectedSessionIds, Number(s.id)]);
                      else setSelectedSessionIds(selectedSessionIds.filter(id => id !== Number(s.id)));
                    }} /> 
                    <span className="truncate">{s.title || s.startTime}</span>
                  </label>
                ))}
              </div>
            </div>
            {/* Activities Checkboxes */}
            <div className="flex flex-col gap-1">
              <p className="text-xs font-bold uppercase text-ziad-primary">{t("assignActivities")}</p>
              <div className="flex-1 overflow-y-auto rounded-button border border-ziad-line bg-white p-2" style={{ maxHeight: '160px' }}>
                {assignments.map(a => (
                  <label key={a.id} className="flex cursor-pointer items-center gap-2 rounded p-1 text-sm font-semibold text-ziad-ink hover:bg-ziad-light">
                    <input type="checkbox" checked={selectedActivityIds.includes(Number(a.id))} onChange={(e) => {
                      if (e.target.checked) setSelectedActivityIds([...selectedActivityIds, Number(a.id)]);
                      else setSelectedActivityIds(selectedActivityIds.filter(id => id !== Number(a.id)));
                    }} /> 
                    <span className="truncate">{a.title}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <button type="button" onClick={handleCreate} disabled={saving || !name.trim() || !deadline} className="inline-flex h-11 items-center justify-center gap-2 rounded-button bg-ziad-primary px-5 text-sm font-extrabold text-ziad-light hover:bg-ziad-ink disabled:opacity-50">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />} {t("createCourseAndAssign")}
            </button>
          </div>
        </section>
      )}

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ziad-ink/65" />
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t("searchCourses")}
          className="h-10 w-full rounded-button border border-ziad-line bg-white pl-10 pr-3 text-sm outline-none focus:border-ziad-primary"
        />
      </div>

      {filteredCourses.length === 0 ? (
        <p className="text-sm font-medium text-ziad-ink/72">{searchQuery.trim() ? t("noCoursesMatch") : ""}</p>
      ) : (
      <div className="grid gap-4 lg:grid-cols-2">
        {filteredCourses.map((course) => {
          const isEditing = editingId === course.id;
          const isDeleting = deleteId === course.id;
          const courseBooks = books.filter((b) => b.courseId === course.id);

          return (
            <section key={course.id} className="rounded-card border border-ziad-line bg-ziad-panel p-5 shadow-sm">
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold uppercase text-ziad-primary">{course.year}</p>
                  {isEditing ? (
                    <div className="flex w-full flex-col gap-4">
                      <div className="flex gap-2">
                        <input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          placeholder={t("courseNamePlaceholder")}
                          className="h-10 flex-1 rounded-button border border-ziad-line bg-white px-3 text-sm font-extrabold text-ziad-ink outline-none focus:border-ziad-primary"
                        />
                        <input
                          type="date"
                          value={editDeadline}
                          onChange={(e) => setEditDeadline(e.target.value)}
                          className="h-10 rounded-button border border-ziad-line bg-white px-3 text-sm font-extrabold text-ziad-ink outline-none focus:border-ziad-primary"
                        />
                      </div>
                    </div>
                  ) : (
                    <h2 className="text-xl font-extrabold text-ziad-ink">{course.name}</h2>
                  )}
                </div>
                <StatusBadge status={course.isActive ? "active" : "inactive"} />
              </div>

              {/* Stats */}
              {!isEditing && (
                <div className="mt-4 grid gap-3 sm:grid-cols-4">
                  <div className="rounded-card border border-ziad-line bg-ziad-light/45 p-3">
                    <p className="text-xs font-bold uppercase text-ziad-primary">{t("examDateLabel")}</p>
                    <p className="mt-1 text-sm font-extrabold text-ziad-ink">{formatDate(course.examDate)}</p>
                  </div>
                  <div className="rounded-card border border-ziad-line bg-ziad-light/45 p-3">
                    <p className="text-xs font-bold uppercase text-ziad-primary">{t("booksCount")}</p>
                    <p className="mt-1 text-sm font-extrabold text-ziad-ink">{courseBooks.length}</p>
                  </div>
                  <div className="rounded-card border border-ziad-line bg-ziad-light/45 p-3">
                    <p className="text-xs font-bold uppercase text-ziad-primary">{t("sessionsCount")}</p>
                    <p className="mt-1 text-sm font-extrabold text-ziad-ink">{(course as any).sessions?.length || 0}</p>
                  </div>
                  <div className="rounded-card border border-ziad-line bg-ziad-light/45 p-3">
                    <p className="text-xs font-bold uppercase text-ziad-primary">{t("activitiesCount")}</p>
                    <p className="mt-1 text-sm font-extrabold text-ziad-ink">{(course as any).questionGroups?.length || 0}</p>
                  </div>
                </div>
              )}

              {/* Delete Confirmation */}
              {isDeleting && (
                <div className="mt-4 rounded-card border border-red-200 bg-red-50 p-4">
                  <p className="text-sm font-extrabold text-red-900">{t("deleteCourseConfirm")}</p>
                  <div className="mt-3 flex gap-2">
                    <button type="button" onClick={() => handleDelete(course.id)} disabled={saving} className="inline-flex h-9 items-center gap-1 rounded-button bg-red-600 px-4 text-xs font-extrabold text-white hover:bg-red-700 disabled:opacity-50">
                      <Trash2 className="h-3.5 w-3.5" /> {t("actionDelete")}
                    </button>
                    <button type="button" onClick={() => setDeleteId(null)} className="inline-flex h-9 items-center gap-1 rounded-button border border-ziad-line px-3 text-xs font-bold text-ziad-ink hover:bg-ziad-light">
                      {t("actionCancel")}
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-4 flex flex-wrap gap-2">
                {isEditing ? (
                  <>
                    <button type="button" onClick={saveEdit} disabled={saving} className="inline-flex items-center gap-1 rounded-button bg-ziad-primary px-4 py-2 text-sm font-bold text-white hover:bg-ziad-ink disabled:opacity-50">
                      {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />} {t("saveChanges")}
                    </button>
                    <button type="button" onClick={() => setEditingId(null)} className="rounded-button border border-ziad-line px-4 py-2 text-sm font-bold text-ziad-ink hover:bg-ziad-light">
                      {t("actionCancel")}
                    </button>
                  </>
                ) : (
                  <>
                    <button type="button" onClick={() => { setAnalyticsCourseId(Number(course.id)); setAnalyticsCourseName(course.name); }} className="inline-flex items-center gap-1 rounded-button bg-ziad-light px-3 py-2 text-sm font-bold text-ziad-ink hover:bg-ziad-primary hover:text-white">
                      View Analytics
                    </button>
                    <button type="button" onClick={() => startEdit(course)} className="inline-flex items-center gap-1 rounded-button border border-ziad-line px-3 py-2 text-sm font-bold text-ziad-ink hover:bg-ziad-light">
                      <Pencil className="h-3.5 w-3.5" /> {t("editDetailsAndAssignments")}
                    </button>
                    <button type="button" onClick={() => setDeleteId(course.id)} className="inline-flex items-center gap-1 rounded-button border border-red-200 px-3 py-2 text-sm font-bold text-red-700 hover:bg-red-50">
                      <Trash2 className="h-3.5 w-3.5" /> {t("actionDelete")}
                    </button>
                  </>
                )}
              </div>
            </section>
          );
        })}
      </div>
      )}
      
      {analyticsCourseId !== null && (
        <CourseAnalyticsModal
          courseId={analyticsCourseId}
          courseName={analyticsCourseName}
          onClose={() => setAnalyticsCourseId(null)}
        />
      )}
    </div>
  );
}
