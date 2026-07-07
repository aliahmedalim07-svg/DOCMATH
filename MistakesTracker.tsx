import { useI18n } from "../contexts/I18nContext";
import { cn } from "../lib/utils";

const statusStyles: Record<string, string> = {
  pending: "border-amber-200 bg-amber-50 text-amber-700",
  answered: "border-emerald-200 bg-emerald-50 text-emerald-700",
  submitted: "border-blue-200 bg-blue-50 text-blue-700",
  graded: "border-ziad-line bg-ziad-light text-ziad-primary",
  active: "border-emerald-200 bg-emerald-50 text-emerald-700",
  inactive: "border-red-200 bg-red-50 text-red-700",
  published: "border-emerald-200 bg-emerald-50 text-emerald-700",
  draft: "border-stone-200 bg-stone-50 text-stone-700",
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const { t } = useI18n();
  const statusKey = status.toLowerCase();
  const knownKeys = ["pending", "answered", "submitted", "graded", "active", "inactive", "published", "draft"];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-bold capitalize",
        statusStyles[statusKey] ?? "border-ziad-line bg-ziad-panel text-ziad-ink",
        className,
      )}
    >
      {knownKeys.includes(statusKey) ? t(statusKey as any) : status}
    </span>
  );
}
