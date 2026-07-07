import { motion } from "framer-motion";
import { useI18n } from "../contexts/I18nContext";

export function MascotLoader({ label }: { label?: string }) {
  const { t } = useI18n();
  const displayLabel = label ?? t("thinkingLabel");
  return (
    <div className="grid min-h-[280px] place-items-center text-center">
      <div className="space-y-4">
        <motion.img
          src="/square_logo.png"
          alt={t("logoAlt")}
          className="mx-auto h-20 w-auto rounded-full border border-ziad-line shadow-soft"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: [0.16, 1, 0.3, 1] }}
        />
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-ziad-mint border-t-ziad-primary" />
        <p className="text-sm font-bold text-ziad-ink">{displayLabel}</p>
      </div>
    </div>
  );
}
