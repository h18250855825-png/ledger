// 金额格式化：¥12.50，负数 / 0 处理
export function formatMoney(n: number): string {
  const sign = n < 0 ? "-" : "";
  const abs = Math.abs(n);
  return `${sign}¥${abs.toFixed(2)}`;
}

// 紧凑金额：1.2k / 12.5k，用于图表轴
export function formatCompact(n: number): string {
  if (n >= 10000) return `${(n / 10000).toFixed(1)}w`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toFixed(0);
}

// 普通数字显示
export function formatNumber(n: number): string {
  return n.toFixed(2);
}
