import { AlertTriangle, MessageCircle } from "lucide-react";
import { useI18n } from "../contexts/I18nContext";
import { formatDateTime, getExpiryStatus } from "../lib/utils";

interface AccountExpiryBannerProps {
  expiresAt?: string | null;
}

export function AccountExpiryBanner({ expiresAt }: AccountExpiryBannerProps) {
  const { t, language } = useI18n();
  const status = getExpiryStatus(expiresAt);

  if (!expiresAt || status.expired || !status.withinSevenDays) return null;

  return (
    <div className="mb-5 flex flex-col gap-3 rounded-card border border-red-200 bg-red-50 px-4 py-3 text-red-800 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
        <p className="text-sm font-semibold">
          {t("accountExpiresIn").replace("{days}", String(status.daysLeft)).replace("{date}", formatDateTime(expiresAt, language))}
        </p>
      </div>
      <a
        href="tel:+201234567890"
        className="inline-flex items-center justify-center gap-2 rounded-button bg-red-700 px-3 py-2 text-sm font-bold text-red-50 transition hover:bg-red-800"
      >
        <MessageCircle className="h-4 w-4" />
        {t("contactTeacher")}
      </a>
    </div>
  );
}

export function ExpiredAccountBlock({ expiresAt }: AccountExpiryBannerProps) {
  const { t, language } = useI18n();
  return (
    <div className="grid min-h-[70vh] place-items-center px-4">
      <section className="max-w-lg rounded-card border border-red-200 bg-red-50 p-6 text-center shadow-soft">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-red-100 text-red-700">
          <AlertTriangle className="h-8 w-8" />
        </div>
        <h1 className="mt-5 text-2xl font-extrabold text-red-900">{t("accountExpired")}</h1>
        <p className="mt-3 text-sm leading-6 text-red-800">
          {t("studentAccountExpired").replace("{date}", expiresAt ? ` on ${formatDateTime(expiresAt, language)}` : "")}
        </p>
        <a
          href="tel:+201234567890"
          className="mt-5 inline-flex items-center justify-center gap-2 rounded-button bg-red-700 px-4 py-2.5 text-sm font-bold text-red-50 transition hover:bg-red-800"
        >
          <MessageCircle className="h-4 w-4" />
          {t("contactTeacher")}
        </a>
      </section>
    </div>
  );
}

export function NoRolesBanner() {
  const { t } = useI18n();
  return (
    <div className="mb-5 flex flex-col gap-3 rounded-card border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
        <p className="text-sm font-semibold">{t("noAccessYet")}</p>
      </div>
    </div>
  );
}

