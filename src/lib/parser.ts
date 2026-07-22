import type { ParsedInput } from "@/types";
import { CATEGORIES } from "./categories";

// 金额匹配：整数或两位小数
const AMOUNT_RE = /(\d+(?:\.\d{1,2})?)/;

// 量词 / 货币符号，用于从用途中清洗
const CURRENCY_RE = /[$￥¥]|元|块钱?|RMB|rmb/g;

// 解析一句话输入，提取金额、用途并推断分类
export function parseInput(raw: string): ParsedInput {
  const text = raw.trim();
  const amountMatch = text.match(AMOUNT_RE);
  const amount = amountMatch ? parseFloat(amountMatch[1]) : null;

  // 用途：去掉金额与货币量词，再去掉 "花了/花/用" 等口语前缀
  let purpose = text;
  if (amountMatch) {
    purpose = purpose.replace(amountMatch[0], " ");
  }
  purpose = purpose.replace(CURRENCY_RE, " ");
  purpose = purpose
    .replace(/花了|花掉|花费|用掉|用了|支出|消费/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!purpose) purpose = "未分类支出";

  const category = inferCategory(purpose);

  return { amount, purpose, category };
}

// 关键词包含匹配，命中即返回该分类；无命中归入 other
export function inferCategory(purpose: string): string {
  const lower = purpose.toLowerCase();
  for (const cat of CATEGORIES) {
    if (cat.key === "other") continue;
    if (cat.keywords.some((kw) => lower.includes(kw.toLowerCase()))) {
      return cat.key;
    }
  }
  return "other";
}
