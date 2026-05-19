// ═══════════════════════════════════════════════════
// Auth Store — Zustand state management
// Manages user authentication state + JWT token
// ═══════════════════════════════════════════════════
import { create } from 'zustand';
import { authAPI } from '../services/api';

const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,

  // ─── Login ─────────────────────────────────────
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await authAPI.login({ email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      set({
        user: data.user,
        token: data.token,
        isAuthenticated: true,
        isLoading: false,
      });
      return data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.response?.data?.error || 'Login failed';
      set({ error: errorMsg, isLoading: false });
      throw err;
    }
  },

  // ─── Register ──────────────────────────────────
  register: async (email, password, fullName) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await authAPI.register({ email, password, full_name: fullName });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      set({
        user: data.user,
        token: data.token,
        isAuthenticated: true,
        isLoading: false,
      });
      return data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.response?.data?.error || 'Registration failed';
      set({ error: errorMsg, isLoading: false });
      throw err;
    }
  },

  // ─── Logout ────────────────────────────────────
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
    });
  },

  // ─── Refresh User Data ─────────────────────────
  refreshUser: async () => {
    try {
      const { data } = await authAPI.getMe();
      localStorage.setItem('user', JSON.stringify(data.user));
      set({ user: data.user });
    } catch (err) {
      // Token invalid — logout
      get().logout();
    }
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;
