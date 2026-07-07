import type { LucideIcon } from "lucide-react";
import { cn } from "../lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  helper?: string;
  tone?: "green" | "blue" | "amber" | "red";
}

const toneClass = {
  green: "bg-ziad-light text-ziad-primary border-ziad-line",
  blue: "bg-blue-50 text-blue-700 border-blue-100",
  amber: "bg-amber-50 text-amber-700 border-amber-100",
  red: "bg-red-50 text-red-700 border-red-100",
};

export function StatCard({ label, value, icon: Icon, helper, tone = "green" }: StatCardProps) {
  return (
    <section className="rounded-card border border-ziad-line bg-ziad-panel p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase text-ziad-ink/78">{label}</p>
          <p className="mt-2 text-2xl font-extrabold text-ziad-ink">{value}</p>
        </div>
        <div className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-button border", toneClass[tone])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {helper ? <p className="mt-3 text-sm text-ziad-ink/80">{helper}</p> : null}
    </section>
  );
}
