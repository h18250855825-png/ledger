import type { CategoryStat } from "@/lib/stats";
import { formatCompact } from "@/lib/format";

interface DonutChartProps {
  data: CategoryStat[];
  total: number;
  size?: number;
}

// 自绘 SVG 环形图：每段用 stroke 分段绘制，中心显示总额
export default function DonutChart({
  data,
  total,
  size = 220,
}: DonutChartProps) {
  const stroke = 26;
  const radius = (size - stroke) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circ = 2 * Math.PI * radius;

  let offset = 0;
  const segments = data.map((s) => {
    const len = (s.percent / 100) * circ;
    const seg = {
      ...s,
      dash: len,
      gap: circ - len,
      offset: -offset,
    };
    offset += len;
    return seg;
  });

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="-rotate-90"
        >
          <circle
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke="#EFE8D8"
            strokeWidth={stroke}
          />
          {total > 0 &&
            segments.map((s) => (
              <circle
                key={s.key}
                cx={cx}
                cy={cy}
                r={radius}
                fill="none"
                stroke={s.color}
                strokeWidth={stroke}
                strokeDasharray={`${s.dash} ${s.gap}`}
                strokeDashoffset={s.offset}
                strokeLinecap="butt"
                style={{
                  transition: "stroke-dasharray 0.6s cubic-bezier(0.22,1,0.36,1)",
                }}
              />
            ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xs tracking-widest text-ink-faint uppercase">
            总支出
          </span>
          <span className="tabular font-display text-2xl font-semibold text-ink mt-1">
            ¥{formatCompact(total)}
          </span>
          <span className="text-xs text-ink-muted mt-1">
            {data.length} 个分类
          </span>
        </div>
      </div>

      <ul className="w-full sm:w-56 space-y-2">
        {data.map((s) => (
          <li key={s.key} className="flex items-center gap-3 text-sm">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: s.color }}
            />
            <span className="text-ink-soft">
              {s.emoji} {s.label}
            </span>
            <span className="tabular ml-auto text-ink-muted">
              {s.percent.toFixed(0)}%
            </span>
            <span className="tabular w-16 text-right text-ink">
              ¥{formatCompact(s.total)}
            </span>
          </li>
        ))}
        {data.length === 0 && (
          <li className="text-sm text-ink-faint">暂无数据</li>
        )}
      </ul>
    </div>
  );
}
