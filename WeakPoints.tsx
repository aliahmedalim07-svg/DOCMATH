import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Ban,
  Bookmark,
  CheckCircle,
  ChevronDown,
  CreditCard,
  FileText,
  Gavel,
  Mail,
  RefreshCw,
  Scale,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { useI18n } from "../../contexts/I18nContext";
import { GlassPanel, PageGlow, PublicFooter, PublicHeader, Reveal } from "./PublicPageChrome";

export default function TermsOfServicePage() {
  const { t, language, toggleLanguage } = useI18n();

  const sections = [
    { id: "accept", icon: CheckCircle, title: t("termsAcceptTitle"), desc: t("termsAcceptDesc"), tag: t("tagStartHere") },
    { id: "accounts", icon: UserCheck, title: t("termsUseTitle"), desc: t("termsUseDesc"), tag: t("tagAccounts") },
    { id: "conduct", icon: Gavel, title: t("termsConductTitle"), desc: t("termsConductDesc"), tag: t("tagCommunity") },
    { id: "content", icon: Bookmark, title: t("termsContentTitle"), desc: t("termsContentDesc"), tag: t("tagMaterials") },
    { id: "payment", icon: CreditCard, title: t("termsPaymentTitle"), desc: t("termsPaymentDesc"), tag: t("tagBilling") },
    { id: "termination", icon: Ban, title: t("termsTerminationTitle"), desc: t("termsTerminationDesc"), tag: t("tagAccess") },
    { id: "liability", icon: AlertTriangle, title: t("termsLiabilityTitle"), desc: t("termsLiabilityDesc"), tag: t("tagLimits") },
    { id: "changes", icon: RefreshCw, title: t("termsChangesTitle"), desc: t("termsChangesDesc"), tag: t("tagUpdates") },
  ];

  return (
    <PageGlow>
      <PublicHeader t={t} language={language} toggleLanguage={toggleLanguage} />

      <main>
        <section className="px-4 pb-12 pt-12 sm:px-6 lg:px-8 lg:pt-16">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <p className="text-sm font-black uppercase tracking-[0.28em] text-ziad-primary">{t("interactiveTermsCenter")}</p>
              <h1 className="mt-5 text-5xl font-black leading-[0.98] tracking-tight text-ziad-ink sm:text-6xl">
                {t("termsTitle")}
              </h1>
              <p className="mt-6 max-w-2xl text-lg font-medium leading-8 text-ziad-ink/74">{t("termsIntro")}</p>
            </motion.div>

            <GlassPanel className="rounded-[1.5rem] p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-card border border-ziad-line bg-white p-5 shadow-sm">
                  <Scale className="h-9 w-9 text-ziad-primary" />
                  <p className="mt-8 text-2xl font-black text-ziad-ink">{t("readableRules")}</p>
                  <p className="mt-2 text-sm font-semibold leading-6 text-ziad-ink/72">{t("readableRulesDesc")}</p>
                </div>
                <div className="rounded-card border border-ziad-line bg-ziad-panel p-5">
                  <ShieldCheck className="h-9 w-9 text-ziad-primary" />
                  <p className="mt-8 text-2xl font-black text-ziad-ink">{t("fairAccess")}</p>
                  <p className="mt-2 text-sm font-semibold leading-6 text-ziad-ink/72">{t("fairAccessDesc")}</p>
                </div>
              </div>
            </GlassPanel>
          </div>
        </section>

        <section className="px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[280px_1fr]">
            <aside className="lg:sticky lg:top-24 lg:h-fit">
              <GlassPanel className="rounded-card p-4">
                <p className="px-2 text-xs font-black uppercase tracking-[0.18em] text-ziad-ink/70">{t("termsMap")}</p>
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
              <Reveal>
                <div className="rounded-card border border-ziad-line bg-white p-5 shadow-soft">
                  <div className="flex gap-3">
                    <FileText className="h-6 w-6 shrink-0 text-ziad-primary" />
                    <div>
                      <p className="text-lg font-black text-ziad-ink">{t("quickLegalSummary")}</p>
                      <p className="mt-2 text-sm font-medium leading-7 text-ziad-ink/72">
                        {t("quickLegalDesc")}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>

              {sections.map((section, index) => (
                <Reveal key={section.id} delay={index * 0.03}>
                  <details id={section.id} open={index < 2} className="group rounded-card border border-ziad-line bg-white p-5 shadow-soft">
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
                      <div className="flex gap-4">
                        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-button bg-ziad-light text-ziad-primary ring-1 ring-ziad-line">
                          <section.icon className="h-5 w-5" />
                        </span>
                        <div>
                          <span className="rounded-full bg-ziad-panel px-2 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-ziad-primary">{section.tag}</span>
                          <h2 className="mt-2 text-xl font-black text-ziad-ink">{section.title}</h2>
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
              <h2 className="mt-5 text-3xl font-black text-ziad-ink">{t("termsContactTitle")}</h2>
              <p className="mt-3 max-w-2xl text-base font-medium leading-8 text-ziad-ink/72">{t("termsContactDesc")}</p>
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
