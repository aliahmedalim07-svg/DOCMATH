import { X } from "lucide-react";
import { useEffect } from "react";

interface ImagePreviewModalProps {
  src: string;
  onClose: () => void;
}

export default function ImagePreviewModal({ src, onClose }: ImagePreviewModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 bg-ziad-ink/70 p-0 backdrop-blur-sm sm:p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <section
        className="mx-auto flex h-full max-h-[90vh] max-w-[90vw] flex-col overflow-hidden bg-ziad-panel shadow-soft sm:rounded-card"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between border-b border-ziad-line bg-ziad-light/70 px-4 py-3">
          <h2 className="text-sm font-extrabold text-ziad-ink">Preview</h2>
          <button
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-button border border-ziad-line bg-ziad-panel text-ziad-ink transition hover:bg-red-50 hover:text-red-700"
            aria-label="Close preview"
          >
            <X className="h-5 w-5" />
          </button>
        </header>
        <div className="flex flex-1 items-center justify-center overflow-auto bg-[#0e1a10] p-4">
          <img
            src={src}
            alt=""
            className="max-h-full max-w-full rounded-button object-contain shadow-lg"
            onError={(e) => { e.currentTarget.style.display = "none"; }}
          />
        </div>
      </section>
    </div>
  );
}
