import { create } from 'zustand';
import type { ReviewResult } from '@/types';
import { runReview } from '@/engine/ruleChecker';

interface ReviewState {
  inputText: string;
  currentResult: ReviewResult | null;
  isReviewing: boolean;
  optimizeOpen: boolean;
  setInputText: (text: string) => void;
  startReview: () => Promise<void>;
  resetReview: () => void;
  setOptimizeOpen: (v: boolean) => void;
}

export const useReviewStore = create<ReviewState>((set, get) => ({
  inputText: '',
  currentResult: null,
  isReviewing: false,
  optimizeOpen: false,

  setInputText: (text) => set({ inputText: text }),

  startReview: async () => {
    const { inputText } = get();
    if (!inputText.trim()) return;

    set({ isReviewing: true });
    // 模拟审核延迟，生产环境调用后端 API
    await new Promise((r) => setTimeout(r, 1200 + Math.random() * 800));
    const result = runReview(inputText);
    set({ currentResult: result, isReviewing: false });
  },

  resetReview: () =>
    set({ inputText: '', currentResult: null, isReviewing: false, optimizeOpen: false }),

  setOptimizeOpen: (v) => set({ optimizeOpen: v }),
}));