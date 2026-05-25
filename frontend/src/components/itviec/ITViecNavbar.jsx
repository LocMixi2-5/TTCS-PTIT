import { Link, useNavigate } from 'react-router-dom';
import { Building2, Search, User, LogIn, LogOut, LayoutDashboard } from 'lucide-react';
import useAuthStore from '../../stores/authStore';

export default function ITViecNavbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="w-full flex flex-col relative z-50">
      {/* Main Navbar */}
      <nav className="w-full h-16 bg-[#002d5c] text-white flex items-center px-6 lg:px-12 justify-between shrink-0 shadow-md">
        <div className="flex items-center gap-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-2xl font-bold tracking-tight">
              Job<span className="text-[#38bdf8]">AI</span>
            </span>
          </Link>
          
          {/* Nav Links (Desktop) */}
          <div className="hidden md:flex items-center gap-6 font-medium text-sm">
            <Link to="/jobs" className="hover:text-blue-200 transition-colors">Việc làm IT</Link>
            <Link to="/companies" className="hover:text-blue-200 transition-colors">Top Công ty</Link>
            <Link to="/blog" className="hover:text-blue-200 transition-colors">Blog</Link>
          </div>
        </div>

        {/* Auth / Actions */}
        <div className="flex items-center gap-4">
          <Link to="/employers" className="hidden lg:block text-sm font-medium text-blue-200 hover:text-white transition-colors">
            Nhà tuyển dụng
          </Link>
          <div className="w-px h-5 bg-white/20 hidden lg:block"></div>
          
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link to="/dashboard" className="flex items-center gap-2 text-sm font-medium hover:text-[#38bdf8] transition-colors">
                <LayoutDashboard size={18} />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 border border-white/10">
                <div className="w-6 h-6 rounded-full bg-[#0a66c2] flex items-center justify-center">
                  <User size={12} className="text-white" />
                </div>
                <span className="text-sm font-medium text-white">
                  {user?.full_name || user?.email?.split('@')[0]}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg hover:bg-white/10 text-gray-300 hover:text-white transition-all"
                title="Đăng xuất"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="flex items-center gap-2 text-sm font-medium hover:text-blue-200 transition-colors">
              <LogIn size={18} />
              <span className="hidden sm:inline">Đăng nhập</span>
            </Link>
          )}
        </div>
      </nav>

      {/* Light Blue Notification Banner */}
      <div className="w-full bg-[#e8f3ff] text-[#002d5c] py-2 px-4 text-center text-sm font-medium flex items-center justify-center gap-2 border-b border-[#cce4ff]">
        <span>🎉 Khám phá ngay hệ thống gợi ý việc làm bằng AI SBERT!</span>
        <Link to="/register" className="underline font-bold text-[#0a66c2] hover:text-[#004182]">Upload CV ngay</Link>
      </div>
    </div>
  );
}
