import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ClipboardCheck, FileText, Loader2, PlayCircle, Target } from "lucide-react";
import { PdfModal } from "../../components/PdfModal";
import { ProgressRing } from "../../components/ProgressRing";
import { VideoModal } from "../../components/VideoModal";
import { getBook } from "../../lib/api-service";
import { cn, formatDuration } from "../../lib/utils";
import type { Book } from "../../lib/types";
import { useI18n } from "../../contexts/I18nContext";

type Tab = "assignments" | "videos" | "pdfs" | "skills";

export default function BookDetail() {
  const { t } = useI18n();
  const { bookId } = useParams();
  const [tab, setTab] = useState<Tab>("assignments");
  const [videoOpen, setVideoOpen] = useState(false);
  const [pdfId, setPdfId] = useState<string | null>(null);
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!bookId) return;
    getBook(bookId)
      .then(setBook)
      .catch(() => setBook(null))
      .finally(() => setLoading(false));
  }, [bookId]);

  const bookAssignments: any[] = [];
  const bookVideos: any[] = [];
  const bookPdfs: any[] = [];
  const bookSkills: any[] = [];
  const selectedPdf = null;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-ziad-primary" />
      </div>
    );
  }

  if (!book) {
    return <p className="rounded-card border border-red-200 bg-red-50 p-4 font-semibold text-red-700">{t("childNotFound")}</p>;
  }

  const tabs: Array<{ id: Tab; label: string; icon: typeof ClipboardCheck }> = [
    { id: "assignments", label: t("assignments"), icon: ClipboardCheck },
    { id: "videos", label: t("videosSection"), icon: PlayCircle },
    { id: "pdfs", label: t("pdfSection"), icon: FileText },
    { id: "skills", label: t("skills"), icon: Target },
  ];

  return (
    <div className="space-y-5">
      <section className="rounded-card border border-ziad-line bg-ziad-panel p-5 shadow-sm">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase text-ziad-primary">{t("bookDetailLabel")}</p>
            <h1 className="text-3xl font-extrabold text-ziad-ink">{book.title}</h1>
            <p className="mt-2 text-sm text-ziad-ink/62">{t("resourcesSkillsAndPractice")}</p>
          </div>
          <ProgressRing value={0} size={92} />
        </div>
      </section>

      <div className="overflow-x-auto rounded-card border border-ziad-line bg-ziad-panel p-1">
        <div className="flex min-w-max gap-1">
          {tabs.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={cn(
                "inline-flex items-center gap-2 rounded-button px-4 py-2.5 text-sm font-bold transition",
                tab === item.id ? "bg-ziad-primary text-ziad-light" : "text-ziad-ink/68 hover:bg-ziad-light",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {tab === "assignments" ? (
        <div className="grid gap-3 md:grid-cols-2">
          {bookAssignments.map((assignment) => (
            <Link key={assignment.id} to={`/student/assignments/${assignment.id}/practice?mode=questions`} className="rounded-card border border-ziad-line bg-ziad-panel p-4 shadow-sm hover:border-ziad-accent">
              <p className="text-xs font-bold uppercase text-ziad-primary">{assignment.type}</p>
              <h2 className="mt-2 text-lg font-extrabold text-ziad-ink">{assignment.title}</h2>
              <p className="mt-2 text-sm text-ziad-ink/62">{assignment.totalQuestions} {t("questionsCount")}, {assignment.degree} degrees</p>
            </Link>
          ))}
        </div>
      ) : null}

      {tab === "videos" ? (
        <div className="grid gap-3 md:grid-cols-2">
          {bookVideos.map((video) => (
            <button key={video.id} type="button" onClick={() => setVideoOpen(true)} className="flex items-center gap-3 rounded-card border border-ziad-line bg-ziad-panel p-3 text-start shadow-sm hover:border-ziad-accent">
              <img src={video.thumbnailUrl} alt="" className="h-20 w-28 rounded-button object-cover" />
              <span>
                <span className="block font-extrabold text-ziad-ink">{video.title}</span>
                <span className="text-sm font-semibold text-ziad-ink/62">{formatDuration(video.durationSec)}</span>
              </span>
            </button>
          ))}
        </div>
      ) : null}

      {tab === "pdfs" ? (
        <div className="grid gap-3 md:grid-cols-2">
          {bookPdfs.map((pdf) => (
            <button key={pdf.id} type="button" onClick={() => setPdfId(pdf.id)} className="rounded-card border border-ziad-line bg-ziad-panel p-4 text-start shadow-sm hover:border-ziad-accent">
              <FileText className="h-7 w-7 text-ziad-primary" />
              <h2 className="mt-3 font-extrabold text-ziad-ink">{pdf.title}</h2>
              <p className="mt-1 text-sm text-ziad-ink/62">{t("nPagesSizeMB").replace("{n}", pdf.pagesCount.toString()).replace("{size}", Math.round(pdf.sizeKb / 1024).toString())}</p>
            </button>
          ))}
        </div>
      ) : null}

      {tab === "skills" ? (
        <div className="grid gap-3 md:grid-cols-2">
          {bookSkills.map((skill) => (
            <section key={skill.id} className="rounded-card border border-ziad-line bg-ziad-panel p-4 shadow-sm">
              <p className="text-xs font-bold uppercase text-ziad-primary">{t("examSkillWeighting").replace("{pct}", skill.examSkillWeighting.toString())}</p>
              <h2 className="mt-2 text-lg font-extrabold text-ziad-ink">{skill.name}</h2>
              <p className="mt-2 text-sm leading-6 text-ziad-ink/62">{skill.description}</p>
            </section>
          ))}
        </div>
      ) : null}

      <VideoModal open={videoOpen} onClose={() => setVideoOpen(false)} title={book.title} videos={bookVideos} />
      <PdfModal open={Boolean(pdfId)} onClose={() => setPdfId(null)} resource={selectedPdf} />
    </div>
  );
}
