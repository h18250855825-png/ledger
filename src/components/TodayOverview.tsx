import { useMemo } from "react";
import { TrendingDown, TrendingUp, Minus } from "lucide-react";
import { useLedger } from "@/store/useLedger";
import { todayKey, toDateKey } from "@/lib/date";
import { formatMoney } from "@/lib/format";

// 今日概览卡片：今日总支出、笔数、环比昨日
export default function TodayOverview() {
  const transactions = useLedger((s) => s.transactions);

  const { todayTotal, todayCount, yesterdayTotal, delta, deltaPct } =
    useMemo(() => {
      const today = todayKey();
      const yesterday = toDateKey(new Date(Date.now() - 86400000));
      let todayTotal = 0;
      let todayCount = 0;
      let yesterdayTotal = 0;
      for (const t of transactions) {
        if (t.date === today) {
          todayTotal += t.amount;
          todayCount += 1;
        } else if (t.date === yesterday) {
          yesterdayTotal += t.amount;
        }
      }
      const delta = todayTotal - yesterdayTotal;
      const deltaPct =
        yesterdayTotal > 0 ? (delta / yesterdayTotal) * 100 : null;
      return {
        todayTotal: Math.round(todayTotal * 100) / 100,
        todayCount,
        yesterdayTotal: Math.round(yesterdayTotal * 100) / 100,
        delta: Math.round(delta * 100) / 100,
        deltaPct,
      };
    }, [transactions]);

  const trend =
    delta === 0 ? "flat" : delta > 0 ? "up" : "down";
  const TrendIcon =
    trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;

  return (
    <section className="card animate-fade-up p-6 sm:p-7" style={{ animationDelay: "60ms" }}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs tracking-widest text-ink-faint uppercase">
            今日支出
          </div>
          <div className="tabular mt-2 font-display text-4xl font-semibold text-ink sm:text-5xl">
            {formatMoney(todayTotal)}
          </div>
          <div className="mt-1.5 text-sm text-ink-muted">
            {todayCount > 0 ? `共 ${todayCount} 笔` : "还没记账，记一笔吧"}
          </div>
        </div>

        {yesterdayTotal > 0 && (
          <div
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm ${
              trend === "up"
                ? "bg-clay/10 text-clay-dark"
                : trend === "down"
                  ? "bg-sage/15 text-sage-dark"
                  : "bg-paper-200 text-ink-muted"
            }`}
          >
            <TrendIcon size={14} />
            <span className="tabular">
              {delta > 0 ? "+" : ""}
              {deltaPct !== null ? `${deltaPct.toFixed(0)}%` : "—"}
            </span>
            <span className="text-ink-faint">vs 昨日</span>
          </div>
        )}
      </div>
    </section>
  );
}
