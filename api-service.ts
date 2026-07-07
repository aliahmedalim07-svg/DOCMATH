import { useMemo, useState } from "react";
import { AlertTriangle, X, CalendarDays, CheckCircle2, XCircle, Calendar, TrendingUp } from "lucide-react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { ParentDashboardData, DailyActivity } from "../../lib/types";
import { ChildDashboardView } from "./ChildDashboardView";
import { WeakPointsGallery } from "./WeakPointsGallery";
import { useI18n } from "../../contexts/I18nContext";
import { to800 } from "../../lib/utils";

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

interface DashboardDisplayProps {
  data: ParentDashboardData;
  dataLoading?: boolean;
}

export function DashboardDisplay({ data: dashboardData, dataLoading }: DashboardDisplayProps) {
  const { t } = useI18n();
  const [selectedDay, setSelectedDay] = useState<DailyActivity | null>(null);

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
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-ziad-primary border-t-transparent" />
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

  const chartData = (dashboardData.dailyActivity || []).map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    fullDate: new Date(item.date).toLocaleDateString('en-US', { dateStyle: 'full' }),
    attempts: item.attemptsCount,
    avgScore: item.averageScore,
    raw: item,
  }));

  const handleBarClick = (data: any) => {
    if (data && data.raw) {
      setSelectedDay(data.raw);
    }
  };

  return (
    <div className="space-y-6">
      <ChildDashboardView progress={dashboardData.generalProgress} />

      {dashboardData.generalProgress.rankedStudents > 0 && (
        <section className="rounded-card border border-ziad-line bg-ziad-panel p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-full text-lg font-black text-white ${
              dashboardData.generalProgress.averageScore < 35
                ? "bg-red-500"
                : dashboardData.generalProgress.averageScore < 70
                  ? "bg-amber-500"
                  : "bg-emerald-500"
            }`}>
              {dashboardData.generalProgress.averageScore < 35 ? "!" : dashboardData.generalProgress.averageScore < 70 ? "→" : "✓"}
            </div>
            <p className="text-base font-bold text-ziad-ink">
              {dashboardData.generalProgress.averageScore < 35
                ? t("performanceLevelLow")
                : dashboardData.generalProgress.averageScore < 70
                  ? t("performanceLevelMedium")
                  : t("performanceLevelHigh")}
            </p>
          </div>
        </section>
      )}

      {dashboardData.generalProgress.scoreTrend.length > 0 && (
        <section className="rounded-card border border-ziad-line bg-ziad-panel p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="grid h-10 w-10 place-items-center rounded-button bg-ziad-light text-ziad-primary">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-ziad-ink">{t("scoreTrend")}</h2>
              <p className="text-sm font-medium text-ziad-ink/72">{t("performanceTrends")}</p>
            </div>
          </div>
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dashboardData.generalProgress.scoreTrend.map(s => ({ ...s, date: new Date(s.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }) }))}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="date" tick={{ fill: "#94A3B8", fontSize: 11, fontWeight: 600 }} />
                <YAxis domain={[0, 800]} tick={{ fill: "#94A3B8", fontSize: 11, fontWeight: 600 }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-ziad-ink text-white p-3 rounded-2xl shadow-xl">
                          <p className="text-xs font-bold uppercase text-white/80 mb-1">{payload[0].payload.date}</p>
                          <p className="text-lg font-black">{payload[0].value}/800</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line type="monotone" dataKey="score" stroke="#01219a" strokeWidth={3} dot={{ r: 4, fill: "#01219a", stroke: "#f7fafc", strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
      )}

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

      <section className="space-y-3">
        <div>
          <p className="text-xs font-bold uppercase text-ziad-primary">{t("dailyActivity")}</p>
          <h2 className="text-xl font-extrabold text-ziad-ink">{t("solvingActivityPerDay")}</h2>
          <p className="text-sm font-medium text-ziad-ink/72">{t("clickOnBar")}</p>
        </div>
        {(dashboardData.dailyActivity || []).length > 0 ? (
          <div className="rounded-card border border-ziad-line bg-ziad-panel p-5 shadow-sm">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} onClick={handleBarClick} style={{ cursor: 'pointer' }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="date" tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 600 }} />
                  <YAxis tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 600 }} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-ziad-ink text-white p-4 rounded-2xl shadow-xl">
                            <p className="text-xs font-bold uppercase text-white/80 mb-1">{payload[0].payload.fullDate}</p>
                            <div className="space-y-1">
                              <p className="text-lg font-black">{payload[0].payload.attempts} {t("attemptsCount")}</p>
                              <p className="text-sm">{t("avgScoreColon").replace("{score}", to800(payload[0].payload.avgScore).toString())}</p>
                              <p className="text-[10px] font-semibold text-white/82 mt-2">{t("clickToViewDetails")}</p>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="attempts" fill="#01219a" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="rounded-card border border-dashed border-ziad-line bg-ziad-panel/50 p-8 text-center">
            <Calendar className="h-10 w-10 mx-auto text-ziad-ink/55 mb-3" />
            <p className="text-sm font-medium text-ziad-ink/72">{t("noDailyActivityYet")}</p>
          </div>
        )}
      </section>

      <section className="space-y-3">
        <div>
          <p className="text-xs font-bold uppercase text-ziad-primary">{t("weakPointsSection")}</p>
          <h2 className="text-xl font-extrabold text-ziad-ink">{t("areasNeedReview")}</h2>
        </div>
        <WeakPointsGallery weakPoints={dashboardData.weakPoints} />
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
