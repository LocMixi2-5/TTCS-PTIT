// ═══════════════════════════════════════════════════
// Navbar — Navigation bar with auth state + theme toggle
// ═══════════════════════════════════════════════════
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Briefcase, LogOut, User, LayoutDashboard, Building2, Sparkles, Sun, Moon } from 'lucide-react';
import useAuthStore from '../../stores/authStore';
import useThemeStore from '../../stores/themeStore';
import { useEffect } from 'react';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { isDark, toggleTheme, initTheme } = useThemeStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    initTheme();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl"
      style={{
        background: 'var(--bg-navbar)',
        borderBottom: '1px solid var(--border-navbar)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:shadow-primary-500/40 transition-shadow">
              <Briefcase size={18} className="text-white" />
            </div>
            <span className="text-lg font-display font-bold" style={{ color: 'var(--text-primary)' }}>
              Job<span className="text-primary-400">AI</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-1">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive('/dashboard')
                      ? 'bg-primary-500/15 text-primary-400'
                      : 'hover:bg-white/[0.04]'
                  }`}
                  style={{ color: isActive('/dashboard') ? undefined : 'var(--text-secondary)' }}
                >
                  <LayoutDashboard size={16} />
                  Dashboard
                </Link>

                <Link
                  to="/companies"
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive('/companies')
                      ? 'bg-primary-500/15 text-primary-400'
                      : 'hover:bg-white/[0.04]'
                  }`}
                  style={{ color: isActive('/companies') ? undefined : 'var(--text-secondary)' }}
                >
                  <Building2 size={16} />
                  Công ty
                </Link>

                <div className="w-px h-6 mx-2" style={{ background: 'var(--border-navbar)' }} />

                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className="theme-toggle"
                  title={isDark ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'}
                  id="theme-toggle-btn"
                >
                  {isDark ? <Sun size={16} /> : <Moon size={16} />}
                </button>

                <div className="flex items-center gap-3 ml-1">
                  <div
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                    style={{ background: 'var(--bg-btn-ghost)' }}
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center">
                      <User size={12} className="text-white" />
                    </div>
                    <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                      {user?.full_name || user?.email?.split('@')[0]}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-lg hover:bg-red-500/10 hover:text-red-400 transition-all"
                    style={{ color: 'var(--text-muted)' }}
                    title="Đăng xuất"
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Theme Toggle (guest) */}
                <button
                  onClick={toggleTheme}
                  className="theme-toggle mr-2"
                  title={isDark ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'}
                  id="theme-toggle-btn-guest"
                >
                  {isDark ? <Sun size={16} /> : <Moon size={16} />}
                </button>
                <Link to="/login" className="btn-ghost text-sm">
                  Đăng nhập
                </Link>
                <Link to="/register" className="btn-primary text-sm flex items-center gap-1.5 ml-1">
                  <Sparkles size={14} />
                  Bắt đầu
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
