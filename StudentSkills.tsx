import { type ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Languages, LayoutDashboard } from "lucide-react";
import type { TranslationKey } from "../../contexts/I18nContext";
import type { UserProfile } from "../../lib/types";
import { dashboardPathForAccess } from "../../lib/utils";

type TFn = (key: TranslationKey) => string;

export function PublicHeader({
  t,
  language,
  toggleLanguage,
  user,
}: {
  t: TFn;
  language: string;
  toggleLanguage: () => void;
  user?: UserProfile | null;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-ziad-line/80 bg-ziad-panel/86 shadow-sm backdrop-blur-2xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="group flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-button border border-ziad-line bg-white text-xs font-black text-ziad-primary shadow-soft">
            {t("brandDr")}
          </span>
          <span className="text-base font-black tracking-tight text-ziad-ink transition group-hover:text-ziad-primary sm:text-lg">
            {t("appName")}
          </span>
        </Link>
        <nav aria-label={t("mainNavigation")} className="flex items-center gap-2 sm:gap-3">
          <Link to="/about" aria-label={t("about")} className="hidden text-sm font-bold text-ziad-ink/68 transition hover:text-ziad-ink sm:inline">
            {t("about")}
          </Link>
          <Link to="/privacy" className="hidden text-sm font-bold text-ziad-ink/68 transition hover:text-ziad-ink md:inline">
            {t("footerPrivacy")}
          </Link>
          <button
            type="button"
            onClick={toggleLanguage}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-button border border-ziad-line bg-white px-3 text-sm font-bold text-ziad-ink shadow-sm transition hover:-translate-y-0.5 hover:bg-ziad-light"
          >
            <Languages className="h-4 w-4" />
            {language === "en" ? t("languageAr") : t("languageEnglish")}
          </button>
          {user ? (
            <Link
              to={dashboardPathForAccess(user.accountType, [])}
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-button bg-ziad-primary px-4 text-sm font-black text-white shadow-lift transition hover:-translate-y-0.5 hover:bg-ziad-accent"
            >
              <LayoutDashboard aria-hidden="true" className="h-4 w-4" />
              {t("dashboard")}
            </Link>
          ) : (
            <Link
              to="/login"
              className="inline-flex h-9 items-center justify-center rounded-button bg-ziad-primary px-4 text-sm font-black text-white shadow-lift transition hover:-translate-y-0.5 hover:bg-ziad-accent"
            >
              {t("login")}
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

export function PublicFooter({ t }: { t: TFn }) {
  return (
    <footer className="border-t border-ziad-line bg-white py-10 text-ziad-ink">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <p className="text-sm font-black text-ziad-ink">{t("appName")}</p>
          <p className="mt-1 text-xs font-semibold text-ziad-ink/70">{t("copyrightFooter")}</p>
        </div>
        <nav aria-label={t("footerNavigation")} className="flex flex-wrap gap-4 text-sm font-bold text-ziad-ink/62">
          <Link to="/about" aria-label={t("about")} className="transition hover:text-ziad-ink">{t("about")}</Link>
          <Link to="/privacy" className="transition hover:text-ziad-ink">{t("footerPrivacy")}</Link>
          <Link to="/terms" className="transition hover:text-ziad-ink">{t("footerTerms")}</Link>
          <Link to="/login" className="transition hover:text-ziad-ink">{t("homeLogin")}</Link>
        </nav>
      </div>
    </footer>
  );
}

export function PageGlow({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen overflow-hidden bg-ziad-light text-ziad-ink">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_9%,rgba(209,218,227,0.72),transparent_28%),radial-gradient(circle_at_85%_18%,rgba(247,249,251,0.9),transparent_24%),linear-gradient(180deg,#EDF1F5_0%,#F7F9FB_48%,#EDF1F5_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(57,73,89,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(57,73,89,0.04)_1px,transparent_1px)] bg-[size:44px_44px] opacity-40" />
      </div>
      {children}
    </div>
  );
}

export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function GlassPanel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`border border-white/70 bg-white/72 shadow-soft backdrop-blur-xl ${className}`}>
      {children}
    </div>
  );
}
