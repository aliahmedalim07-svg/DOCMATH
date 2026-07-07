import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronDown, Cookie, Database, Fingerprint, KeyRound, Lock, Mail, RefreshCw, Shield, Share2 } from "lucide-react";
import { useI18n } from "../../contexts/I18nContext";
import { GlassPanel, PageGlow, PublicFooter, PublicHeader, Reveal } from "./PublicPageChrome";

export default function PrivacyPolicyPage() {
  const { t, language, toggleLanguage } = useI18n();

  const sections = [
    { id: "collect", icon: Database, title: t("privacyCollectTitle"), desc: t("privacyCollectDesc"), summary: t("privacyCollectSummary") },
    { id: "use", icon: Fingerprint, title: t("privacyUseTitle"), desc: t("privacyUseDesc"), summary: t("privacyUseSummary") },
    { id: "protect", icon: Lock, title: t("privacyProtectTitle"), desc: t("privacyProtectDesc"), summary: t("privacyProtectSummary") },
    { id: "share", icon: Share2, title: t("privacyShareTitle"), desc: t("privacyShareDesc"), summary: t("privacyShareSummary") },
    { id: "cookies", icon: Cookie, title: t("privacyCookiesTitle"), desc: t("privacyCookiesDesc"), summary: t("privacyCookiesSummary") },
    { id: "changes", icon: RefreshCw, title: t("privacyChangesTitle"), desc: t("privacyChangesDesc"), summary: t("privacyChangesSummary") },
  ];

  return (
    <PageGlow>
      <PublicHeader t={t} language={language} toggleLanguage={toggleLanguage} />

      <main>
        <section className="px-4 pb-12 pt-12 sm:px-6 lg:px-8 lg:pt-16">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <p className="text-sm font-black uppercase tracking-[0.28em] text-ziad-primary">{t("privacyHub")}</p>
              <h1 className="mt-5 text-5xl font-black leading-[0.98] tracking-tight text-ziad-ink sm:text-6xl">
                {t("privacyTitle")}
              </h1>
              <p className="mt-6 max-w-2xl text-lg font-medium leading-8 text-ziad-ink/74">{t("privacyIntro")}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                {[t("studentFirst"), t("noDataSelling"), t("secureByDesign")].map((badge) => (
                  <span key={badge} className="rounded-full border border-ziad-line bg-white px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-ziad-primary shadow-sm">
                    {badge}
                  </span>
                ))}
              </div>
            </motion.div>

            <GlassPanel className="relative overflow-hidden rounded-[1.5rem] p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-card border border-ziad-line bg-white p-5 shadow-sm">
                  <Shield className="h-9 w-9 text-ziad-primary" />
                  <p className="mt-8 text-3xl font-black text-ziad-ink">{t("privacySectionLabel")}</p>
                  <p className="mt-2 text-sm font-semibold leading-6 text-ziad-ink/72">{t("privacySectionDesc")}</p>
                </div>
                <div className="space-y-3">
                  {[
                    { icon: KeyRound, label: t("accessAware") },
                    { icon: Database, label: t("minimalCollection") },
                    { icon: Mail, label: t("humanContactPath") },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-3 rounded-card border border-ziad-line bg-white p-4 shadow-sm">
                      <item.icon className="h-5 w-5 text-ziad-primary" />
                      <span className="text-sm font-black text-ziad-ink">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </GlassPanel>
          </div>
        </section>

        <section className="px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[280px_1fr]">
            <aside className="lg:sticky lg:top-24 lg:h-fit">
              <GlassPanel className="rounded-card p-4">
                <p className="px-2 text-xs font-black uppercase tracking-[0.18em] text-ziad-ink/70">{t("sectionsLabel")}</p>
                <nav className="mt-3 space-y-1">
                  {sections.map((section) => (
                    <a key={section.id} href={`#${section.id}`} className="flex items-center gap-2 rounded-button px-3 py-2 text-sm font-bold text-ziad-ink/76 transition hover:bg-white hover:text-ziad-ink">
                      <section.icon className="h-4 w-4 text-ziad-primary" />
                      {section.title}
                    </a>
                  ))}
                </nav>
              </GlassPanel>
            </aside>

            <div className="space-y-4">
              {sections.map((section, index) => (
                <Reveal key={section.id} delay={index * 0.03}>
                  <details id={section.id} open={index < 2} className="group rounded-card border border-ziad-line bg-white p-5 shadow-soft">
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
                      <div className="flex gap-4">
                        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-button bg-ziad-light text-ziad-primary ring-1 ring-ziad-line">
                          <section.icon className="h-5 w-5" />
                        </span>
                        <div>
                          <h2 className="text-xl font-black text-ziad-ink">{section.title}</h2>
                          <p className="mt-1 text-sm font-semibold text-ziad-primary/76">{section.summary}</p>
                        </div>
                      </div>
                      <ChevronDown className="mt-2 h-5 w-5 shrink-0 text-ziad-ink/68 transition group-open:rotate-180" />
                    </summary>
                    <motion.p
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      className="mt-5 max-w-3xl text-base font-medium leading-8 text-ziad-ink/74"
                    >
                      {section.desc}
                    </motion.p>
                  </details>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <Reveal>
            <div className="mx-auto max-w-7xl rounded-[1.5rem] border border-ziad-line bg-white p-8 shadow-soft sm:p-10">
              <Mail className="h-8 w-8 text-ziad-primary" />
              <h2 className="mt-5 text-3xl font-black text-ziad-ink">{t("privacyContactTitle")}</h2>
              <p className="mt-3 max-w-2xl text-base font-medium leading-8 text-ziad-ink/72">{t("privacyContactDesc")}</p>
              <Link to="/login" className="mt-7 inline-flex h-11 items-center justify-center rounded-button bg-ziad-primary px-6 text-sm font-black text-white transition hover:bg-ziad-accent">
                {t("login")}
              </Link>
            </div>
          </Reveal>
        </section>
      </main>

      <PublicFooter t={t} />
    </PageGlow>
  );
}
