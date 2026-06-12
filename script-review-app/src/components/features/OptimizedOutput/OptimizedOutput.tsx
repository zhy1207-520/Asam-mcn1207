// 优化脚本输出组件
import { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Copy, Download, Check, Edit3, Save } from 'lucide-react';
import type { ReviewResult } from '@/types';

interface OptimizedOutputProps {
  result: ReviewResult;
  onSave: (result: ReviewResult) => void;
}

export function OptimizedOutput({ result, onSave }: OptimizedOutputProps) {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(result.optimizedText);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(editText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // 降级
      textareaRef.current?.select();
      document.execCommand('copy');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [editText]);

  const handleDownload = useCallback(() => {
    const blob = new Blob([editText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `优化脚本_${new Date(result.reviewedAt).toLocaleDateString('zh-CN')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }, [editText, result.reviewedAt]);

  const handleSave = useCallback(() => {
    onSave({ ...result, optimizedText: editText });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [editText, onSave, result]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="rounded-2xl overflow-hidden"
      style={{ background: '#fff', boxShadow: 'var(--shadow-lg)' }}
    >
      {/* 标题栏 */}
      <div
        className="flex items-center justify-between px-5 py-4 border-b"
        style={{
          borderColor: 'var(--color-border-light)',
          background: 'linear-gradient(135deg, #ddf4f0 0%, #f0fdf4 100%)',
        }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{ background: 'var(--color-accent)' }}
          />
          <h2
            className="text-base font-semibold"
            style={{
              fontFamily: "'Noto Serif SC', serif",
              color: 'var(--color-accent)',
            }}
          >
            优化后脚本
          </h2>
          <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">
            可直接使用
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setEditing(!editing)}
            className="p-2 rounded-lg text-sm text-[var(--color-ink-light)] hover:bg-white/60 transition-colors flex items-center gap-1"
          >
            {editing ? (
              <>
                <span className="w-2 h-2 rounded-full bg-orange-500" />
                <span className="hidden sm:inline">编辑中</span>
              </>
            ) : (
              <>
                <Edit3 size={15} />
                <span className="hidden sm:inline">编辑</span>
              </>
            )}
          </button>
          <button
            onClick={handleDownload}
            className="p-2 rounded-lg text-sm text-[var(--color-ink-light)] hover:bg-white/60 transition-colors flex items-center gap-1"
          >
            <Download size={15} />
            <span className="hidden sm:inline">下载</span>
          </button>
        </div>
      </div>

      {/* 内容区 */}
      <div className="p-5">
        {editing ? (
          <textarea
            ref={textareaRef}
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="w-full min-h-[200px] rounded-xl p-4 text-sm leading-relaxed outline-none border resize-y"
            style={{
              fontFamily: "'Noto Sans SC', sans-serif",
              borderColor: 'var(--color-accent)',
              background: 'var(--color-bg)',
              color: 'var(--color-ink)',
            }}
          />
        ) : (
          <div
            className="rounded-xl p-4 min-h-[160px] text-sm leading-relaxed whitespace-pre-wrap"
            style={{
              background: 'var(--color-bg)',
              color: 'var(--color-ink)',
            }}
          >
            {/* Diff 对比视图 */}
            {result.diffData.map((entry, idx) => {
              if (entry.type === 'remove') return null; // 删除的内容不展示
              if (entry.type === 'add') {
                return (
                  <span
                    key={idx}
                    className="inline bg-green-100 text-green-800 rounded px-0.5 border-b border-green-300"
                    title={entry.suggestion}
                  >
                    {entry.text}
                  </span>
                );
              }
              return <span key={idx}>{entry.text}</span>;
            })}
          </div>
        )}

        {/* 操作按钮 */}
        <div className="flex items-center gap-2 mt-4">
          <button
            onClick={handleCopy}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-300 ${
              copied ? 'scale-105' : ''
            }`}
            style={{
              background: copied ? '#059669' : 'var(--color-accent)',
              boxShadow:
                '0 4px 14px rgba(13, 148, 136, 0.3)',
            }}
          >
            {copied ? (
              <>
                <Check size={16} />
                已复制
              </>
            ) : (
              <>
                <Copy size={16} />
                一键复制
              </>
            )}
          </button>
          <button
            onClick={handleSave}
            disabled={saved}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
              saved
                ? 'bg-green-500 text-white'
                : 'bg-[var(--color-ink)] text-white hover:bg-black'
            }`}
          >
            {saved ? (
              <>
                <Check size={16} />
                已保存
              </>
            ) : (
              <>
                <Save size={16} />
                保存到历史
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}