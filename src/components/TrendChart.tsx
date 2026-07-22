import { useState } from "react";
import type { DayPoint } from "@/lib/stats";
import { friendlyDate, weekdayLabel } from "@/lib/date";
import { formatMoney } from "@/lib/format";

interface TrendChartProps {
  data: DayPoint[];
  height?: number;
}

// 自绘 SVG 柱状图：每日支出趋势，hover 显示 tooltip
export default function TrendChart({
  data,
  height = 200,
}: TrendChartProps) {
  const [hover, setHover] = useState<number | null>(null);
  const width = 720;
  const padX = 16;
  const padTop = 16;
  const padBottom = 28;
  const innerW = width - padX * 2;
  const innerH = height - padTop - padBottom;
  const max = Math.max(1, ...data.map((d) => d.total));
  const barGap = data.length > 1 ? innerW / data.length : 0;
  const barW = Math.max(2, Math.min(28, barGap * 0.62));

  return (
    <div className="relative w-full overflow-x-auto">
      <svg
        width="100%"
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        className="block"
        onMouseLeave={() => setHover(null)}
      >
        {/* 基线 */}
        <line
          x1={padX}
          x2={width - padX}
          y1={padTop + innerH}
          y2={padTop + innerH}
          stroke="#E0D8C5"
          strokeWidth={1}
        />
        {data.map((d, i) => {
          const h = max > 0 ? (d.total / max) * innerH : 0;
          const x = padX + i * barGap + (barGap - barW) / 2;
          const y = padTop + innerH - h;
          const active = hover === i;
          return (
            <g
              key={d.date}
              onMouseEnter={() => setHover(i)}
              className="cursor-pointer"
            >
              <rect
                x={padX + i * barGap}
                y={padTop}
                width={barGap}
                height={innerH}
                fill="transparent"
              />
              {d.total > 0 && (
                <rect
                  x={x}
                  y={y}
                  width={barW}
                  height={h}
                  rx={3}
                  fill={active ? "#94501A" : "#B5651D"}
                  opacity={active ? 1 : 0.85}
                  style={{ transition: "fill 0.2s, opacity 0.2s" }}
                />
              )}
            </g>
          );
        })}
      </svg>

      {hover !== null && data[hover] && (
        <div className="pointer-events-none absolute top-2 left-1/2 -translate-x-1/2 rounded-lg bg-ink px-3 py-2 text-xs text-paper-50 shadow-paper-lg">
          <div className="font-medium">
            {friendlyDate(data[hover].date)} · {weekdayLabel(data[hover].date)}
          </div>
          <div className="tabular mt-0.5 text-clay-light">
            {formatMoney(data[hover].total)}
          </div>
          <div className="text-paper-200">{data[hover].count} 笔</div>
        </div>
      )}

      {data.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center text-sm text-ink-faint">
          暂无数据
        </div>
      )}
    </div>
  );
}
