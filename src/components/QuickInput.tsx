import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { parseInput } from "@/lib/parser";
import { getCategory } from "@/lib/categories";
import { formatMoney } from "@/lib/format";
import { useLedger } from "@/store/useLedger";
import { cn } from "@/lib/utils";
import CategoryChips from "./CategoryChips";

const EXAMPLES = ["午餐 35", "打车花了12.5元", "奶茶18", "超市买日用品86.4"];

// 自然语言快速记账输入框：实时解析金额/用途/分类
export default function QuickInput() {
  const addTransaction = useLedger((s) => s.addTransaction);
  const [text, setText] = useState("");
  const [overrideCat, setOverrideCat] = useState<string | null>(null);
  const [justAdded, setJustAdded] = useState(false);

  const parsed = useMemo(() => parseInput(text), [text]);
  const category = overrideCat ?? parsed.category;
  const cat = getCategory(category);
  const canSubmit = parsed.amount !== null && parsed.amount > 0;

  // 输入变化时重置手动覆盖
  useEffect(() => {
    setOverrideCat(null);
  }, [text]);

  function submit() {
    if (!canSubmit || parsed.amount === null) return;
    addTransaction({
      amount: parsed.amount,
      purpose: parsed.purpose,
      category,
    });
    setText("");
    setOverrideCat(null);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1600);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      submit();
    }
  }

  return (
    <section className="card animate-fade-up p-6 sm:p-8">
      <div className="flex items-center gap-2 text-ink-faint">
        <Sparkles size={15} />
        <span className="text-xs tracking-widest uppercase">今天花了什么</span>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="试试 “午餐35” 或 “打车花了12.5元”"
          className="font-display flex-1 bg-transparent text-2xl text-ink placeholder:text-ink-faint/70 sm:text-3xl"
        />
        <button
          type="button"
          onClick={submit}
          disabled={!canSubmit}
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-all",
            canSubmit
              ? "bg-clay text-paper-50 shadow-paper hover:bg-clay-dark hover:scale-105"
              : "cursor-not-allowed bg-paper-200 text-ink-faint",
          )}
          aria-label="记一笔"
        >
          <ArrowRight size={18} />
        </button>
      </div>

      {/* 解析预览 */}
      {text.trim() && (
        <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-line pt-4">
          <div className="flex items-baseline gap-2">
            <span className="text-xs text-ink-faint">金额</span>
            <span
              className={cn(
                "tabular font-display text-xl font-semibold",
                parsed.amount ? "text-clay" : "text-ink-faint",
              )}
            >
              {parsed.amount ? formatMoney(parsed.amount) : "未识别"}
            </span>
          </div>
          <span className="h-4 w-px bg-line" />
          <div className="flex items-baseline gap-2">
            <span className="text-xs text-ink-faint">用途</span>
            <span className="text-sm text-ink-soft">{parsed.purpose}</span>
          </div>
          <span className="h-4 w-px bg-line" />
          <div className="flex items-baseline gap-2">
            <span className="text-xs text-ink-faint">分类</span>
            <span
              className="chip border-transparent text-white"
              style={{ backgroundColor: cat.color }}
            >
              {cat.emoji} {cat.label}
            </span>
          </div>
        </div>
      )}

      {/* 分类覆盖 */}
      {text.trim() && (
        <div className="mt-4">
          <div className="mb-2 text-xs text-ink-faint">归类不对？点选调整</div>
          <CategoryChips value={category} onChange={setOverrideCat} />
        </div>
      )}

      {/* 示例 / 反馈 */}
      {!text.trim() && (
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="text-xs text-ink-faint">示例：</span>
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              type="button"
              onClick={() => setText(ex)}
              className="chip cursor-pointer border-line bg-paper-50 text-ink-muted hover:border-ink-faint hover:text-ink"
            >
              {ex}
            </button>
          ))}
        </div>
      )}

      {justAdded && (
        <div className="mt-4 rounded-xl bg-sage/10 px-4 py-2.5 text-sm text-sage-dark">
          ✓ 已记入「{cat.emoji} {cat.label}」{parsed.amount ? formatMoney(parsed.amount) : ""}
        </div>
      )}
    </section>
  );
}
