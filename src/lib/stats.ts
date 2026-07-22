import type { Transaction } from "@/types";
import { getCategory } from "./categories";
import { daysBetween, parseDateKey } from "./date";

export interface CategoryStat {
  key: string;
  label: string;
  emoji: string;
  color: string;
  total: number;
  count: number;
  percent: number; // 0-100
}

// 按分类聚合
export function categoryStats(transactions: Transaction[]): CategoryStat[] {
  const total = transactions.reduce((s, t) => s + t.amount, 0);
  const map = new Map<string, { total: number; count: number }>();
  for (const t of transactions) {
    const cur = map.get(t.category) ?? { total: 0, count: 0 };
    cur.total += t.amount;
    cur.count += 1;
    map.set(t.category, cur);
  }
  const list: CategoryStat[] = [];
  map.forEach((v, key) => {
    const cat = getCategory(key);
    list.push({
      key,
      label: cat.label,
      emoji: cat.emoji,
      color: cat.color,
      total: Math.round(v.total * 100) / 100,
      count: v.count,
      percent: total > 0 ? (v.total / total) * 100 : 0,
    });
  });
  return list.sort((a, b) => b.total - a.total);
}

export interface RangeMetrics {
  total: number;
  dailyAvg: number;
  maxSingle: Transaction | null;
  trackedDays: number; // 有记账记录的天数
}

// 范围内的核心指标
export function rangeMetrics(
  transactions: Transaction[],
  start: Date,
  end: Date,
): RangeMetrics {
  const inRange = transactions.filter((t) => {
    const ts = parseDateKey(t.date).getTime();
    return ts >= start.getTime() && ts <= end.getTime();
  });
  const total = inRange.reduce((s, t) => s + t.amount, 0);
  const span = Math.max(1, daysBetween(start, end));
  const trackedDays = new Set(inRange.map((t) => t.date)).size;
  const maxSingle = inRange.reduce<Transaction | null>(
    (max, t) => (max && max.amount >= t.amount ? max : t),
    null,
  );
  return {
    total: Math.round(total * 100) / 100,
    dailyAvg: Math.round((total / span) * 100) / 100,
    maxSingle,
    trackedDays,
  };
}

// 每日支出序列（按日期升序），填充范围内的空缺天为 0
export interface DayPoint {
  date: string;
  total: number;
  count: number;
}

export function dailySeries(
  transactions: Transaction[],
  start: Date,
  end: Date,
): DayPoint[] {
  const map = new Map<string, { total: number; count: number }>();
  for (const t of transactions) {
    const ts = parseDateKey(t.date).getTime();
    if (ts >= start.getTime() && ts <= end.getTime()) {
      const cur = map.get(t.date) ?? { total: 0, count: 0 };
      cur.total += t.amount;
      cur.count += 1;
      map.set(t.date, cur);
    }
  }
  const points: DayPoint[] = [];
  const cursor = new Date(start);
  cursor.setHours(0, 0, 0, 0);
  while (cursor.getTime() <= end.getTime()) {
    const key = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}-${String(cursor.getDate()).padStart(2, "0")}`;
    const v = map.get(key) ?? { total: 0, count: 0 };
    points.push({
      date: key,
      total: Math.round(v.total * 100) / 100,
      count: v.count,
    });
    cursor.setDate(cursor.getDate() + 1);
  }
  return points;
}
