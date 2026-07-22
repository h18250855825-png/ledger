import { CATEGORIES } from "@/lib/categories";
import { cn } from "@/lib/utils";
import { getCategory } from "@/lib/categories";

interface CategoryChipsProps {
  value: string;
  onChange: (key: string) => void;
  className?: string;
}

// 分类选择标签组，用于输入预览与编辑
export default function CategoryChips({
  value,
  onChange,
  className,
}: CategoryChipsProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {CATEGORIES.map((c) => {
        const active = c.key === value;
        return (
          <button
            key={c.key}
            type="button"
            onClick={() => onChange(c.key)}
            className={cn(
              "chip cursor-pointer",
              active
                ? "border-transparent text-white shadow-paper"
                : "border-line bg-paper-50 text-ink-soft hover:border-ink-faint",
            )}
            style={active ? { backgroundColor: c.color } : undefined}
          >
            <span aria-hidden>{c.emoji}</span>
            <span>{c.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export { getCategory };
