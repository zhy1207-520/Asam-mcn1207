// 头部导航栏
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { FileText, BookOpen, History, User, LogOut } from 'lucide-react';

export function Header() {
  const { isLoggedIn, user, logout } = useAuthStore();
  const location = useLocation();

  if (!isLoggedIn) return null;

  const navItems = [
    { path: '/', label: '工作台', icon: FileText },
    { path: '/rules', label: '规则库', icon: BookOpen },
    { path: '/history', label: '历史记录', icon: History },
    { path: '/profile', label: '个人中心', icon: User },
  ];

  return (
    <header
      className="sticky top-0 z-40 backdrop-blur-lg border-b"
      style={{
        background: 'rgba(250, 248, 245, 0.85)',
        borderColor: 'var(--color-border)',
      }}
    >
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-sm font-bold"
            style={{ background: 'var(--color-accent)' }}
          >
            S
          </div>
          <span
            className="text-lg font-semibold tracking-wide"
            style={{ fontFamily: "'Noto Serif SC', serif" }}
          >
            脚本审阅助手
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'text-white'
                    : 'text-[var(--color-ink-light)] hover:text-[var(--color-ink)] hover:bg-black/5'
                }`}
                style={isActive ? { background: 'var(--color-accent)' } : {}}
              >
                <Icon size={16} />
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <span className="text-sm text-[var(--color-ink-light)] hidden md:inline">
            {user?.nickname}
          </span>
          <button
            onClick={logout}
            className="p-2 rounded-lg hover:bg-red-50 hover:text-red-500 transition-colors text-[var(--color-ink-light)]"
            title="退出登录"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}