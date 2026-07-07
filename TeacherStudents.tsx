import { Link } from "react-router-dom";
import { AlertCircle, Loader2, Play, Target } from "lucide-react";
import { useEffect, useState } from "react";
import { useI18n } from "../../contexts/I18nContext";
import { getMyWeakPoints } from "../../lib/api-service";
import type { WeakPointDetail } from "../../lib/types";

export default function WeakPoints() {
  const { t } = useI18n();
  const [weakPointsList, setWeakPointsList] = useState<WeakPointDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const rows = weakPointsList.filter((point) => point.mistakeCount > 0 || point.accuracy < 70);

  useEffect(() => {
    setLoading(true);
    getMyWeakPoints()
      .then(setWeakPointsList)
      .catch(() => setWeakPointsList([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-5">
      <section className="rounded-card border border-ziad-line bg-ziad-panel p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase text-ziad-primary">{t("weakPoints")}</p>
            <h1 className="text-3xl font-extrabold text-ziad-ink">{t("fixRepeatedMistakes")}</h1>
            <p className="mt-2 text-sm text-ziad-ink/62">{t("weakPointsSubtitle")}</p>
          </div>
          <Link
            to="/student/skills"
            className="inline-flex items-center justify-center gap-2 rounded-button bg-practice-blue px-4 py-2.5 text-sm font-extrabold text-white hover:bg-blue-700"
          >
            <Play className="h-4 w-4" />
            {t("practiceWeakPoints")}
          </Link>
        </div>
      </section>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-ziad-primary" />
        </div>
      ) : rows.length === 0 ? (
        <section className="rounded-card border border-ziad-line bg-ziad-panel p-10 text-center shadow-sm">
          <Target className="mx-auto h-10 w-10 text-emerald-600" />
          <h2 className="mt-3 text-xl font-extrabold text-ziad-ink">{t("noWeakPointsYet")}</h2>
          <p className="mt-1 text-sm text-ziad-ink/62">{t("keepSolvingAssignments")}</p>
        </section>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {rows.map((point) => (
            <section key={point.categoryName} className="rounded-card border border-ziad-line bg-ziad-panel p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-button bg-amber-50 text-amber-700">
                  <AlertCircle className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold uppercase text-amber-700">{point.mistakeCount} {t("xMistakes")}</p>
                  <h2 className="text-xl font-extrabold text-ziad-ink">{point.categoryName}</h2>
                  <p className="mt-1 text-sm leading-6 text-ziad-ink/62">
                    Accuracy: {Math.round(point.accuracy)}%. Focus your next practice on this skill.
                  </p>
                </div>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-ziad-light">
                <div
                  className="h-full rounded-full bg-amber-500"
                  style={{ width: `${Math.max(0, Math.min(100, point.accuracy))}%` }}
                />
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
