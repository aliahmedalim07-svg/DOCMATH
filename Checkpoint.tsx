import { useEffect, useState, useMemo } from "react";
import { Loader2, AlertTriangle, CheckCircle2, XCircle, X, CalendarDays } from "lucide-react";
import { getChildDashboardStats } from "../../lib/api-service";
import type { ParentDashboardData, DailyActivity } from "../../lib/types";
import { useParentDashboard } from "./ParentDashboardLayout";
import { useI18n } from "../../contexts/I18nContext";

const REV_DAYS = ["Sun", "Sat", "Fri", "Thu", "Wed", "Tue", "Mon"];

function getDateRange(days: number): Date[] {
  const dates: Date[] = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    dates.push(d);
  }
  return dates;
}

function dateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function formatDate(d: Date): string {
  return d.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
}

export default function ParentDailyActivity() {
  const { t } = useI18n();
  const { selectedChildId, selectedCourseId } = useParentDashboard();
  const [dashboardData, setDashboardData] = useState<ParentDashboardData | null>(null);
  const [dataLoading, setDataLoading] = useState(false);
  const [selectedDay, setSelectedDay] = useState<DailyActivity | null>(null);

  useEffect(() => {
    if (!selectedChildId) return;

    const fetchStats = async () => {
      setDataLoading(true);
      try {
        const stats = await getChildDashboardStats(selectedChildId, selectedCourseId || undefined);
        setDashboardData(stats);
      } catch (error) {
        console.error("Failed to fetch daily activity:", error);
        setDashboardData(null);
      } finally {
        setDataLoading(false);
      }
    };
    fetchStats();
  }, [selectedChildId, selectedCourseId]);

  const dates = useMemo(() => getDateRange(28), []);

  const gridDates = useMemo(() => {
    const grid: (Date | null)[] = [];
    let weekCol = 0;
    for (const date of dates) {
      const col = date.getDay() === 0 ? 6 : date.getDay() - 1;
      while (weekCol < col) {
        grid.push(null);
        weekCol++;
      }
      grid.push(date);
      weekCol++;
      if (weekCol === 7) weekCol = 0;
    }
    while (weekCol > 0 && weekCol < 7) {
      grid.push(null);
      weekCol++;
    }

    const weeks: (Date | null)[][] = [];
    for (let i = 0; i < grid.length; i += 7) {
      const week = grid.slice(i, i + 7);
      week.reverse();
      weeks.push(week);
    }
    weeks.reverse();
    return weeks.flat();
  }, [dates]);

  const activityByDate = useMemo(() => {
    const map = new Map<string, DailyActivity>();
    if (dashboardData) {
      for (const a of dashboardData.dailyActivity) {
        map.set(a.date.slice(0, 10), a);
      }
    }
    return map;
  }, [dashboardData]);

  if (dataLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[500px] gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-ziad-primary" />
        <p className="text-ziad-ink/72 font-semibold">{t("updatingDataForChild")}</p>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="flex flex-col items-center justify-center h-[500px] text-center p-8 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
        <AlertTriangle className="h-12 w-12 text-slate-300 mb-4" />
        <h3 className="text-lg font-bold text-slate-800">{t("noDataAvailablePeriod")}</h3>
        <p className="text-ziad-ink/70 max-w-sm font-medium">{t("couldNotRetrieveStats")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-card border border-ziad-line bg-ziad-panel p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="grid h-10 w-10 place-items-center rounded-button bg-ziad-light text-ziad-primary">
            <CalendarDays className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-ziad-ink">{t("dailyActivity")}</h2>
            <p className="text-sm font-medium text-ziad-ink/72">{t("last30Days")}</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="grid grid-cols-7 gap-1" style={{ gridTemplateRows: `auto repeat(${Math.ceil(gridDates.length / 7)}, 1fr)` }}>
            {REV_DAYS.map((day) => (
              <div key={day} className="pb-1 text-center text-xs font-bold uppercase text-ziad-ink/70">
                {day}
              </div>
            ))}
            {gridDates.map((cell, idx) => {
              if (cell === null) {
                return <div key={`e-${idx}`} className="aspect-square w-full" />;
              }
              const key = dateKey(cell);
              const activity = activityByDate.get(key);
              const isActive = activity && activity.attemptsCount > 0;
              const isFuture = cell > new Date();

              return (
                <button
                  key={key}
                  type="button"
                  disabled={isFuture || !isActive}
                  onClick={() => isActive && setSelectedDay(activity)}
                  className={`aspect-square w-full rounded-lg text-xs font-bold transition-all
                    ${isFuture ? "cursor-not-allowed opacity-20" : ""}
                    ${!isFuture && isActive ? "cursor-pointer bg-emerald-400 text-white shadow-sm hover:bg-emerald-500 hover:shadow-md active:scale-95" : ""}
                    ${!isFuture && !isActive ? "bg-red-200 text-red-700" : ""}
                  `}
                >
                  {cell.getDate()}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-4 flex items-center gap-6 text-xs font-semibold text-ziad-ink/72">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-emerald-400" />
            <span>{t("active")}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-red-200" />
            <span>{t("inactive")}</span>
          </div>
        </div>
      </section>

      {selectedDay && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 sm:items-center">
          <div className="w-full max-w-lg rounded-t-2xl bg-white p-6 shadow-2xl sm:rounded-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-ziad-ink">
                {formatDate(new Date(selectedDay.date))}
              </h3>
              <button
                type="button"
                onClick={() => setSelectedDay(null)}
                className="rounded-button p-2 text-ziad-ink/70 hover:bg-ziad-light hover:text-ziad-ink"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-4 flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span className="font-semibold text-ziad-ink">{selectedDay.attemptsCount}</span>
                <span className="text-ziad-ink/72">{t("attemptsCount")}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-ziad-ink">{Math.round(selectedDay.averageScore)}%</span>
                <span className="text-ziad-ink/72">{t("avgScore")}</span>
              </div>
            </div>

            <div className="space-y-2">
              {selectedDay.details.map((detail) => (
                <div
                  key={detail.tryId}
                  className="flex items-center justify-between rounded-button border border-ziad-line bg-ziad-light/50 p-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-ziad-ink">{detail.activityTitle}</p>
                    <p className="text-xs font-medium text-ziad-ink/70">
                      {detail.correctAnswers}/{detail.totalQuestions} {t("correctLabel")}
                    </p>
                  </div>
                  <div className="ml-3 shrink-0">
                    {detail.score >= 50 ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                        <CheckCircle2 className="h-3 w-3" />
                        {Math.round(detail.score)}%
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-bold text-red-700">
                        <XCircle className="h-3 w-3" />
                        {Math.round(detail.score)}%
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
