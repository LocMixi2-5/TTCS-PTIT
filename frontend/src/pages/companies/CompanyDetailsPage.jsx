// ═══════════════════════════════════════════════════
// CompanyDetailsPage — Company hub with real logo + rich detail sections
// Sections: Company Header, Why Choose Us, Job Listings with
//           Job Description, Skills & Experience, Work Environment
// ═══════════════════════════════════════════════════
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Globe, Briefcase, Loader2, Building2,
  MapPin, BarChart3, CheckCircle2, Star, Users, Award,
  ChevronDown, ChevronUp, ExternalLink, Zap, Heart,
  BookOpen, Code2, Coffee, Laptop, Send,
} from 'lucide-react';
import axios from 'axios';
import CompanyLogo, { getCompanyTheme } from '../../components/cards/CompanyLogo';
import ApplyModal from '../../components/modals/ApplyModal';
import { companies as mockCompanies, jobs as mockJobs } from '../../data/mockData';

// ─── Why Choose Us reasons (per company or generic) ──────────────
const WHY_US_ITEMS = [
  {
    icon: Award,
    color: 'from-violet-500 to-purple-600',
    title: 'Môi trường chuyên nghiệp',
    desc: 'Làm việc cùng đội ngũ chuyên gia hàng đầu, quy trình Agile hiện đại và văn hoá học tập liên tục.',
  },
  {
    icon: Zap,
    color: 'from-amber-500 to-orange-500',
    title: 'Tăng trưởng nhanh',
    desc: 'Lộ trình thăng tiến rõ ràng, đánh giá năng lực định kỳ và cơ hội được giao dự án lớn từ sớm.',
  },
  {
    icon: Heart,
    color: 'from-rose-500 to-pink-600',
    title: 'Phúc lợi hấp dẫn',
    desc: 'Lương cạnh tranh thị trường, thưởng hiệu suất, bảo hiểm sức khoẻ cao cấp và 15+ ngày nghỉ phép.',
  },
  {
    icon: Coffee,
    color: 'from-emerald-500 to-teal-600',
    title: 'Work-life balance',
    desc: 'Văn phòng hiện đại, chính sách làm việc linh hoạt (hybrid/remote) và hoạt động team-building thường xuyên.',
  },
];

// ─── Job Detail Expanded Card ──────────────────────────────────────
function JobDetailCard({ job, index }) {
  const [isOpen, setIsOpen] = useState(false);
  const [applyOpen, setApplyOpen] = useState(false);

  const skills = job.required_skills || [];
  const descLines = job.description
    ? job.description.split('\n').filter(l => l.trim()).slice(0, 10)
    : [];

  return (<>
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="glass-card overflow-hidden"
    >
      {/* Card Header */}
      <button
        className="w-full p-5 flex items-start gap-4 text-left group"
        onClick={() => setIsOpen(!isOpen)}
        id={`job-card-toggle-${job.id}`}
      >
        {/* Rank */}
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #4f46e5, #818cf8)' }}
        >
          {index + 1}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3
            className="text-base font-semibold mb-1 group-hover:text-primary-400 transition-colors truncate"
            style={{ color: 'var(--text-primary)' }}
          >
            {job.title}
          </h3>
          <div className="flex flex-wrap gap-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
            {job.location && (
              <span className="flex items-center gap-1">
                <MapPin size={11} /> {job.location}
              </span>
            )}
            {job.experience_level && (
              <span className="flex items-center gap-1">
                <BarChart3 size={11} /> {job.experience_level}
              </span>
            )}
            {job.employment_type && (
              <span className="flex items-center gap-1">
                <Briefcase size={11} /> {job.employment_type}
              </span>
            )}
          </div>
          {/* Skill preview */}
          {skills.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {skills.slice(0, 5).map(s => (
                <span key={s} className="skill-tag skill-tag--matched">{s}</span>
              ))}
              {skills.length > 5 && (
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  +{skills.length - 5}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Expand icon */}
        <div className="flex-shrink-0 flex items-center gap-2">
          <button
            onClick={e => { e.stopPropagation(); setApplyOpen(true); }}
            id={`company-apply-btn-${job.id}`}
            className="btn-primary text-xs px-3 py-2 flex items-center gap-1.5"
          >
            <Send size={12} /> Apply Now
          </button>
          <div style={{ color: 'var(--text-muted)' }}>
            {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>
        </div>
      </button>

      {/* Expanded Detail */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28 }}
            className="overflow-hidden"
          >
            <div
              className="px-5 pb-5 pt-2 space-y-4"
              style={{ borderTop: '1px solid var(--border-divider)' }}
            >
              {/* Job Description */}
              {descLines.length > 0 && (
                <div className="job-detail-section">
                  <h4 className="flex items-center gap-2 text-sm font-semibold mb-3">
                    <BookOpen size={15} className="text-primary-400" />
                    Job Description
                  </h4>
                  <ul className="space-y-1.5">
                    {descLines.map((line, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm leading-relaxed">
                        <CheckCircle2 size={13} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span style={{ color: 'var(--text-secondary)' }}>
                          {line.replace(/^[-•*]\s*/, '')}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Skills & Experience */}
              <div className="job-detail-section">
                <h4 className="flex items-center gap-2 text-sm font-semibold mb-3">
                  <Code2 size={15} className="text-violet-400" />
                  Skills &amp; Experience Required
                </h4>
                {skills.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {skills.map(s => (
                      <span key={s} className="skill-tag skill-tag--matched">{s}</span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    Xem mô tả chi tiết để biết yêu cầu kỹ năng.
                  </p>
                )}
                {job.experience_level && (
                  <div
                    className="mt-2 inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full"
                    style={{
                      background: 'rgba(139,92,246,0.15)',
                      color: '#a78bfa',
                      border: '1px solid rgba(139,92,246,0.25)',
                    }}
                  >
                    <BarChart3 size={12} />
                    Cấp độ: {job.experience_level}
                  </div>
                )}
                {job.skills_desc && (
                  <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {job.skills_desc}
                  </p>
                )}
              </div>

              {/* Working Environment */}
              <div className="job-detail-section">
                <h4 className="flex items-center gap-2 text-sm font-semibold mb-3">
                  <Laptop size={15} className="text-amber-400" />
                  Môi trường làm việc
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { icon: '🏢', label: job.work_type || 'At office / Hybrid' },
                    { icon: '📍', label: job.location || 'Việt Nam' },
                    { icon: '🕐', label: job.employment_type || 'Full-time' },
                    { icon: '💰', label: job.salary_range || 'Competitive salary' },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg"
                      style={{ background: 'var(--bg-btn-ghost)', color: 'var(--text-secondary)' }}
                    >
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>

    {/* Apply Modal */}
    <ApplyModal
      job={job}
      isOpen={applyOpen}
      onClose={() => setApplyOpen(false)}
    />
  </>);
}

import { companiesAPI } from '../../services/api';

// ═══════════════════════════════════════════════════
// Main Page
// ═══════════════════════════════════════════════════
export default function CompanyDetailsPage() {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanyData = async () => {
      setLoading(true);
      try {
        const [compRes, jobsRes] = await Promise.all([
          companiesAPI.getById(id),
          companiesAPI.getJobs(id)
        ]);
        setCompany(compRes.data);
        
        // Ensure required_skills array is parsed if it's a string from db
        const parsedJobs = jobsRes.data.jobs.map(j => ({
          ...j,
          required_skills: typeof j.required_skills === 'string' 
            ? j.required_skills.replace(/[{}]/g, '').split(',').map(s => s.trim()) 
            : (j.required_skills || [])
        }));
        
        setJobs(parsedJobs);
      } catch (err) {
        console.error('Error fetching company info:', err);
        setCompany(null);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanyData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="text-center">
          <Loader2 size={48} className="animate-spin mx-auto mb-4 text-primary-400" />
          <p style={{ color: 'var(--text-secondary)' }}>Đang tải thông tin công ty...</p>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 pt-24">
        <div className="glass-card p-10 max-w-md text-center">
          <Building2 size={48} className="mx-auto mb-4 text-primary-400" />
          <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
            Không tìm thấy công ty
          </h2>
          <Link to="/companies" className="btn-primary inline-flex items-center gap-2 mt-2">
            <ArrowLeft size={16} /> Quay lại danh sách
          </Link>
        </div>
      </div>
    );
  }

  const { themeColor } = getCompanyTheme(company);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="ambient-bg" />
      <div className="max-w-6xl mx-auto relative z-10">

        {/* Back link */}
        <Link
          to="/companies"
          className="inline-flex items-center gap-1.5 text-sm mb-6 transition-colors hover:text-primary-400"
          style={{ color: 'var(--text-secondary)' }}
        >
          <ArrowLeft size={14} />
          Quay lại danh sách công ty
        </Link>

        {/* ═══ SECTION 1: Company Header ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card overflow-hidden mb-8"
        >
          {/* Gradient banner */}
          <div
            className="h-40 relative"
            style={{
              background: `linear-gradient(135deg, ${themeColor}40 0%, rgba(20,184,166,0.28) 50%, rgba(167,139,250,0.20) 100%)`,
            }}
          >
            {/* Decorative circles */}
            <div className="absolute top-4 right-8 w-24 h-24 rounded-full bg-white/5 blur-xl" />
            <div className="absolute bottom-2 left-16 w-16 h-16 rounded-full bg-primary-500/10 blur-lg" />
          </div>

          <div className="px-8 pb-8 relative -mt-14">
            {/* Logo */}
            <CompanyLogo company={company} size={88} />

            <div className="mt-5 flex flex-col md:flex-row md:items-start justify-between gap-5">
              <div className="flex-1">
                <h1 className="text-3xl font-display font-bold mb-2" style={{ color: themeColor }}>
                  {company.name}
                </h1>
                <div className="flex flex-wrap gap-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {company.website && (
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 hover:text-primary-400 transition-colors"
                    >
                      <Globe size={14} /> Website
                    </a>
                  )}
                  <span className="flex items-center gap-1.5">
                    <Briefcase size={14} />
                    {jobs.length} vị trí đang tuyển
                  </span>
                  {company.industry && (
                    <span className="flex items-center gap-1.5">
                      <Building2 size={14} /> {company.industry}
                    </span>
                  )}
                  {company.company_size && (
                    <span className="flex items-center gap-1.5">
                      <Users size={14} /> {company.company_size} nhân viên
                    </span>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <button className="btn-ghost text-sm flex items-center gap-1.5">
                  <Star size={14} /> Theo dõi
                </button>
                {company.website && (
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-primary text-sm flex items-center gap-1.5"
                  >
                    <Globe size={14} /> Xem website
                  </a>
                )}
              </div>
            </div>

            {/* Description */}
            {(company.fullDescription || company.description) && (
              <div className="mt-6 pt-6" style={{ borderTop: '1px solid var(--border-divider)' }}>
                <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                  Giới thiệu
                </h2>
                <p className="text-sm leading-relaxed max-w-3xl" style={{ color: 'var(--text-secondary)' }}>
                  {company.fullDescription || company.description}
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* ═══ SECTION 2: Why Choose Us ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
              <Star size={16} className="text-white" />
            </div>
            <h2 className="text-2xl font-display font-bold" style={{ color: themeColor }}>
              Lý do chọn {company.name}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {(company.reasonsToJoin || WHY_US_ITEMS).map((item, i) => {
              const Icon = item.icon || WHY_US_ITEMS[i % WHY_US_ITEMS.length].icon;
              const bgClass = item.color || WHY_US_ITEMS[i % WHY_US_ITEMS.length].color;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.07 }}
                  className="glass-card p-5 group hover:border-primary-500/30 transition-all duration-300"
                >
                  <div
                    className={`w-11 h-11 rounded-xl bg-gradient-to-br ${bgClass} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}
                  >
                    <Icon size={20} className="text-white" />
                  </div>
                  <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                    {item.title}
                  </h3>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {item.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* ═══ SECTION 3: Job Listings with Full Details ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <Briefcase size={16} className="text-white" />
            </div>
            <h2 className="text-2xl font-display font-bold" style={{ color: 'var(--text-primary)' }}>
              Vị trí tuyển dụng
              <span className="ml-2 text-base font-medium text-primary-400">({jobs.length})</span>
            </h2>
          </div>

          {jobs.length > 0 ? (
            <div className="space-y-3">
              {jobs.map((job, i) => (
                <JobDetailCard key={job.id} job={job} index={i} />
              ))}
            </div>
          ) : (
            <div className="glass-card p-12 text-center">
              <Briefcase size={40} className="mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
              <p style={{ color: 'var(--text-secondary)' }}>
                Hiện tại công ty không có đợt tuyển dụng nào.
              </p>
            </div>
          )}
        </motion.div>

      </div>
    </div>
  );
}
