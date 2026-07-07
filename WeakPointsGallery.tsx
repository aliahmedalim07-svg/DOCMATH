import { useEffect, useMemo, useState } from "react";
import { Eye, Loader2, PlayCircle, X } from "lucide-react";
import type { VideoResource } from "../lib/types";
import { formatDuration } from "../lib/utils";
import { getVideoPlayUrl, getVideoRemainingViews } from "../lib/api-service";
import { useI18n } from "../contexts/I18nContext";

interface VideoModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  videos: VideoResource[];
}

export function VideoModal({ open, onClose, title, videos }: VideoModalProps) {
  const { t } = useI18n();
  const [selectedId, setSelectedId] = useState<string | null>(videos[0]?.id ?? null);
  const [autoplayNext, setAutoplayNext] = useState(true);
  const [embedUrl, setEmbedUrl] = useState<string | null>(null);
  const [loadingEmbed, setLoadingEmbed] = useState(false);
  const [pendingViewConfirm, setPendingViewConfirm] = useState<VdoCipherConfirm | null>(null);

  useEffect(() => {
    if (open) {
      setSelectedId(videos[0]?.id ?? null);
      setPendingViewConfirm(null);
    }
  }, [open, videos]);

  useEffect(() => {
    if (!open) return undefined;
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, open]);

  const selected = useMemo(
    () => videos.find((video) => video.id === selectedId) ?? videos[0],
    [selectedId, videos],
  );

  useEffect(() => {
    setEmbedUrl(null);
    setPendingViewConfirm(null);
    if (!selected) return;
    if (selected.provider === 'youtube') {
      setEmbedUrl(selected.url);
    } else {
      getVideoRemainingViews(selected.id).then((remaining) => {
        if (remaining <= 0) {
          setPendingViewConfirm({ remainingViews: remaining, videoId: selected.id });
        } else {
          setPendingViewConfirm({ remainingViews: remaining, videoId: selected.id });
        }
      }).catch(() => {
        setEmbedUrl(null);
      });
    }
  }, [selected]);

  const handleConfirmWatch = async () => {
    if (!selected || !pendingViewConfirm) return;
    setPendingViewConfirm(null);
    setLoadingEmbed(true);
    try {
      const result = await getVideoPlayUrl(selected.id);
      setEmbedUrl(result.url);
    } catch {
      setEmbedUrl(null);
    } finally {
      setLoadingEmbed(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-ziad-ink/70 p-0 backdrop-blur-sm sm:p-4" role="dialog" aria-modal="true">
      <section className="grid h-full overflow-hidden bg-ziad-panel shadow-soft sm:rounded-card lg:grid-cols-[360px_1fr]">
        <aside className="min-h-0 border-b border-ziad-line bg-ziad-light/65 lg:border-b-0 lg:border-e">
          <div className="flex items-center justify-between gap-3 border-b border-ziad-line p-4">
            <div>
              <p className="text-xs font-bold uppercase text-ziad-primary">{t("videosSection")}</p>
              <h2 className="text-lg font-extrabold text-ziad-ink">{title}</h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="grid h-10 w-10 place-items-center rounded-button border border-ziad-line bg-ziad-panel text-ziad-ink transition hover:bg-red-50 hover:text-red-700"
              aria-label={t("closeVideos")}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="max-h-[34vh] overflow-y-auto p-3 lg:max-h-[calc(100vh-6rem)]">
            {videos.map((video) => (
              <button
                key={video.id}
                type="button"
                onClick={() => setSelectedId(video.id)}
                className={`mb-2 flex w-full items-center gap-3 rounded-card border p-2 text-start transition ${
                  selected?.id === video.id
                    ? "border-ziad-primary bg-ziad-panel shadow-sm"
                    : "border-transparent hover:border-ziad-line hover:bg-ziad-panel/75"
                }`}
              >
                <img src={video.thumbnailUrl} alt="" className="h-16 w-24 rounded-button object-cover" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-extrabold text-ziad-ink">{video.title}</span>
                  <span className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-ziad-ink/72">
                    <PlayCircle className="h-3.5 w-3.5" />
                    {formatDuration(video.durationSec || 0)}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </aside>

        <div className="flex min-h-0 flex-col bg-[#0e1a10]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-3 text-white">
            <h3 className="text-sm font-bold">{selected?.title ?? t("selectAVideo")}</h3>
            <label className="inline-flex items-center gap-2 text-xs font-semibold text-white/80">
              <input
                type="checkbox"
                checked={autoplayNext}
                onChange={(event) => setAutoplayNext(event.target.checked)}
                className="h-4 w-4 rounded border-white/30 text-ziad-accent"
              />
              {t("autoPlayNext")}
            </label>
          </div>
          <div className="grid flex-1 place-items-center p-3">
            {selected ? (
              loadingEmbed ? (
                <div className="flex flex-col items-center gap-2 text-white/75">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <p className="text-sm font-semibold">{t("loadingVideo")}</p>
                </div>
              ) : embedUrl ? (
                <iframe
                  title={selected.title}
                  src={`${embedUrl}${autoplayNext ? "&autoplay=0" : ""}`}
                  className="aspect-video w-full max-w-5xl rounded-card border border-white/10 bg-black"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : pendingViewConfirm ? (
                <div className="flex flex-col items-center gap-4 text-center text-white">
                  {pendingViewConfirm.remainingViews > 0 ? (
                    <>
                      <Eye className="h-10 w-10 text-ziad-accent" />
                      <p className="text-lg font-bold">{t("viewsRemaining").replace("{n}", pendingViewConfirm.remainingViews.toString())}</p>
                      <p className="text-sm font-medium text-white/82">{t("watchingConsumesView")}</p>
                      <div className="flex gap-3">
                        <button type="button" onClick={handleConfirmWatch} className="inline-flex h-10 items-center justify-center gap-2 rounded-button bg-ziad-accent px-6 text-sm font-extrabold text-white hover:bg-ziad-accent/80">
                          {t("watchNow")}
                        </button>
                        <button type="button" onClick={onClose} className="inline-flex h-10 items-center justify-center gap-2 rounded-button border border-white/25 px-6 text-sm font-bold text-white/85 hover:bg-white/10">
                          {t("confirmCancel")}
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <Eye className="h-10 w-10 text-white/75" />
                      <p className="text-lg font-bold text-white/82">{t("noViewsRemaining")}</p>
                      <p className="text-sm font-medium text-white/75">{t("contactInstructorForViews")}</p>
                    </>
                  )}
                </div>
              ) : (
                <p className="text-sm font-semibold text-white/75">{t("failedToLoadVideo")}</p>
              )
            ) : (
              <p className="text-sm font-semibold text-white/75">{t("noVideosForBook")}</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

interface VdoCipherConfirm {
  remainingViews: number;
  videoId: string;
}
