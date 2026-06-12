// 个人中心页
import { motion } from 'framer-motion';
import { useAuthStore } from '@/stores/authStore';
import { useHistoryStore } from '@/stores/historyStore';
import { User, LogOut, Shield, FileText, MessageCircle } from 'lucide-react';

export default function ProfilePage() {
  const { user, logout } = useAuthStore();
  const records = useHistoryStore((s) => s.records);

  const totalReviews = records.length;
  const avgScore =
    totalReviews > 0
      ? Math.round(
          records.reduce((sum, r) => sum + r.score, 0) / totalReviews
        )
      : 0;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1
          className="text-2xl font-bold mb-2"
          style={{ fontFamily: "'Noto Serif SC', serif" }}
        >
          个人中心
        </h1>
      </motion.div>

      {/* 用户信息卡片 */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl p-6 text-center"
        style={{ background: '#fff', boxShadow: 'var(--shadow-md)' }}
      >
        <div
          className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-3"
          style={{ background: 'var(--color-bg)' }}
        >
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt="avatar"
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <User size={28} className="text-[var(--color-ink-light)]" />
          )}
        </div>
        <h2
          className="text-lg font-semibold"
          style={{ fontFamily: "'Noto Serif SC', serif" }}
        >
          {user?.nickname || '微信用户'}
        </h2>
        <p className="text-xs text-[var(--color-ink-light)] mt-1">
          已通过微信授权登录
        </p>
      </motion.div>

      {/* 统计卡片 */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="grid grid-cols-3 gap-3"
      >
        {[
          {
            icon: FileText,
            label: '审核次数',
            value: totalReviews,
            color: 'var(--color-accent)',
          },
          {
            icon: Shield,
            label: '平均评分',
            value: avgScore,
            color: 'var(--color-warning)',
          },
          {
            icon: MessageCircle,
            label: '优化脚本',
            value: totalReviews,
            color: 'var(--color-ink)',
          },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-xl p-4 text-center"
            style={{ background: '#fff', boxShadow: 'var(--shadow-sm)' }}
          >
            <item.icon size={20} style={{ color: item.color }} className="mx-auto mb-1" />
            <div
              className="text-xl font-bold"
              style={{ fontFamily: "'Noto Serif SC', serif" }}
            >
              {item.value}
            </div>
            <div className="text-[11px] text-[var(--color-ink-light)]">
              {item.label}
            </div>
          </div>
        ))}
      </motion.div>

      {/* 退出登录 */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl p-4"
        style={{ background: '#fff', boxShadow: 'var(--shadow-sm)' }}
      >
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
        >
          <LogOut size={16} />
          退出登录
        </button>
      </motion.div>
    </div>
  );
}