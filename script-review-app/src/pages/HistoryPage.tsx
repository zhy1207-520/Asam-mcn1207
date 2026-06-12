// 历史记录页
import { motion } from 'framer-motion';
import { useHistoryStore } from '@/stores/historyStore';
import { Trash2, Clock, Shield } from 'lucide-react';
import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { ReviewResultView } from '@/components/features/ReviewResult';
import { OptimizedOutput } from '@/components/features/OptimizedOutput';
import { useToast } from '@/components/ui/Toast';

export default function HistoryPage() {
  const { records, deleteRecord } = useHistoryStore();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showOptimized, setShowOptimized] = useState(false);
  const { showToast } = useToast();

  const selectedRecord = records.find((r) => r.id === selectedId);

  const handleDelete = (id: string) => {
    deleteRecord(id);
    if (selectedId === id) setSelectedId(null);
    showToast('已删除', 'info');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1
          className="text-2xl font-bold mb-2"
          style={{ fontFamily: "'Noto Serif SC', serif" }}
        >
          历史记录
        </h1>
        <p className="text-sm text-[var(--color-ink-light)]">
          共 {records.length} 条审核记录
        </p>
      </motion.div>

      {records.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-4xl mb-4 opacity-30">📋</div>
          <p className="text-[var(--color-ink-light)]">暂无审核记录</p>
          <p className="text-xs text-[var(--color-ink-light)] mt-1">
            提交审核后可在此查看历史
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {records.map((record, idx) => (
            <motion.div
              key={record.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              className="group rounded-xl p-4 cursor-pointer transition-all duration-200 hover:shadow-md"
              style={{
                background: selectedId === record.id ? 'var(--color-accent-light)' : '#fff',
                boxShadow: 'var(--shadow-sm)',
              }}
              onClick={() => setSelectedId(record.id === selectedId ? null : record.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {record.originalText.slice(0, 50) || '无标题'}
                  </p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="flex items-center gap-1 text-[11px] text-[var(--color-ink-light)]">
                      <Clock size={12} />
                      {new Date(record.reviewedAt).toLocaleString('zh-CN')}
                    </span>
                    <span
                      className="flex items-center gap-1 text-[11px] font-semibold"
                      style={{
                        color:
                          record.score >= 80
                            ? 'var(--color-accent)'
                            : record.score >= 50
                              ? 'var(--color-warning)'
                              : 'var(--color-danger)',
                      }}
                    >
                      <Shield size={12} />
                      {record.score} 分
                    </span>
                    <span className="text-[11px] text-[var(--color-ink-light)]">
                      {record.marks.length} 处标记
                    </span>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(record.id);
                  }}
                  className="p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-50 hover:text-red-500"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* 审核详情弹窗 */}
      <Modal
        open={!!selectedRecord && !showOptimized}
        onClose={() => setSelectedId(null)}
        title="审核详情"
        wide
      >
        {selectedRecord && (
          <div className="space-y-4">
            <ReviewResultView result={selectedRecord} />
            <div className="text-center pt-2">
              <button
                onClick={() => setShowOptimized(true)}
                className="px-6 py-2.5 rounded-xl text-white text-sm font-semibold transition-all duration-300"
                style={{
                  background: 'var(--color-accent)',
                  boxShadow: '0 4px 14px rgba(13, 148, 136, 0.3)',
                }}
              >
                查看优化脚本
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* 优化脚本弹窗 */}
      <Modal
        open={!!selectedRecord && showOptimized}
        onClose={() => setShowOptimized(false)}
        title="优化脚本"
        wide
      >
        {selectedRecord && (
          <OptimizedOutput
            result={selectedRecord}
            onSave={() => {
              setShowOptimized(false);
            }}
          />
        )}
      </Modal>
    </div>
  );
}