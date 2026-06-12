// 主页（工作台）— 脚本输入 + 审核结果 + 优化输出
import { motion, AnimatePresence } from 'framer-motion';
import { ScriptInput } from '@/components/features/ScriptInput';
import { ReviewResultView } from '@/components/features/ReviewResult';
import { OptimizedOutput } from '@/components/features/OptimizedOutput';
import { useReviewStore } from '@/stores/reviewStore';
import { useHistoryStore } from '@/stores/historyStore';
import { useToast } from '@/components/ui/Toast';
import { Sparkles } from 'lucide-react';

export default function HomePage() {
  const { currentResult, optimizeOpen, setOptimizeOpen, resetReview } =
    useReviewStore();
  const addRecord = useHistoryStore((s) => s.addRecord);
  const { showToast } = useToast();

  const handleSaveOptimized = (result: typeof currentResult) => {
    if (result) {
      addRecord(result);
      showToast('已保存到历史记录', 'success');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* 欢迎横幅 */}
      {!currentResult && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-6 relative overflow-hidden"
          style={{
            background:
              'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
            color: '#fff',
          }}
        >
          <div className="relative z-10">
            <h1
              className="text-xl font-bold mb-2"
              style={{ fontFamily: "'Noto Serif SC', serif" }}
            >
              欢迎使用脚本审阅助手
            </h1>
            <p className="text-sm opacity-80 max-w-md">
              基于视频号历年平台规则规范，为您的视频脚本提供全方位合规审核与智能优化建议
            </p>
          </div>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-10">
            <Sparkles size={120} />
          </div>
        </motion.div>
      )}

      {/* 脚本输入框 */}
      {!currentResult && <ScriptInput />}

      {/* 审核结果 */}
      <AnimatePresence mode="wait">
        {currentResult && (
          <motion.div
            key="review-result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-5"
          >
            <ReviewResultView result={currentResult} />

            {/* 生成优化脚本按钮 */}
            {!optimizeOpen && (
              <div className="text-center">
                <button
                  onClick={() => setOptimizeOpen(true)}
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-xl text-white font-semibold text-sm transition-all duration-300 hover:scale-[1.02]"
                  style={{
                    background:
                      'linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)',
                    boxShadow:
                      '0 4px 20px rgba(13, 148, 136, 0.35)',
                  }}
                >
                  <Sparkles size={18} />
                  生成优化脚本
                </button>
              </div>
            )}

            {/* 优化脚本输出 */}
            {optimizeOpen && (
              <OptimizedOutput
                result={currentResult}
                onSave={handleSaveOptimized}
              />
            )}

            {/* 重新审核 */}
            <div className="text-center pb-4">
              <button
                onClick={resetReview}
                className="text-sm text-[var(--color-ink-light)] hover:text-[var(--color-ink)] transition-colors underline underline-offset-4"
              >
                审核新脚本
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}