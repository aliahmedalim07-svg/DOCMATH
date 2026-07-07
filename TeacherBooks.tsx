import { useEffect, useState, useMemo } from "react";
import { cn, formatDateTime, to800 } from "../../lib/utils";
import { useI18n } from "../../contexts/I18nContext";
import { getMyMistakes, getTries } from "../../lib/api-service";
import { MistakeDetail, TrySummary } from "../../lib/types";
import { Loader2, History, AlertCircle } from "lucide-react";
import { renderLatex } from "../../components/LatexRenderer";

export default function MistakeHistory() {
  const { t } = useI18n();
  const [loading, setLoading] = useState(true);
  const [tries, setTries] = useState<TrySummary[]>([]);
  const [mistakes, setMistakes] = useState<MistakeDetail[]>([]);
  
  const tabs = useMemo(() => [
    { id: "history", label: t("attemptHistory"), icon: History },
    { id: "mistakes", label: t("mistakeHistory"), icon: AlertCircle },
  ] as const, [t]);

  const [tab, setTab] = useState<string>("history");

  useEffect(() => {
    setLoading(true);
    Promise.all([getTries(), getMyMistakes()])
      .then(([triesData, mistakesData]) => {
        setTries(triesData);
        setMistakes(mistakesData);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-5">
      <section className="rounded-card border border-ziad-line bg-ziad-panel p-5 shadow-sm">
        <p className="text-xs font-bold uppercase text-ziad-primary">{t("performance")}</p>
        <h1 className="text-3xl font-extrabold text-ziad-ink">{t("trackProgress")}</h1>
        <p className="mt-2 text-sm text-ziad-ink/62">{t("reviewPerformance")}</p>
      </section>

      <div className="overflow-x-auto rounded-card border border-ziad-line bg-ziad-panel p-1">
        <div className="flex min-w-max gap-1">
          {tabs.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={cn(
                "flex items-center gap-2 rounded-button px-4 py-2.5 text-sm font-bold transition",
                tab === item.id ? "bg-ziad-primary text-ziad-light" : "text-ziad-ink/68 hover:bg-ziad-light",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-ziad-primary" />
        </div>
      ) : tab === "history" ? (
        <div className="space-y-3">
          {tries.length === 0 ? (
            <div className="rounded-card border border-ziad-line bg-ziad-panel p-10 text-center shadow-sm">
              <p className="font-medium text-ziad-ink/72">{t("noAttemptsFound")}</p>
            </div>
          ) : (
            tries.map((item) => (
              <div key={item.id} className="rounded-card border border-ziad-line bg-ziad-panel p-4 shadow-sm transition hover:border-ziad-accent">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase text-ziad-primary">{formatDateTime(item.submittedAt)}</p>
                    <h2 className="mt-1 text-lg font-extrabold text-ziad-ink">{item.questionGroupTitle}</h2>
                    <p className="text-sm text-ziad-ink/62">
                      {item.correctAnswers} / {item.totalQuestions} {t("questions")}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={cn(
                      "text-2xl font-black",
                      to800(item.scorePercentage) >= 640 ? "text-emerald-600" : to800(item.scorePercentage) >= 400 ? "text-amber-600" : "text-red-600"
                    )}>
                      {to800(item.scorePercentage)}/800
                    </div>
                    <p className="text-[10px] font-bold uppercase text-ziad-ink/72">{t("totalScore")}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {mistakes.length === 0 ? (
            <div className="rounded-card border border-ziad-line bg-ziad-panel p-10 text-center shadow-sm">
              <p className="font-medium text-ziad-ink/72">No mistakes recorded yet.</p>
            </div>
          ) : mistakes.map((mistake) => (
            <div key={`${mistake.questionId}-${mistake.date}`} className="rounded-card border border-red-200 bg-red-50/70 p-4 shadow-sm">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold uppercase text-red-700">{formatDateTime(mistake.date)}</p>
                  <div className="mt-1 text-base font-extrabold text-ziad-ink">{renderLatex(mistake.questionText)}</div>
                  {mistake.questionImageUrl && (
                    <img
                      src={mistake.questionImageUrl}
                      alt={t("altQuestionImage")}
                      loading="lazy"
                      onError={(e) => { e.currentTarget.style.display = "none"; }}
                      className="mt-3 max-h-48 rounded-card border border-red-100 bg-white object-contain"
                    />
                  )}
                </div>
                <div className="grid min-w-[220px] gap-2 text-sm">
                  <div className="rounded-button bg-white p-3">
                    <p className="text-xs font-bold uppercase text-red-600">{t("yourAnswer")}</p>
                    <div className="mt-1 font-semibold text-ziad-ink">{renderLatex(mistake.selectedChoiceText)}</div>
                  </div>
                  <div className="rounded-button bg-white p-3">
                    <p className="text-xs font-bold uppercase text-emerald-600">{t("correctAnswer")}</p>
                    <div className="mt-1 font-semibold text-ziad-ink">{renderLatex(mistake.correctChoiceText)}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
