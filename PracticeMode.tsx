import { Maximize2, X } from "lucide-react";
import { useI18n } from "../contexts/I18nContext";

interface FullscreenStartModalProps {
  title: string;
  modeLabel: string;
  onStart: () => void;
  onCancel: () => void;
}

export function FullscreenStartModal({ title, modeLabel, onStart, onCancel }: FullscreenStartModalProps) {
  const { t } = useI18n();

  return (
    <section className="practice-gradient grid min-h-screen place-items-center rounded-card p-6">
      <div className="w-full max-w-md rounded-card border border-ziad-line bg-ziad-panel/92 p-8 shadow-soft">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <Maximize2 className="h-8 w-8 text-practice-blue" />
          </div>
          <h1 className="text-2xl font-extrabold text-ziad-ink">{title}</h1>
          <p className="mt-1 text-sm font-medium text-ziad-ink/62">{modeLabel}</p>
        </div>

        <div className="mb-6 rounded-card border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-bold text-amber-800">
            {t("fullscreenWarning")}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={onStart}
            className="inline-flex items-center justify-center gap-2 rounded-button bg-practice-blue px-6 py-3 text-base font-bold text-white transition hover:bg-blue-700"
          >
            <Maximize2 className="h-5 w-5" />
            {t("startPracticeFullscreen")}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center justify-center gap-2 rounded-button border border-ziad-line bg-ziad-light px-6 py-3 text-base font-bold text-ziad-ink transition hover:bg-red-100 hover:text-red-700"
          >
            <X className="h-5 w-5" />
            {t("actionCancel")}
          </button>
        </div>
      </div>
    </section>
  );
}
