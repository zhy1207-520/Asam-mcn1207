// 脚本输入组件
import { useCallback, useRef } from 'react';
import { useReviewStore } from '@/stores/reviewStore';
import { Trash2, ClipboardPaste, Send } from 'lucide-react';

const MAX_WORDS = 10000;

export function ScriptInput() {
  const { inputText, setInputText, isReviewing, startReview } = useReviewStore();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const wordCount = inputText.length;
  const isOverLimit = wordCount > MAX_WORDS;
  const isEmpty = inputText.trim().length === 0;

  const handleClear = useCallback(() => {
    setInputText('');
    textareaRef.current?.focus();
  }, [setInputText]);

  const handlePaste = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInputText(inputText + text);
    } catch {
      // 降级方案：聚焦到 textarea，用户手动粘贴
      textareaRef.current?.focus();
    }
  }, [inputText, setInputText]);

  const handleSubmit = useCallback(() => {
    if (!isEmpty && !isOverLimit) {
      startReview();
    }
  }, [isEmpty, isOverLimit, startReview]);

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: '#fff', boxShadow: 'var(--shadow-md)' }}
    >
      {/* 标题栏 */}
      <div
        className="flex items-center justify-between px-5 py-4 border-b"
        style={{ borderColor: 'var(--color-border-light)' }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: 'var(--color-accent)' }}
          />
          <h2
            className="text-base font-semibold"
            style={{ fontFamily: "'Noto Serif SC', serif" }}
          >
            输入视频脚本
          </h2>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handlePaste}
            className="p-2 rounded-lg text-sm text-[var(--color-ink-light)] hover:bg-gray-100 transition-colors flex items-center gap-1"
            title="粘贴 (Ctrl+V)"
          >
            <ClipboardPaste size={15} />
            <span className="hidden sm:inline">粘贴</span>
          </button>
          <button
            onClick={handleClear}
            disabled={isEmpty}
            className="p-2 rounded-lg text-sm text-[var(--color-ink-light)] hover:bg-gray-100 transition-colors flex items-center gap-1 disabled:opacity-30"
          >
            <Trash2 size={15} />
            <span className="hidden sm:inline">清空</span>
          </button>
        </div>
      </div>

      {/* 输入区域 */}
      <div className="p-5">
        <textarea
          ref={textareaRef}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="在此粘贴您的视频脚本..."
          className="w-full min-h-[220px] resize-y rounded-xl p-4 text-sm leading-relaxed outline-none transition-all duration-200 border"
          style={{
            fontFamily: "'Noto Sans SC', sans-serif",
            borderColor: isOverLimit ? 'var(--color-danger)' : 'var(--color-border)',
            background: 'var(--color-bg)',
            color: 'var(--color-ink)',
          }}
          maxLength={MAX_WORDS + 500} // 允许超出一点以显示警告
        />

        {/* 底部操作栏 */}
        <div className="flex items-center justify-between mt-3">
          <div
            className={`text-xs font-medium ${
              isOverLimit ? 'text-red-500' : 'text-[var(--color-ink-light)]'
            }`}
          >
            {wordCount} / {MAX_WORDS} 字
            {isOverLimit && (
              <span className="ml-2 text-red-500">超出字数限制</span>
            )}
          </div>
          <button
            onClick={handleSubmit}
            disabled={isEmpty || isOverLimit || isReviewing}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: isReviewing
                ? 'var(--color-ink-light)'
                : 'var(--color-accent)',
              boxShadow:
                '0 4px 14px rgba(13, 148, 136, 0.3)',
            }}
          >
            {isReviewing ? (
              <>
                <span
                  className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
                />
                审核中...
              </>
            ) : (
              <>
                <Send size={15} />
                提交审核
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}