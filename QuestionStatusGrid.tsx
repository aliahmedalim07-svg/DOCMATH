import { useEffect } from "react";
import { X } from "lucide-react";
import { useI18n } from "../contexts/I18nContext";
import type { PdfResource } from "../lib/types";

interface PdfModalProps {
  open: boolean;
  onClose: () => void;
  resource?: PdfResource | null;
}

function normalizePdfUrl(url: string) {
  try {
    const parsed = new URL(url);
    const uploadsIndex = parsed.pathname.toLowerCase().indexOf("/api/uploads/");
    if ((parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1") && uploadsIndex >= 0) {
      return parsed.pathname.slice(uploadsIndex) + parsed.search;
    }
  } catch {
    // Relative URLs are already scoped to the current frontend host.
  }

  return url;
}

export function PdfModal({ open, onClose, resource }: PdfModalProps) {
  const { t } = useI18n();
  useEffect(() => {
    if (!open) return undefined;
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, open]);

  if (!open || !resource) return null;
  const pdfUrl = normalizePdfUrl(resource.fileUrl);

  return (
    <div className="fixed inset-0 z-50 bg-ziad-ink/70 p-0 backdrop-blur-sm sm:p-4" role="dialog" aria-modal="true">
      <section className="flex h-full flex-col overflow-hidden bg-ziad-panel shadow-soft sm:rounded-card">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-ziad-line bg-ziad-light/70 px-4 py-3">
          <div>
            <p className="text-xs font-bold uppercase text-ziad-primary">{t("pdfSection")}</p>
            <h2 className="text-lg font-extrabold text-ziad-ink">{resource.title}</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="grid h-10 w-10 place-items-center rounded-button border border-ziad-line bg-ziad-panel text-ziad-ink transition hover:bg-red-50 hover:text-red-700"
              aria-label={t("ariaClosePdf")}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </header>
        <div className="flex-1 overflow-auto bg-stone-100 p-3">
          <div className="mx-auto h-full max-w-6xl">
            <iframe
              title={resource.title}
              src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
              className="h-full min-h-[72vh] w-full rounded-card border border-ziad-line bg-white"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
