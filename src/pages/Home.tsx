import QuickInput from "@/components/QuickInput";
import TodayOverview from "@/components/TodayOverview";
import TransactionTimeline from "@/components/TransactionTimeline";

export default function Home() {
  return (
    <div className="space-y-6">
      <QuickInput />
      <TodayOverview />
      <TransactionTimeline />
    </div>
  );
}
