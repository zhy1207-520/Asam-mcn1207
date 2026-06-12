// 审核结果展示组件
import { memo, useRef, useCallback, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import type { ReviewResult } from '@/types';
import { CategoryLabels, LevelLabels } from '@/types';

interface ReviewResultProps {
  result: ReviewResult;
}

const LevelColors = {
  high: { bg: 'var(--color-danger-bg)', text: 'var(--color-danger)', border: '#fca5a5' },
  warning: { bg: 'var(--color-warning-bg)', text: 'var(--color-warning)', border: '#fcd34d' },
  info: { bg: 'var(--color-info-bg)', text: 'var(--color-info)', border: '#fde047' },
} as const;

export const ReviewResultView = memo(function ReviewResultView({
  result,
}: ReviewResultProps) {
  const { marks, score, summary } = result;
  const suggestionRefs = useRef<(HTMLDivElement | null)[]>([]);

  const scrollToSuggestion = useCallback(
    (idx: number) => {
      suggestionRefs.current[idx]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    },
    []
  );

  // 构建带高亮的原始文本
  const renderHighlightedText = () => {
    const elements: ReactNode[] = [];
    const sortedMarks = [...marks].sort((a, b) => a.startIndex - b.startIndex);
    let lastIdx = 0;

    sortedMarks.forEach((mark, idx) => {
      // 添加普通文本
      if (mark.startIndex > lastIdx) {
        elements.push(
          <span key={`txt_${lastIdx}`}>
            {result.originalText.slice(lastIdx, mark.startIndex)}
          </span>
        );
      }

      // 添加高亮标记
      const colors = LevelColors[mark.level];
      elements.push(
        <button
          key={`mark_${mark.id}`}
          onClick={() => scrollToSuggestion(idx)}
          className="relative inline px-0.5 rounded cursor-pointer transition-all duration-200 hover:ring-2 hover:ring-offset-1"
          style={{
            background: colors.bg,
            borderBottom: `2px solid ${colors.border}`,
            color: colors.text,
            fontWeight: 500,
          }}
          title={`${CategoryLabels[mark.category]} - ${LevelLabels[mark.level]}`}
        >
          {mark.word}
          <span
            className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full text-[9px] leading-[14px] text-white flex items-center justify-center font-bold"
            style={{ background: colors.text }}
          >
            {idx + 1}
          </span>
        </button>
      );

      lastIdx = mark.endIndex;
    });

    // 剩余文本
    if (lastIdx < result.originalText.length) {
      elements.push(
        <span key={`txt_${lastIdx}`}>
          {result.originalText.slice(lastIdx)}
        </span>
      );
    }

    return elements;
  };

  return (
    <div className="space-y-5">
      {/* 审核总览面板 */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-5"
        style={{ background: '#fff', boxShadow: 'var(--shadow-md)' }}
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          {/* 评分 */}
          <div>
            <div
              className="text-3xl font-bold"
              style={{
                fontFamily: "'Noto Serif SC', serif",
                color:
                  score >= 80
                    ? 'var(--color-accent)'
                    : score >= 50
                      ? 'var(--color-warning)'
                      : 'var(--color-danger)',
              }}
            >
              {score}
            </div>
            <div className="text-xs text-[var(--color-ink-light)] mt-1">合规评分</div>
          </div>
          {/* 高危 */}
          <div>
            <div className="text-3xl font-bold text-[var(--color-danger)]">
              {summary.high}
            </div>
            <div className="text-xs text-[var(--color-ink-light)] mt-1">
              高危 <span className="text-[var(--color-danger)]">●</span>
            </div>
          </div>
          {/* 警告 */}
          <div>
            <div className="text-3xl font-bold text-[var(--color-warning)]">
              {summary.warning}
            </div>
            <div className="text-xs text-[var(--color-ink-light)] mt-1">
              警告 <span className="text-[var(--color-warning)]">●</span>
            </div>
          </div>
          {/* 提示 */}
          <div>
            <div className="text-3xl font-bold text-[var(--color-info)]">
              {summary.info}
            </div>
            <div className="text-xs text-[var(--color-ink-light)] mt-1">
              提示 <span className="text-[var(--color-info)]">●</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 原文对比视图 + 建议列表 */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: '#fff', boxShadow: 'var(--shadow-md)' }}
      >
        <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[var(--color-border-light)]">
          {/* 左侧：高亮原文 */}
          <div
            className="p-5 overflow-auto max-h-[400px]"
            style={{ background: 'var(--color-bg)' }}
          >
            <h3 className="text-sm font-semibold mb-3 text-[var(--color-ink-light)]">
              原始脚本（点击标记查看建议）
            </h3>
            <div className="text-sm leading-relaxed whitespace-pre-wrap">
              {marks.length === 0 ? (
                <span className="text-green-600 font-medium">
                  未发现违规内容
                </span>
              ) : (
                renderHighlightedText()
              )}
            </div>
          </div>

          {/* 右侧：建议列表 */}
          <div className="p-5 overflow-auto max-h-[400px]">
            <h3 className="text-sm font-semibold mb-3 text-[var(--color-ink-light)]">
              优化建议 ({marks.length})
            </h3>
            {marks.length === 0 ? (
              <div className="text-center py-10 text-[var(--color-ink-light)]">
                <div className="text-3xl mb-2">🎉</div>
                <p className="text-sm">脚本内容合规，无需修改</p>
              </div>
            ) : (
              <div className="space-y-3">
                {marks.map((mark, idx) => (
                  <div
                    key={mark.id}
                    ref={(el) => { suggestionRefs.current[idx] = el; }}
                    className="p-3 rounded-xl border transition-all duration-200 hover:shadow-sm"
                    style={{
                      borderColor: LevelColors[mark.level].border,
                      background: LevelColors[mark.level].bg,
                    }}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <span
                        className="px-1.5 py-0.5 rounded text-[11px] font-bold text-white"
                        style={{ background: LevelColors[mark.level].text }}
                      >
                        {LevelLabels[mark.level]}
                      </span>
                      <span className="text-xs text-[var(--color-ink-light)]">
                        {CategoryLabels[mark.category]}
                      </span>
                    </div>
                    <p className="text-sm font-medium mb-1">
                      标记词：<span className="font-mono bg-white/50 px-1 rounded">"{mark.word}"</span>
                    </p>
                    <p className="text-xs text-[var(--color-ink-light)] mb-1.5">
                      {mark.suggestion}
                    </p>
                    {mark.alternatives.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-1.5">
                        <span className="text-[11px] text-[var(--color-ink-light)]">
                          建议替换：
                        </span>
                        {mark.alternatives.map((alt) => (
                          <span
                            key={alt}
                            className="text-[11px] px-1.5 py-0.5 rounded-full bg-green-100 text-green-700 font-medium"
                          >
                            {alt}
                          </span>
                        ))}
                      </div>
                    )}
                    <p className="text-[10px] text-[var(--color-ink-light)] opacity-60">
                      {mark.ruleRef}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 规则依据总览 */}
      {marks.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl p-5"
          style={{ background: '#fff', boxShadow: 'var(--shadow-sm)' }}
        >
          <h3 className="text-sm font-semibold mb-3 text-[var(--color-ink-light)]">
            涉及规则条款
          </h3>
          <div className="space-y-2">
            {[...new Set(marks.map((m) => m.ruleRef))].map((ref) => (
              <div
                key={ref}
                className="flex items-start gap-2 text-xs text-[var(--color-ink-light)]"
              >
                <span
                  className="mt-0.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: 'var(--color-accent)' }}
                />
                {ref}
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
});