import { NavLink } from "react-router-dom";
import { NotebookPen, PieChart } from "lucide-react";
import { cn } from "@/lib/utils";

// 左侧固定导航：品牌 + 主导航
export default function Sidebar() {
  const navItem = ({ isActive }: { isActive: boolean }) =>
    cn(
      "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm transition-colors",
      isActive
        ? "bg-ink text-paper-50 shadow-paper"
        : "text-ink-muted hover:bg-paper-200 hover:text-ink",
    );

  return (
    <>
      {/* 桌面端左侧栏 */}
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 flex-col border-r border-line bg-paper-100/60 backdrop-blur-md lg:flex">
        <div className="px-6 pt-8 pb-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-clay text-paper-50 shadow-paper">
              <NotebookPen size={18} />
            </div>
            <div>
              <div className="font-display text-lg font-semibold leading-none text-ink">
                手账
              </div>
              <div className="mt-1 text-[11px] tracking-widest text-ink-faint uppercase">
                一句话记账
              </div>
            </div>
          </div>
        </div>

        <nav className="flex flex-col gap-1 px-4">
          <NavLink to="/" end className={navItem}>
            <NotebookPen size={16} />
            <span>记一笔</span>
          </NavLink>
          <NavLink to="/summary" className={navItem}>
            <PieChart size={16} />
            <span>汇总分析</span>
          </NavLink>
        </nav>

        <div className="mt-auto px-6 pb-6 text-[11px] leading-relaxed text-ink-faint">
          <div className="border-t border-line pt-4">
            数据保存在本地浏览器
            <br />
            每天一句，自动归集
          </div>
        </div>
      </aside>

      {/* 移动端顶部栏 */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-line bg-paper-100/80 px-5 py-3 backdrop-blur-md lg:hidden">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-clay text-paper-50">
            <NotebookPen size={15} />
          </div>
          <span className="font-display text-base font-semibold text-ink">
            手账
          </span>
        </div>
        <nav className="flex gap-1">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              cn(
                "rounded-lg px-3 py-1.5 text-sm transition-colors",
                isActive
                  ? "bg-ink text-paper-50"
                  : "text-ink-muted",
              )
            }
          >
            记一笔
          </NavLink>
          <NavLink
            to="/summary"
            className={({ isActive }) =>
              cn(
                "rounded-lg px-3 py-1.5 text-sm transition-colors",
                isActive ? "bg-ink text-paper-50" : "text-ink-muted",
              )
            }
          >
            汇总
          </NavLink>
        </nav>
      </header>
    </>
  );
}
