import { useMemo, useState } from "react";
import { Pencil, Trash2, Check, X } from "lucide-react";
import { useLedger } from "@/store/useLedger";
import { getCategory } from "@/lib/categories";
import { friendlyDate, weekdayLabel } from "@/lib/date";
import { formatMoney } from "@/lib/format";
import type { Transaction } from "@/types";
import { cn } from "@/lib/utils";
import CategoryChips from "./CategoryChips";

// 近期交易时间线：按日期分组，支持内联编辑分类/金额与删除
export default function TransactionTimeline({ limit = 50 }: { limit?: number }) {
  const transactions = useLedger((s) => s.transactions);
  const sorted = useMemo(
    () =>
      [...transactions]
        .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : b.createdAt - a.createdAt))
        .slice(0, limit),
    [transactions, limit],
  );

  const groups = useMemo(() => {
    const map = new Map<string, Transaction[]>();
    for (const t of sorted) {
      const arr = map.get(t.date) ?? [];
      arr.push(t);
      map.set(t.date, arr);
    }
    return Array.from(map.entries());
  }, [sorted]);

  if (sorted.length === 0) {
    return (
      <section className="card animate-fade-up p-10 text-center" style={{ animationDelay: "120ms" }}>
        <div className="font-display text-lg text-ink-soft">还没有记录</div>
        <div className="mt-1 text-sm text-ink-faint">
          在上方输入第一笔，开始你的记账手账
        </div>
      </section>
    );
  }

  return (
    <section className="card animate-fade-up p-6 sm:p-7" style={{ animationDelay: "120ms" }}>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-ink">近期记录</h2>
        <span className="text-xs text-ink-faint">最近 {sorted.length} 笔</span>
      </div>

      <div className="relative">
        {/* 时间轴竖线 */}
        <div className="absolute left-[5px] top-2 bottom-2 w-px bg-line" />
        <div className="space-y-7">
          {groups.map(([date, items]) => (
            <div key={date} className="relative">
              <div className="mb-3 flex items-center gap-2.5 pl-6">
                <span className="absolute left-0 top-1 h-2.5 w-2.5 rounded-full border-2 border-clay bg-paper-50" />
                <span className="text-sm font-medium text-ink">
                  {friendlyDate(date)}
                </span>
                <span className="text-xs text-ink-faint">
                  {weekdayLabel(date)}
                </span>
                <span className="tabular ml-auto text-sm font-medium text-clay">
                  ¥{items.reduce((s, t) => s + t.amount, 0).toFixed(2)}
                </span>
              </div>
              <ul className="space-y-1.5 pl-6">
                {items.map((t) => (
                  <TimelineRow key={t.id} tx={t} />
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TimelineRow({ tx }: { tx: Transaction }) {
  const update = useLedger((s) => s.updateTransaction);
  const remove = useLedger((s) => s.removeTransaction);
  const [editing, setEditing] = useState(false);
  const [draftCat, setDraftCat] = useState(tx.category);
  const [draftAmount, setDraftAmount] = useState(String(tx.amount));
  const [draftPurpose, setDraftPurpose] = useState(tx.purpose);

  const cat = getCategory(tx.category);

  function save() {
    const amt = parseFloat(draftAmount);
    update(tx.id, {
      category: draftCat,
      amount: isNaN(amt) ? tx.amount : Math.round(amt * 100) / 100,
      purpose: draftPurpose.trim() || tx.purpose,
    });
    setEditing(false);
  }

  function cancel() {
    setDraftCat(tx.category);
    setDraftAmount(String(tx.amount));
    setDraftPurpose(tx.purpose);
    setEditing(false);
  }

  if (editing) {
    return (
      <li className="rounded-xl border border-line bg-paper-50 p-4">
        <div className="flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-xs text-ink-faint">用途</label>
            <input
              value={draftPurpose}
              onChange={(e) => setDraftPurpose(e.target.value)}
              className="w-full border-b border-line bg-transparent pb-1.5 text-base text-ink focus:border-clay"
              placeholder="输入用途"
            />
          </div>
          <div className="flex items-center gap-3">
            <label className="text-xs text-ink-faint">金额</label>
            <div className="relative flex-1">
              <span className="absolute left-0 top-1/2 -translate-y-1/2 text-sm text-ink-faint">¥</span>
              <input
                value={draftAmount}
                onChange={(e) => setDraftAmount(e.target.value)}
                inputMode="decimal"
                className="tabular w-full border-b border-line bg-transparent py-1.5 pl-5 text-right text-xl font-display font-semibold text-clay focus:border-clay"
                placeholder="0.00"
              />
            </div>
          </div>
          <CategoryChips value={draftCat} onChange={setDraftCat} />
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={save}
              className="flex items-center gap-1 rounded-lg bg-ink px-3 py-1.5 text-xs text-paper-50 hover:bg-ink-soft"
            >
              <Check size={13} /> 保存
            </button>
            <button
              onClick={cancel}
              className="flex items-center gap-1 rounded-lg border border-line px-3 py-1.5 text-xs text-ink-muted hover:bg-paper-200"
            >
              <X size={13} /> 取消
            </button>
            <button
              onClick={() => {
                remove(tx.id);
                setEditing(false);
              }}
              className="ml-auto flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs text-clay-dark hover:bg-clay/10"
            >
              <Trash2 size={13} /> 删除
            </button>
          </div>
        </div>
      </li>
    );
  }

  return (
    <li
      className={cn(
        "group flex items-center gap-3 rounded-lg px-2.5 py-2 transition-colors hover:bg-paper-200/60",
      )}
    >
      <span
        className="h-2 w-2 shrink-0 rounded-full"
        style={{ backgroundColor: cat.color }}
      />
      <span className="text-sm text-ink-soft">{tx.purpose}</span>
      <span className="hidden items-center gap-1 text-xs text-ink-faint sm:inline-flex">
        {cat.emoji} {cat.label}
      </span>
      <span className="tabular ml-auto text-sm font-medium text-ink">
        {formatMoney(tx.amount)}
      </span>
      <button
        onClick={() => setEditing(true)}
        className="opacity-0 transition-opacity group-hover:opacity-100 text-ink-faint hover:text-ink"
        aria-label="编辑"
      >
        <Pencil size={14} />
      </button>
    </li>
  );
}
