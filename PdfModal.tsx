import { AlertTriangle, Maximize2 } from "lucide-react";
import { useI18n } from "../contexts/I18nContext";

interface FullscreenExitOverlayProps {
  countdown: number;
  onReturnToFullscreen: () => void;
}

export function FullscreenExitOverlay({ countdown, onReturnToFullscreen }: FullscreenExitOverlayProps) {
  const { t } = useI18n();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ziad-ink/80 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-sm rounded-card border border-red-200 bg-white p-8 text-center shadow-lift">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <AlertTriangle className="h-8 w-8 text-red-600" />
        </div>

        <h2 className="text-xl font-extrabold text-ziad-ink">{t("fullscreenExitedTitle")}</h2>
        <p className="mt-2 text-sm text-ziad-ink/70">
          {t("fullscreenExitedDesc")}
        </p>

        <div className="mt-4">
          <span className="inline-flex items-center justify-center rounded-full bg-red-100 px-4 py-2 text-3xl font-extrabold text-red-700">
            {countdown}
          </span>
          <p className="mt-1 text-xs font-medium text-ziad-ink/50">{t("secondsUntilSubmit")}</p>
        </div>

        <button
          type="button"
          onClick={onReturnToFullscreen}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-button bg-practice-blue px-6 py-3 text-base font-bold text-white transition hover:bg-blue-700"
        >
          <Maximize2 className="h-5 w-5" />
          {t("returnToFullscreen")}
        </button>
      </div>
    </div>
  );
}
