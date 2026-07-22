import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string;
  hint?: string;
  accent?: "clay" | "sage" | "ink";
  delay?: number;
}

export default function MetricCard({
  label,
  value,
  hint,
  accent = "ink",
  delay = 0,
}: MetricCardProps) {
  const accentColor =
    accent === "clay" ? "text-clay" : accent === "sage" ? "text-sage-dark" : "text-ink";
  return (
    <div
      className="card animate-fade-up p-5"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="text-xs tracking-wider text-ink-faint uppercase">
        {label}
      </div>
      <div className={cn("tabular mt-2 font-display text-2xl font-semibold", accentColor)}>
        {value}
      </div>
      {hint && <div className="mt-1 text-xs text-ink-muted">{hint}</div>}
    </div>
  );
}
