import { create } from 'zustand';
import type { UserInfo } from '@/types';

interface AuthState {
  user: UserInfo | null;
  isLoggedIn: boolean;
  login: () => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoggedIn: false,

  login: async () => {
    // 模拟微信 OAuth 登录流程
    await new Promise((resolve) => setTimeout(resolve, 800));
    const mockUser: UserInfo = {
      id: 'wx_user_' + Date.now(),
      nickname: '微信用户',
      avatar: '',
    };
    localStorage.setItem('auth_user', JSON.stringify(mockUser));
    set({ user: mockUser, isLoggedIn: true });
  },

  logout: () => {
    localStorage.removeItem('auth_user');
    localStorage.removeItem('review_history');
    set({ user: null, isLoggedIn: false });
  },
}));

// 从本地存储恢复登录态
const saved = localStorage.getItem('auth_user');
if (saved) {
  try {
    const user = JSON.parse(saved) as UserInfo;
    useAuthStore.setState({ user, isLoggedIn: true });
  } catch { /* ignore */ }
}