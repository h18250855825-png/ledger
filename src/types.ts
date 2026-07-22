// 交易记录
export interface Transaction {
  id: string;
  amount: number; // 金额（元）
  purpose: string; // 用途描述
  category: string; // 分类 key
  date: string; // 日期 YYYY-MM-DD
  createdAt: number; // 创建时间戳
}

// 分类定义
export interface Category {
  key: string;
  label: string;
  emoji: string;
  color: string;
  keywords: string[]; // 用于推断分类的关键词
}

// 输入解析结果
export interface ParsedInput {
  amount: number | null;
  purpose: string;
  category: string; // 推断出的分类 key
}

// 汇总范围
export type RangeKey = "week" | "month" | "year";
