// 登录页 — 微信视频号登录
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/stores/authStore';
import { MessageCircle } from 'lucide-react';
import { useState } from 'react';

export default function LoginPage() {
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    await login();
    setLoading(false);
    navigate('/');
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'var(--color-bg)' }}
    >
      {/* 装饰性背景 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-20 left-1/4 w-72 h-72 rounded-full blur-3xl opacity-20"
          style={{ background: 'var(--color-accent)' }}
        />
        <div
          className="absolute bottom-20 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-10"
          style={{ background: 'var(--color-warning)' }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative w-full max-w-md"
      >
        <div
          className="rounded-3xl p-8 sm:p-10 text-center"
          style={{
            background: '#fff',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          {/* Logo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center text-white"
            style={{
              background: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)',
              boxShadow: '0 8px 30px rgba(13, 148, 136, 0.3)',
            }}
          >
            <MessageCircle size={36} />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold mb-2"
            style={{ fontFamily: "'Noto Serif SC', serif" }}
          >
            视频号脚本审阅助手
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-sm text-[var(--color-ink-light)] mb-8"
          >
            智能审核 · 敏感词检测 · 一键优化 · 合规无忧
          </motion.p>

          {/* 功能介绍 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-3 gap-3 mb-8"
          >
            {[
              { icon: '🔍', label: '敏感词检测' },
              { icon: '📋', label: '规则审核' },
              { icon: '✨', label: '智能优化' },
            ].map((item) => (
              <div
                key={item.label}
                className="p-3 rounded-xl text-center"
                style={{ background: 'var(--color-bg)' }}
              >
                <div className="text-lg mb-1">{item.icon}</div>
                <div className="text-[11px] text-[var(--color-ink-light)] font-medium">
                  {item.label}
                </div>
              </div>
            ))}
          </motion.div>

          {/* 登录按钮 */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-60"
            style={{
              background: loading
                ? 'var(--color-ink-light)'
                : 'linear-gradient(135deg, #07c160 0%, #06ad56 100%)',
              boxShadow:
                '0 4px 16px rgba(7, 193, 96, 0.3)',
            }}
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                登录中...
              </>
            ) : (
              <>
                <svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  fill="currentColor"
                >
                  <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178A1.17 1.17 0 014.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178 1.17 1.17 0 01-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 01.598.082l1.584.926a.272.272 0 00.14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 01-.023-.156.49.49 0 01.201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.952-7.062-6.122z" />
                </svg>
                微信一键登录
              </>
            )}
          </motion.button>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-[11px] text-[var(--color-ink-light)] mt-4"
          >
            登录即表示同意《用户协议》和《隐私政策》
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}