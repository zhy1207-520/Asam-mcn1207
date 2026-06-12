import { create } from 'zustand';
import type { ReviewResult } from '@/types';

interface HistoryState {
  records: ReviewResult[];
  addRecord: (record: ReviewResult) => void;
  deleteRecord: (id: string) => void;
  getRecord: (id: string) => ReviewResult | undefined;
  loadFromStorage: () => void;
}

export const useHistoryStore = create<HistoryState>((set, get) => ({
  records: [],

  addRecord: (record) => {
    const records = [record, ...get().records];
    set({ records });
    localStorage.setItem('review_history', JSON.stringify(records));
  },

  deleteRecord: (id) => {
    const records = get().records.filter((r) => r.id !== id);
    set({ records });
    localStorage.setItem('review_history', JSON.stringify(records));
  },

  getRecord: (id) => get().records.find((r) => r.id === id),

  loadFromStorage: () => {
    const saved = localStorage.getItem('review_history');
    if (saved) {
      try {
        set({ records: JSON.parse(saved) as ReviewResult[] });
      } catch { /* ignore */ }
    }
  },
}));

// 初始化时加载
useHistoryStore.getState().loadFromStorage();