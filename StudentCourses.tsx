import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, BarChart3, Brain, CheckCircle2, Headphones, Lightbulb, Rocket, Target, Telescope } from "lucide-react";
import { useI18n } from "../../contexts/I18nContext";
import { GlassPanel, PageGlow, PublicFooter, PublicHeader, Reveal } from "./PublicPageChrome";

export default function AboutPage() {
  const { t, language, toggleLanguage } = useI18n();

  const features = [t("aboutFeature1"), t("aboutFeature2"), t("aboutFeature3"), t("aboutFeature4")];
  const journey = [
    { title: t("diagnose"), desc: t("diagnoseDesc"), icon: Target },
    { title: t("aboutFeature2"), desc: t("aboutFeature2"), icon: Brain },
    { title: t("reviewStep"), desc: t("reviewStepDesc"), icon: Lightbulb },
    { title: t("aboutFeature4"), desc: t("aboutFeature4"), icon: BarChart3 },
  ];

  return (
    <PageGlow>
      <PublicHeader t={t} language={language} toggleLanguage={toggleLanguage} />

      <main>
        <section className="px-4 pb-14 pt-12 sm:px-6 lg:px-8 lg:pt-16">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <p className="text-sm font-black uppercase tracking-[0.28em] text-ziad-primary">{t("aboutThePlatform")}</p>
              <h1 className="mt-5 max-w-3xl text-5xl font-black leading-[0.98] tracking-tight text-ziad-ink sm:text-6xl">
                {t("aboutTitle")}
              </h1>
              <p className="mt-6 max-w-2xl text-lg font-medium leading-8 text-ziad-ink/74">{t("aboutMissionDesc")}</p>
            </motion.div>

            <GlassPanel className="rounded-[1.5rem] p-5">
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  ["86%", t("avgClarityGain")],
                  ["2x", t("fasterReviewLoop")],
                  ["360°", t("parentVisibility")],
                ].map(([value, label]) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="rounded-card border border-ziad-line bg-white p-5 shadow-sm"
                  >
                    <p className="text-4xl font-black text-ziad-ink">{value}</p>
                    <p className="mt-2 text-xs font-black uppercase tracking-[0.16em] text-ziad-ink/68">{label}</p>
                  </motion.div>
                ))}
              </div>
            </GlassPanel>
          </div>
        </section>

        <section className="px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[1.1fr_0.9fr]">
            <Reveal>
              <GlassPanel className="h-full rounded-[1.5rem] p-8">
                <Target className="h-9 w-9 text-ziad-primary" />
                <h2 className="mt-6 text-4xl font-black text-ziad-ink">{t("aboutMissionTitle")}</h2>
                <p className="mt-4 max-w-2xl text-base font-medium leading-8 text-ziad-ink/72">{t("aboutMissionDesc")}</p>
                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  {features.slice(0, 2).map((item) => (
                    <div key={item} className="rounded-card border border-ziad-line bg-white p-4 text-sm font-bold leading-6 text-ziad-ink/68 shadow-sm">
                      {item}
                    </div>
                  ))}
                </div>
              </GlassPanel>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="h-full rounded-[1.5rem] border border-ziad-line bg-white p-8 shadow-soft">
                <Telescope className="h-9 w-9 text-ziad-primary" />
                <h2 className="mt-6 text-3xl font-black text-ziad-ink">{t("aboutVisionTitle")}</h2>
                <p className="mt-4 text-base font-medium leading-8 text-ziad-ink/72">{t("aboutVisionDesc")}</p>
                <div className="mt-8 space-y-3">
                  {features.slice(2).map((item) => (
                    <div key={item} className="flex gap-3 rounded-card bg-ziad-panel p-4">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-ziad-primary" />
                      <p className="text-sm font-bold leading-6 text-ziad-ink/70">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <Reveal className="max-w-2xl">
              <p className="text-sm font-black uppercase tracking-[0.24em] text-ziad-primary">{t("learningJourney")}</p>
              <h2 className="mt-3 text-4xl font-black tracking-tight text-ziad-ink">{t("aboutFeaturesTitle")}</h2>
            </Reveal>
            <div className="relative mt-12 grid gap-4 lg:grid-cols-4">
              <div className="absolute left-0 right-0 top-10 hidden h-px bg-gradient-to-r from-transparent via-ziad-line to-transparent lg:block" />
              {journey.map((step, index) => {
                const Icon = step.icon;
                return (
                  <Reveal key={step.title} delay={index * 0.06}>
                    <motion.div whileHover={{ y: -5 }} className="relative rounded-card border border-ziad-line bg-white p-5 shadow-soft">
                      <span className="grid h-12 w-12 place-items-center rounded-button bg-ziad-primary text-white shadow-lift">
                        <Icon className="h-6 w-6" />
                      </span>
                      <p className="mt-5 text-xl font-black text-ziad-ink">{step.title}</p>
                      <p className="mt-2 text-sm font-medium leading-6 text-ziad-ink/72">{step.desc}</p>
                    </motion.div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <Reveal>
            <div className="mx-auto max-w-7xl overflow-hidden rounded-[1.5rem] border border-ziad-line bg-white p-8 shadow-soft sm:p-10">
              <div className="grid gap-8 lg:grid-cols-[0.8fr_1fr] lg:items-center">
                <div>
                  <Headphones className="h-9 w-9 text-ziad-primary" />
                  <h2 className="mt-5 text-4xl font-black text-ziad-ink">{t("aboutContactTitle")}</h2>
                  <p className="mt-4 text-lg font-medium leading-8 text-ziad-ink/72">{t("aboutContactDesc")}</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Link to="/login" className="group rounded-card border border-ziad-line bg-ziad-primary px-5 py-6 text-white shadow-lift transition hover:-translate-y-1 hover:bg-ziad-accent">
                    <Rocket aria-hidden="true" className="h-6 w-6" />
                    <p className="mt-4 text-lg font-black">{t("login")}</p>
                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-black">
                      {t("openDashboard")} <ArrowRight aria-hidden="true" className="h-4 w-4 transition group-hover:translate-x-1" />
                    </span>
                  </Link>
                  <Link to="/register" className="group rounded-card border border-ziad-line bg-ziad-panel px-5 py-6 text-ziad-ink transition hover:-translate-y-1 hover:bg-ziad-light">
                    <span className="grid h-6 w-6 place-items-center rounded-button bg-white text-ziad-primary ring-1 ring-ziad-line">
                      <Rocket aria-hidden="true" className="h-4 w-4" />
                    </span>
                    <p className="mt-4 text-lg font-black">{t("homeRegister")}</p>
                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-black text-ziad-primary">
                      {t("startLearning")} <ArrowRight aria-hidden="true" className="h-4 w-4 transition group-hover:translate-x-1" />
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      <PublicFooter t={t} />
    </PageGlow>
  );
}
