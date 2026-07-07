import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  BookOpenCheck,
  Brain,
  CalendarClock,
  CheckCircle2,
  GraduationCap,
  LineChart,
  LockKeyhole,
  PlayCircle,
  ShieldCheck,
  Sigma,
  Sparkles,
  Target,
  Trophy,
  UsersRound,
} from "lucide-react";
import { useI18n } from "../../contexts/I18nContext";
import { useAuth } from "../../contexts/AuthContext";
import { GlassPanel, PageGlow, PublicFooter, PublicHeader, Reveal } from "./PublicPageChrome";

const en = {
  badge: "Math IG private learning platform",
  title: "Dr. Ziad Mohamed Math IG",
  subtitle:
    "A clean, focused LMS for IGCSE Mathematics: lessons, homework, past papers, weekly exams, progress tracking, and parent visibility in one professional platform.",
  primary: "Student login",
  secondary: "See system",
  trusted: "Built only for Math IG",
  stats: [
    ["IGCSE", "Core & Extended"],
    ["24/7", "Student access"],
    ["Live", "Progress tracking"],
  ],
  dashboard: "Student cockpit",
  currentTopic: "Current focus",
  topic: "Quadratics & Functions",
  weekly: "Weekly checkpoint",
  paper: "Past Paper Training",
  homework: "Homework submitted",
  accuracy: "Accuracy trend",
  activeStudents: "Active students",
  parentReports: "Parent reports",
  featuresLabel: "What the platform does",
  featuresTitle: "Everything Dr. Ziad needs to manage Math IG professionally.",
  features: [
    ["Smart course structure", "Organize Core, Extended, revision, worksheets, videos, and PDFs by topic and level."],
    ["Homework & weekly exams", "Create assignments and checkpoint exams, then track scores and mistakes automatically."],
    ["Question bank", "Build a reusable IGCSE Math bank with choices, images, explanations, and topic tagging."],
    ["Student analytics", "See weak points, daily activity, attempts, accuracy, and progress from the admin dashboard."],
    ["Parent dashboard", "Let parents follow their child’s progress without giving them admin permissions."],
    ["Secure deployment", "Frontend, backend, and PostgreSQL are ready to deploy with Docker Compose."],
  ],
  workflowLabel: "Course flow",
  workflowTitle: "A simple learning cycle that fits Math IG.",
  steps: [
    ["01", "Watch lesson", "Student opens the lesson video and attached PDF."],
    ["02", "Solve homework", "The platform records attempts, answers, and score."],
    ["03", "Review mistakes", "Weak topics appear clearly for student, parent, and admin."],
    ["04", "Past paper practice", "Final revision is organized by paper, topic, and difficulty."],
  ],
  ctaTitle: "Ready for deployment",
  ctaText: "This version keeps only the needed app structure: frontend, backend, PostgreSQL, and simple Docker deployment files.",
  ctaButton: "Open dashboard",
};

const ar = {
  badge: "منصة خاصة لتدريس Math IG",
  title: "منصة دكتور زياد محمد — Math IG",
  subtitle:
    "منصة تعليمية نظيفة ومركزة لرياضيات IGCSE: حصص، واجبات، Past Papers، امتحانات أسبوعية، متابعة مستوى الطالب، ولوحة متابعة لولي الأمر في مكان واحد.",
  primary: "دخول الطالب",
  secondary: "شوف النظام",
  trusted: "مخصصة لرياضيات IG فقط",
  stats: [
    ["IGCSE", "Core & Extended"],
    ["24/7", "دخول للطالب"],
    ["Live", "متابعة التقدم"],
  ],
  dashboard: "لوحة الطالب",
  currentTopic: "التركيز الحالي",
  topic: "Quadratics & Functions",
  weekly: "امتحان أسبوعي",
  paper: "تدريب Past Papers",
  homework: "واجبات محلولة",
  accuracy: "تطور الدقة",
  activeStudents: "طلاب نشطين",
  parentReports: "تقارير ولي الأمر",
  featuresLabel: "إمكانيات المنصة",
  featuresTitle: "كل اللي دكتور زياد محتاجه لإدارة Math IG بشكل احترافي.",
  features: [
    ["تنظيم الكورسات", "تقسيم Core وExtended والمراجعات والملفات والفيديوهات حسب التوبك والمستوى."],
    ["واجبات وامتحانات أسبوعية", "إنشاء واجبات وCheckpoint exams مع تسجيل الدرجة والأخطاء تلقائيًا."],
    ["بنك أسئلة", "بناء بنك أسئلة IGCSE Math بالاختيارات والصور والشرح وتصنيف التوبكات."],
    ["تحليل مستوى الطالب", "متابعة نقاط الضعف والنشاط اليومي والمحاولات ونسبة الدقة من لوحة الأدمن."],
    ["لوحة ولي الأمر", "ولي الأمر يتابع ابنه بدون صلاحيات أدمن وبدون تعقيد."],
    ["جاهز للرفع", "Frontend وBackend وPostgreSQL جاهزين للتشغيل والرفع بـ Docker Compose."],
  ],
  workflowLabel: "نظام الدراسة",
  workflowTitle: "دورة تعلم بسيطة مناسبة لرياضيات IG.",
  steps: [
    ["01", "يشاهد الحصة", "الطالب يفتح فيديو الحصة والملف المرفق."],
    ["02", "يحل الواجب", "المنصة تسجل المحاولات والإجابات والدرجة."],
    ["03", "يراجع الأخطاء", "نقاط الضعف تظهر بوضوح للطالب وولي الأمر والأدمن."],
    ["04", "يتدرب Past Papers", "المراجعة النهائية منظمة حسب الورقة والتوبك ومستوى الصعوبة."],
  ],
  ctaTitle: "جاهز للديبلوي",
  ctaText: "النسخة دي فيها الملفات المهمة فقط: Frontend وBackend وPostgreSQL وملفات تشغيل Docker بسيطة.",
  ctaButton: "افتح لوحة التحكم",
};

export default function HomePage() {
  const { t, language, toggleLanguage } = useI18n();
  const { user } = useAuth();
  const copy = language === "ar" ? ar : en;

  const icons = [BookOpenCheck, CalendarClock, Brain, LineChart, UsersRound, ShieldCheck];

  return (
    <PageGlow>
      <PublicHeader t={t} language={language} toggleLanguage={toggleLanguage} user={user} />

      <main>
        <section className="relative px-4 pb-16 pt-12 sm:px-6 lg:px-8 lg:pb-24 lg:pt-18">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="inline-flex items-center gap-2 rounded-full border border-ziad-line bg-white/85 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-ziad-primary shadow-sm"
              >
                <Sparkles className="h-4 w-4" />
                {copy.badge}
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08, duration: 0.6 }}
                className="mt-7 max-w-4xl text-5xl font-black leading-[0.96] tracking-tight text-ziad-ink sm:text-6xl lg:text-7xl"
              >
                {copy.title}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.16, duration: 0.6 }}
                className="mt-6 max-w-2xl text-lg font-semibold leading-8 text-ziad-ink/68"
              >
                {copy.subtitle}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.24, duration: 0.6 }}
                className="mt-9 flex flex-col gap-3 sm:flex-row"
              >
                <Link to="/login" className="inline-flex h-12 items-center justify-center gap-2 rounded-button bg-ziad-primary px-6 text-sm font-black text-white shadow-lift transition hover:-translate-y-0.5 hover:bg-ziad-accent">
                  {copy.primary}
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Link>
                <a href="#system" className="inline-flex h-12 items-center justify-center gap-2 rounded-button border border-ziad-line bg-white px-6 text-sm font-black text-ziad-ink shadow-sm transition hover:-translate-y-0.5 hover:bg-ziad-light">
                  <PlayCircle aria-hidden="true" className="h-4 w-4" />
                  {copy.secondary}
                </a>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.32, duration: 0.6 }}
                className="mt-10 grid max-w-xl grid-cols-3 gap-3"
              >
                {copy.stats.map(([value, label]) => (
                  <div key={label} className="rounded-card border border-ziad-line bg-white/80 p-4 shadow-sm">
                    <p className="text-2xl font-black text-ziad-ink">{value}</p>
                    <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-ziad-ink/64">{label}</p>
                  </div>
                ))}
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 30, rotate: 0.8 }}
              animate={{ opacity: 1, x: 0, rotate: 0 }}
              transition={{ delay: 0.18, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              <GlassPanel className="relative overflow-hidden rounded-[2rem] p-4">
                <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-r from-ziad-mint via-white to-ziad-light" />
                <div className="relative rounded-[1.5rem] border border-ziad-line bg-white p-5 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.2em] text-ziad-primary/72">{copy.trusted}</p>
                      <h2 className="mt-2 text-2xl font-black text-ziad-ink">{copy.dashboard}</h2>
                    </div>
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700 ring-1 ring-emerald-200">Online</span>
                  </div>

                  <div className="mt-6 grid gap-4 md:grid-cols-[1fr_0.8fr]">
                    <div className="rounded-card border border-ziad-line bg-ziad-panel p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-black uppercase tracking-[0.16em] text-ziad-primary">{copy.currentTopic}</p>
                          <p className="mt-1 text-lg font-black text-ziad-ink">{copy.topic}</p>
                        </div>
                        <Sigma className="h-7 w-7 text-ziad-primary" />
                      </div>
                      <div className="mt-6 flex h-36 items-end gap-2">
                        {[42, 58, 51, 74, 68, 89, 83, 96].map((height, index) => (
                          <motion.div
                            key={index}
                            initial={{ height: 12 }}
                            animate={{ height }}
                            transition={{ delay: 0.45 + index * 0.05, duration: 0.55 }}
                            className="flex-1 rounded-t-lg bg-gradient-to-t from-ziad-primary to-ziad-mint"
                          />
                        ))}
                      </div>
                      <p className="mt-3 text-sm font-bold text-ziad-ink/68">{copy.accuracy}</p>
                    </div>

                    <div className="space-y-3">
                      {[
                        [copy.weekly, "92%", Target],
                        [copy.paper, "18", Trophy],
                        [copy.homework, "134", CheckCircle2],
                      ].map(([label, value, Icon]) => {
                        const TypedIcon = Icon as typeof Target;
                        return (
                          <div key={label as string} className="rounded-card border border-ziad-line bg-white p-4 shadow-sm">
                            <div className="flex items-center gap-3">
                              <span className="grid h-10 w-10 place-items-center rounded-button bg-ziad-light text-ziad-primary ring-1 ring-ziad-line">
                                <TypedIcon className="h-5 w-5" />
                              </span>
                              <div>
                                <p className="text-2xl font-black text-ziad-ink">{value as string}</p>
                                <p className="text-xs font-bold text-ziad-ink/68">{label as string}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </GlassPanel>

              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -left-5 top-12 hidden rounded-card border border-ziad-line bg-white p-4 shadow-lift lg:block"
              >
                <BarChart3 className="h-5 w-5 text-ziad-primary" />
                <p className="mt-3 text-sm font-black text-ziad-ink">{copy.activeStudents}</p>
                <p className="text-xs font-semibold text-ziad-ink/72">{copy.parentReports}</p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <section id="system" className="px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <Reveal className="max-w-3xl">
              <p className="text-sm font-black uppercase tracking-[0.24em] text-ziad-primary">{copy.featuresLabel}</p>
              <h2 className="mt-3 text-4xl font-black tracking-tight text-ziad-ink sm:text-5xl">{copy.featuresTitle}</h2>
            </Reveal>

            <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {copy.features.map(([title, desc], index) => {
                const Icon = icons[index];
                return (
                  <Reveal key={title} delay={index * 0.04}>
                    <div className="h-full rounded-card border border-ziad-line bg-white p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-lift">
                      <span className="grid h-12 w-12 place-items-center rounded-button bg-ziad-light text-ziad-primary ring-1 ring-ziad-line">
                        <Icon className="h-6 w-6" />
                      </span>
                      <h3 className="mt-5 text-xl font-black text-ziad-ink">{title}</h3>
                      <p className="mt-3 text-sm font-semibold leading-7 text-ziad-ink/68">{desc}</p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        <section className="px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl rounded-[2rem] border border-ziad-line bg-white p-6 shadow-soft sm:p-8 lg:p-10">
            <Reveal className="max-w-3xl">
              <p className="text-sm font-black uppercase tracking-[0.24em] text-ziad-primary">{copy.workflowLabel}</p>
              <h2 className="mt-3 text-4xl font-black tracking-tight text-ziad-ink sm:text-5xl">{copy.workflowTitle}</h2>
            </Reveal>
            <div className="mt-10 grid gap-4 lg:grid-cols-4">
              {copy.steps.map(([num, title, desc]) => (
                <div key={num} className="rounded-card border border-ziad-line bg-ziad-panel p-5">
                  <p className="text-sm font-black text-ziad-primary">{num}</p>
                  <h3 className="mt-4 text-lg font-black text-ziad-ink">{title}</h3>
                  <p className="mt-2 text-sm font-semibold leading-7 text-ziad-ink/68">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 pb-20 pt-10 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] bg-ziad-primary p-8 text-white shadow-lift sm:p-10 lg:p-12">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] ring-1 ring-white/20">
                  <LockKeyhole className="h-4 w-4" />
                  Deploy-ready
                </div>
                <h2 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl">{copy.ctaTitle}</h2>
                <p className="mt-3 max-w-2xl text-sm font-semibold leading-7 text-white/76">{copy.ctaText}</p>
              </div>
              <Link to="/login" className="inline-flex h-12 items-center justify-center gap-2 rounded-button bg-white px-6 text-sm font-black text-ziad-primary shadow-soft transition hover:-translate-y-0.5">
                <GraduationCap className="h-4 w-4" />
                {copy.ctaButton}
              </Link>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter t={t} />
    </PageGlow>
  );
}
