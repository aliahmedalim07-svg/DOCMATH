import { Activity, AlertCircle, CalendarClock, CheckCircle2, Flame, Loader2, Trophy, Video } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useI18n } from "../../contexts/I18nContext";
import { useCourse } from "../../contexts/CourseContext";
import { getMyMistakes, getMyWeakPoints, getTries, getSessionsByCourse, getStudentStats, StudentStats } from "../../lib/api-service";
import { formatCountdown, formatDateTime, percentClass, to800 } from "../../lib/utils";
import { StatCard } from "../../components/StatCard";
import type { Session, TrySummary } from "../../lib/types";

function ChartShell({ eyebrow, title, helper, children }: { eyebrow: string; title: string; helper?: string; children: ReactNode }) {
  return (
    <section className="rounded-card border border-ziad-line bg-ziad-panel p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase text-ziad-primary">{eyebrow}</p>
          <h2 className="text-xl font-extrabold text-ziad-ink">{title}</h2>
          {helper ? <p className="mt-1 text-xs font-semibold text-ziad-ink/72">{helper}</p> : null}
        </div>
        <Activity className="h-5 w-5 text-ziad-primary" />
      </div>
      {children}
    </section>
  );
}

function EmptyChart({ label }: { label: string }) {
  return (
    <div className="mt-4 flex h-64 items-center justify-center rounded-button border border-dashed border-ziad-line bg-ziad-light/30 text-sm font-bold text-ziad-ink/72">
      {label}
    </div>
  );
}

export default function StudentDashboard() {
  const { user } = useAuth();
  const { t } = useI18n();
  const { selectedCourse, deadline, isCourseEnded, loading: _courseLoading } = useCourse();
  const [tries, setTries] = useState<TrySummary[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [studentStats, setStudentStats] = useState<StudentStats | null>(null);
  const [weakPointsCount, setWeakPointsCount] = useState(0);
  const [mistakeCount, setMistakeCount] = useState(0);
  const [triesLoading, setTriesLoading] = useState(true);
  const [countdown, setCountdown] = useState("");

  useEffect(() => {
    if (!deadline) {
      setCountdown("");
      return;
    }
    setCountdown(formatCountdown(deadline));
    const interval = setInterval(() => {
      setCountdown(formatCountdown(deadline));
    }, 1000);
    return () => clearInterval(interval);
  }, [deadline]);

  useEffect(() => {
    Promise.all([
      getTries().then(setTries),
      getMyWeakPoints().then((items) => setWeakPointsCount(items.filter((item) => item.mistakeCount > 0 || item.accuracy < 70).length)),
      getMyMistakes().then((items) => setMistakeCount(items.length)),
      getStudentStats("me").then(setStudentStats).catch(() => {}),
    ]).finally(() => {
      setTriesLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!selectedCourse) {
      setSessions([]);
      return;
    }

    let active = true;
    getSessionsByCourse(selectedCourse.id)
      .then((data) => {
        if (active) setSessions(data);
      })
      .catch(() => {
        if (active) setSessions([]);
      });

    return () => {
      active = false;
    };
  }, [selectedCourse]);

  const totalScore = tries.length > 0 
    ? Math.round(tries.reduce((acc, curr) => acc + curr.scorePercentage, 0) / tries.length) 
    : 0;
    
  const progressSeries = useMemo(() => tries.slice(0, 7).reverse().map((attempt, index) => ({
    attempt: `Try ${index + 1}`,
    title: attempt.questionGroupTitle,
    score: to800(attempt.scorePercentage),
  })), [tries]);

  const answerSeries = useMemo(() => tries.slice(0, 5).reverse().map((attempt, index) => ({
    attempt: `Try ${index + 1}`,
    title: attempt.questionGroupTitle,
    correct: attempt.correctAnswers,
    missed: Math.max(attempt.totalQuestions - attempt.correctAnswers, 0),
  })), [tries]);

  const latestAttempts = useMemo(() => tries.slice(0, 4), [tries]);
  const nextSession = useMemo(() => {
    const now = Date.now();
    return [...sessions]
      .filter((session) => new Date(session.startTime).getTime() >= now)
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())[0] ?? null;
  }, [sessions]);

  const completedAssignments = new Set(tries.map(t => t.questionGroupId)).size;

  return (
    <div className="space-y-6">
      <section className="rounded-card border border-ziad-line bg-ziad-panel p-5 shadow-soft">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <img src="/square_logo.png" alt={t("altLogo")} className="h-16 w-auto rounded-card" />
            <div>
              <p className="text-xs font-bold uppercase text-ziad-primary">{t("studentDashboard")}</p>
              <h1 className="text-2xl font-extrabold text-ziad-ink sm:text-3xl">{t("welcomeBackName").replace("{name}", user?.name || "")}</h1>
              <p className="mt-1 text-sm text-ziad-ink/62">{t("keepStreak")}</p>
            </div>
          </div>
          <div className="rounded-card border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800">
            <p className="text-xs font-bold uppercase">{selectedCourse ? t("deadline") : t("expiryCountdown")}</p>
            <p className="mt-1 text-xl font-extrabold">
              {countdown || (isCourseEnded ? t("courseEnded") : "—")}
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label={t("totalScore")} value={`${to800(totalScore)}/800`} icon={Trophy} helper={t("yourAverageScore")} />
        <StatCard label={t("weakPoints")} value={weakPointsCount} icon={AlertCircle} tone="amber" helper={t("skillsNeedReview")} />
        <StatCard label={t("mistakes")} value={mistakeCount} icon={Flame} tone="red" helper={t("storedForReview")} />
        <StatCard label={t("completedAssignments")} value={completedAssignments} icon={CheckCircle2} tone="blue" helper={t("acrossAllCategories")} />
      </div>

      {/* Student Rank Card */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard 
          label={t("yourRankLabel")} 
          value={studentStats?.studentRank && studentStats.rankedStudents > 0 ? `#${studentStats.studentRank}` : "—"} 
          icon={Trophy} 
          tone={studentStats?.studentRank === 1 ? "green" : "blue"} 
          helper={studentStats?.rankedStudents ? t("outOfStudents").replace("{count}", String(studentStats.rankedStudents)) : t("noRankingYet")} 
        />
      </div>

      {nextSession ? (
        <section className="rounded-card border border-ziad-line bg-ziad-panel p-5 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-button bg-ziad-light text-ziad-primary">
                <CalendarClock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-ziad-primary">{t("nextSession")}</p>
                <h2 className="text-lg font-extrabold text-ziad-ink">{nextSession.title || t("liveSession")}</h2>
                <p className="mt-1 text-sm font-semibold text-ziad-ink/62">{formatDateTime(nextSession.startTime)}</p>
              </div>
            </div>
            {nextSession.url ? (
              <a href={nextSession.url} target="_blank" rel="noreferrer" className="inline-flex h-10 items-center justify-center gap-2 rounded-button bg-ziad-primary px-4 text-sm font-extrabold text-ziad-light hover:bg-ziad-ink">
                <Video className="h-4 w-4" />
                {t("meetingLink")}
              </a>
            ) : null}
          </div>
        </section>
      ) : null}

      <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <ChartShell eyebrow={t("scoreTrend")} title={t("weeklyProgress")} helper={t("targetSeventyPercent")}>
          {triesLoading ? (
            <div className="mt-4 flex h-64 items-center justify-center"><Loader2 className="h-7 w-7 animate-spin text-ziad-primary" /></div>
          ) : progressSeries.length > 0 ? (
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={progressSeries} margin={{ left: -18, right: 12, top: 18, bottom: 0 }}>
                  <CartesianGrid stroke="#E1E7ED" strokeDasharray="4 4" vertical={false} />
                  <XAxis dataKey="attempt" tickLine={false} axisLine={false} tick={{ fill: "#39495c", fontSize: 12 }} />
                  <YAxis domain={[0, 800]} tickLine={false} axisLine={false} tick={{ fill: "#39495c", fontSize: 12 }} />
                  <ReferenceLine y={560} stroke="#d97706" strokeDasharray="5 5" label={{ value: "560", position: "insideTopRight", fill: "#92400e", fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{ borderRadius: 8, border: "1px solid #E1E7ED" }}
                    formatter={(value) => [`${value}/800`, t("scoreTooltip")]}
                    labelFormatter={(_, payload) => payload?.[0]?.payload?.title || t("attemptTooltip")}
                  />
                  <Line type="monotone" dataKey="score" stroke="#01219a" strokeWidth={3} dot={{ r: 4, fill: "#01219a", stroke: "#f7fafc", strokeWidth: 2 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyChart label={t("startQuizToSeeTrend")} />
          )}
        </ChartShell>

        <ChartShell eyebrow={t("accuracy")} title={t("correctVsMissed")} helper={t("quickLookAtAttempts")}>
          {triesLoading ? (
            <div className="mt-4 flex h-64 items-center justify-center"><Loader2 className="h-7 w-7 animate-spin text-ziad-primary" /></div>
          ) : answerSeries.length > 0 ? (
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={answerSeries} margin={{ left: -18, right: 12, top: 20, bottom: 0 }}>
                  <CartesianGrid stroke="#E1E7ED" strokeDasharray="4 4" vertical={false} />
                  <XAxis dataKey="attempt" tickLine={false} axisLine={false} tick={{ fill: "#39495c", fontSize: 12 }} />
                  <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fill: "#39495c", fontSize: 12 }} />
                  <Tooltip
                    cursor={{ fill: "rgba(1, 33, 154, 0.06)" }}
                    contentStyle={{ borderRadius: 8, border: "1px solid #E1E7ED" }}
                    labelFormatter={(_, payload) => payload?.[0]?.payload?.title || t("attemptTooltip")}
                  />
                  <Bar dataKey="correct" name={t("correctLabel")} stackId="answers" fill="#0f766e" radius={[0, 0, 4, 4]} />
                  <Bar dataKey="missed" name={t("missedLabel")} stackId="answers" fill="#be123c" radius={[8, 8, 0, 0]}>
                    <LabelList dataKey="correct" position="top" fill="#132236" fontSize={12} fontWeight={800} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyChart label={t("noAttemptsYet")} />
          )}
        </ChartShell>
      </section>

      <section className="rounded-card border border-ziad-line bg-ziad-panel p-5 shadow-sm">
        <p className="text-xs font-bold uppercase text-ziad-primary">{t("recentActivity")}</p>
        <h2 className="text-xl font-extrabold text-ziad-ink">{t("whatChanged")}</h2>
        <div className="mt-4">
          {triesLoading ? (
            <div className="flex min-h-28 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-ziad-primary" /></div>
          ) : latestAttempts.length > 0 ? (
            <div className="divide-y divide-ziad-line">
              {latestAttempts.map((attempt) => (
                <div key={attempt.id} className="grid gap-3 py-3 sm:grid-cols-[1fr_auto] sm:items-center">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-extrabold text-ziad-ink">{attempt.questionGroupTitle}</p>
                    <p className="mt-1 text-xs font-semibold text-ziad-ink/58">{formatDateTime(attempt.submittedAt)}</p>
                  </div>
                  <span className={`w-fit rounded-button border px-2.5 py-1 text-xs font-extrabold ${percentClass(to800(attempt.scorePercentage))}`}>
                    {to800(attempt.scorePercentage)}/800
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm font-medium italic text-ziad-ink/72">{t("noActivityFound")}</p>
          )}
        </div>
      </section>
    </div>
  );
}
