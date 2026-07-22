import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import Home from "@/pages/Home";
import Summary from "@/pages/Summary";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Sidebar />
        <main className="lg:pl-64">
          <div className="mx-auto w-full max-w-3xl px-5 py-8 sm:px-8 sm:py-12">
            <PageHeader />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/summary" element={<Summary />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

function PageHeader() {
  const now = new Date();
  const dateStr = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`;
  const weekday = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"][
    now.getDay()
  ];
  return (
    <header className="mb-8 flex items-end justify-between">
      <div>
        <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">
          记账手账
        </h1>
        <p className="mt-1.5 text-sm text-ink-muted">
          一句话记下今天的花销，自动归集汇总
        </p>
      </div>
      <div className="hidden text-right sm:block">
        <div className="tabular text-sm text-ink-soft">{dateStr}</div>
        <div className="text-xs text-ink-faint">{weekday}</div>
      </div>
    </header>
  );
}
