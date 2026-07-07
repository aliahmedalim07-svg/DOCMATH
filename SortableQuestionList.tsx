import { motion } from "framer-motion";
import { cn } from "../lib/utils";

interface ProgressRingProps {
  value: number;
  size?: number;
  stroke?: number;
  label?: string;
  className?: string;
}

export function ProgressRing({ value, size = 76, stroke = 8, label, className }: ProgressRingProps) {
  const normalized = Math.max(0, Math.min(100, value));
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (normalized / 100) * circumference;

  return (
    <div className={cn("relative inline-grid place-items-center", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(57, 73, 89, 0.12)"
          strokeWidth={stroke}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#01219a"
          strokeLinecap="round"
          strokeWidth={stroke}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
      <span className="absolute text-sm font-extrabold text-ziad-ink">{label ?? `${normalized}%`}</span>
    </div>
  );
}
