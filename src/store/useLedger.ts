import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Transaction } from "@/types";
import { todayKey } from "@/lib/date";

interface LedgerState {
  transactions: Transaction[];
  addTransaction: (input: {
    amount: number;
    purpose: string;
    category: string;
    date?: string;
  }) => void;
  updateTransaction: (id: string, patch: Partial<Transaction>) => void;
  removeTransaction: (id: string) => void;
  clearAll: () => void;
}

function uid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export const useLedger = create<LedgerState>()(
  persist(
    (set) => ({
      transactions: [],
      addTransaction: ({ amount, purpose, category, date }) =>
        set((state) => ({
          transactions: [
            {
              id: uid(),
              amount: Math.round(amount * 100) / 100,
              purpose,
              category,
              date: date ?? todayKey(),
              createdAt: Date.now(),
            },
            ...state.transactions,
          ],
        })),
      updateTransaction: (id, patch) =>
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id ? { ...t, ...patch } : t,
          ),
        })),
      removeTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        })),
      clearAll: () => set({ transactions: [] }),
    }),
    { name: "ledger.transactions" },
  ),
);
