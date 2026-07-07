import { useEffect, useState } from "react";
import { FileText, Loader2, Play, Video } from "lucide-react";
import { useCourse } from "../../contexts/CourseContext";
import { useI18n } from "../../contexts/I18nContext";
import { getSessionsByCourse } from "../../lib/api-service";
import { PdfModal } from "../../components/PdfModal";
import type { Session, PdfResource } from "../../lib/types";
import { formatDateTime } from "../../lib/utils";

export default function Homework() {
  const { t } = useI18n();
  const { selectedCourse, loading: courseLoading } = useCourse();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [pdfId, setPdfId] = useState<string | null>(null);
  const selectedPdf: PdfResource | null = (() => {
    const found = sessions.flatMap((s) => s.sessionPDFs || []).find((p) => p.id === pdfId);
    if (!found) return null;
    return { id: found.id, title: found.title, fileUrl: found.url, orderIndex: 0 };
  })();

  useEffect(() => {
    let isActive = true;

    const loadSessions = async () => {
      if (courseLoading) return;

      if (!selectedCourse) {
        if (isActive) {
          setSessions([]);
          setLoading(false);
        }
        return;
      }

      try {
        setLoading(true);
        const data = await getSessionsByCourse(selectedCourse.id);
        if (isActive) setSessions(data);
      } catch {
        if (isActive) setSessions([]);
      } finally {
        if (isActive) setLoading(false);
      }
    };

    loadSessions();

    return () => {
      isActive = false;
    };
  }, [courseLoading, selectedCourse]);

  return (
    <div className="space-y-5">
      <section className="rounded-card border border-ziad-line bg-ziad-panel p-5 shadow-sm">
        <p className="text-xs font-bold uppercase text-ziad-primary">{t("sessions")}</p>
        <h1 className="text-3xl font-extrabold text-ziad-ink">{t("sessionsTitle")}</h1>
        <p className="mt-2 text-sm text-ziad-ink/62">{t("sessionsSubtitle")}</p>
      </section>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-ziad-primary" />
        </div>
      ) : sessions.length === 0 ? (
        <div className="rounded-card border border-ziad-line bg-ziad-panel p-8 text-center">
          <Video className="mx-auto h-12 w-12 text-ziad-ink/55" />
          <p className="mt-4 text-lg font-bold text-ziad-ink">{t("noSessions")}</p>
          <p className="mt-1 text-sm text-ziad-ink/62">{t("noSessionsDesc")}</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="rounded-card border border-ziad-line bg-ziad-panel p-5 shadow-sm transition hover:border-ziad-accent"
            >
              <div className="flex items-start gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-button bg-ziad-light">
                  <Play className="h-5 w-5 text-ziad-primary" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-extrabold text-ziad-ink truncate">{session.title || session.startTime}</h3>
                  <p className="mt-1 text-xs font-semibold text-ziad-ink/58">
                    {formatDateTime(session.startTime)}
                  </p>
                </div>
              </div>

              {session.sessionPDFs && session.sessionPDFs.length > 0 && (
                <div className="mt-4 border-t border-ziad-line pt-4">
                  <p className="text-xs font-bold uppercase text-ziad-ink/72">{t("materials")}</p>
                  <div className="mt-2 space-y-2">
                    {session.sessionPDFs.map((material) => (
                      <button
                        key={material.id}
                        onClick={() => setPdfId(material.id)}
                        className="flex w-full items-center gap-2 text-sm font-bold text-ziad-primary hover:text-ziad-ink"
                      >
                        <FileText className="h-4 w-4" />
                        <span className="truncate">{material.title}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {session.url && (
                <a
                  href={session.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-button bg-ziad-primary px-4 py-2 text-sm font-extrabold text-ziad-light hover:bg-ziad-ink"
                >
                  <Video className="h-4 w-4" />
                  {t("meetingLink")}
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      <PdfModal open={Boolean(pdfId)} onClose={() => setPdfId(null)} resource={selectedPdf} />
    </div>
  );
}
