// 日期工具：统一使用本地时区的 YYYY-MM-DD

export function toDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function todayKey(): string {
  return toDateKey(new Date());
}

export function parseDateKey(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

// 获取某日期所在周的起止（周一为一周开始）
export function weekRange(d: Date): { start: Date; end: Date } {
  const date = new Date(d);
  date.setHours(0, 0, 0, 0);
  const day = date.getDay(); // 0=周日
  const diff = day === 0 ? -6 : 1 - day; // 回到周一
  const start = new Date(date);
  start.setDate(date.getDate() + diff);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return { start, end };
}

export function monthRange(d: Date): { start: Date; end: Date } {
  const start = new Date(d.getFullYear(), d.getMonth(), 1);
  const end = new Date(d.getFullYear(), d.getMonth() + 1, 0);
  return { start, end };
}

export function yearRange(d: Date): { start: Date; end: Date } {
  const start = new Date(d.getFullYear(), 0, 1);
  const end = new Date(d.getFullYear(), 11, 31);
  return { start, end };
}

export function rangeOf(d: Date, range: "week" | "month" | "year") {
  if (range === "week") return weekRange(d);
  if (range === "month") return monthRange(d);
  return yearRange(d);
}

export function inRange(key: string, start: Date, end: Date): boolean {
  const t = parseDateKey(key).getTime();
  return t >= start.getTime() && t <= end.getTime();
}

export function daysBetween(a: Date, b: Date): number {
  const ms = Math.abs(b.getTime() - a.getTime());
  return Math.floor(ms / 86400000) + 1;
}

// 友好日期标签：今天/昨天/前天/M月D日
export function friendlyDate(key: string): string {
  const date = parseDateKey(key);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.round((today.getTime() - date.getTime()) / 86400000);
  if (diff === 0) return "今天";
  if (diff === 1) return "昨天";
  if (diff === 2) return "前天";
  return `${date.getMonth() + 1}月${date.getDate()}日`;
}

export function weekdayLabel(key: string): string {
  const date = parseDateKey(key);
  const labels = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
  return labels[date.getDay()];
}
