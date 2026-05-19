// ═══════════════════════════════════════════════════
// App.jsx — Main Application with Routing
// ═══════════════════════════════════════════════════
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ResultsPage from './pages/ResultsPage';
import CompaniesPage from './pages/companies/CompaniesPage';
import CompanyDetailsPage from './pages/companies/CompanyDetailsPage';
import useAuthStore from './stores/authStore';

// Protected Route wrapper
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

// Redirect if already logged in
function GuestRoute({ children }) {
  const { isAuthenticated } = useAuthStore();
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

export default function App() {
  return (
    <div className="relative">
      <Navbar />
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />

        {/* Guest only (redirect to dashboard if logged in) */}
        <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />

        {/* Protected (require auth) */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/results/:cvId" element={<ProtectedRoute><ResultsPage /></ProtectedRoute>} />

        {/* Companies (Public or Protected, let's make it Protected to match) */}
        <Route path="/companies" element={<ProtectedRoute><CompaniesPage /></ProtectedRoute>} />
        <Route path="/companies/:id" element={<ProtectedRoute><CompanyDetailsPage /></ProtectedRoute>} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
