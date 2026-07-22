import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLedger } from "@/store/useLedger";
import {
  rangeOf,
  todayKey,
  parseDateKey,
  toDateKey,
} from "@/lib/date";
import { categoryStats, dailySeries, rangeMetrics } from "@/lib/stats";
import { formatMoney } from "@/lib/format";
import type { RangeKey } from "@/types";
import { cn } from "@/lib/utils";
import MetricCard from "@/components/MetricCard";
import DonutChart from "@/components/DonutChart";
import TrendChart from "@/components/TrendChart";

const RANGES: { key: RangeKey; label: string }[] = [
  { key: "week", label: "本周" },
  { key: "month", label: "本月" },
  { key: "year", label: "本年" },
];

export default function Summary() {
  const transactions = useLedger((s) => s.transactions);
  const [range, setRange] = useState<RangeKey>("week");
  const [anchor, setAnchor] = useState<string>(todayKey());

  const { start, end, label, prev, next, canNext } = useMemo(() => {
    const base = parseDateKey(anchor);
    const { start, end } = rangeOf(base, range);
    const label = formatRangeLabel(start, end, range);
    // 上一段 / 下一段锚点
    const prevBase = new Date(base);
    const nextBase = new Date(base);
    if (range === "week") {
      prevBase.setDate(base.getDate() - 7);
      nextBase.setDate(base.getDate() + 7);
    } else if (range === "month") {
      prevBase.setMonth(base.getMonth() - 1);
      nextBase.setMonth(base.getMonth() + 1);
    } else {
      prevBase.setFullYear(base.getFullYear() - 1);
      nextBase.setFullYear(base.getFullYear() + 1);
    }
    const today = toDateKey(new Date());
    return {
      start,
      end,
      label,
      prev: toDateKey(prevBase),
      next: toDateKey(nextBase),
      canNext: toDateKey(nextBase) <= today,
    };
  }, [anchor, range]);

  const inRangeTx = useMemo(
    () =>
      transactions.filter((t) => {
        const ts = parseDateKey(t.date).getTime();
        return ts >= start.getTime() && ts <= end.getTime();
      }),
    [transactions, start, end],
  );

  const metrics = useMemo(
    () => rangeMetrics(transactions, start, end),
    [transactions, start, end],
  );
  const catData = useMemo(() => categoryStats(inRangeTx), [inRangeTx]);
  const series = useMemo(
    () => dailySeries(transactions, start, end),
    [transactions, start, end],
  );

  return (
    <div className="space-y-6">
      {/* 范围切换器 */}
      <section className="card animate-fade-up p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="inline-flex rounded-xl bg-paper-200 p-1">
            {RANGES.map((r) => (
              <button
                key={r.key}
                onClick={() => {
                  setRange(r.key);
                  setAnchor(todayKey());
                }}
                className={cn(
                  "rounded-lg px-4 py-1.5 text-sm transition-colors",
                  range === r.key
                    ? "bg-paper-50 text-ink shadow-paper"
                    : "text-ink-muted hover:text-ink",
                )}
              >
                {r.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setAnchor(prev)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-ink-muted hover:bg-paper-200 hover:text-ink"
              aria-label="上一段"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="tabular min-w-[140px] text-center text-sm font-medium text-ink">
              {label}
            </span>
            <button
              onClick={() => canNext && setAnchor(next)}
              disabled={!canNext}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg border border-line",
                canNext
                  ? "text-ink-muted hover:bg-paper-200 hover:text-ink"
                  : "cursor-not-allowed border-line/50 text-ink-faint/40",
              )}
              aria-label="下一段"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* 核心指标 */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricCard
          label="总支出"
          value={formatMoney(metrics.total)}
          accent="clay"
          delay={40}
        />
        <MetricCard
          label="日均支出"
          value={formatMoney(metrics.dailyAvg)}
          hint="按范围天数均摊"
          delay={90}
        />
        <MetricCard
          label="最大单笔"
          value={
            metrics.maxSingle ? formatMoney(metrics.maxSingle.amount) : "¥0.00"
          }
          hint={metrics.maxSingle?.purpose}
          delay={140}
        />
        <MetricCard
          label="记账天数"
          value={`${metrics.trackedDays} 天`}
          hint={`共 ${inRangeTx.length} 笔`}
          accent="sage"
          delay={190}
        />
      </section>

      {/* 分类占比 */}
      <section className="card animate-fade-up p-6 sm:p-7" style={{ animationDelay: "200ms" }}>
        <h2 className="font-display text-lg font-semibold text-ink">分类占比</h2>
        <div className="mt-6">
          <DonutChart data={catData} total={metrics.total} />
        </div>
      </section>

      {/* 每日趋势 */}
      <section className="card animate-fade-up p-6 sm:p-7" style={{ animationDelay: "260ms" }}>
        <h2 className="font-display text-lg font-semibold text-ink">每日支出趋势</h2>
        <div className="mt-6">
          <TrendChart data={series} />
        </div>
      </section>
    </div>
  );
}

function formatRangeLabel(start: Date, end: Date, range: RangeKey): string {
  const s = `${start.getMonth() + 1}.${start.getDate()}`;
  const e = `${end.getMonth() + 1}.${end.getDate()}`;
  if (range === "year") return `${start.getFullYear()} 年`;
  if (range === "month") return `${start.getFullYear()}年${start.getMonth() + 1}月`;
  return `${s} – ${e}`;
}
