// ═══════════════════════════════════════════════════
// JobDetailModal — Popup xem chi tiết Job giữa màn hình
// Đồng nhất giao diện với JobDetailCard trong CompanyDetailsPage
//
// Tracking SDK:
// - Khi mở modal: bắt đầu đếm thời gian xem (dwell timer)
// - Khi đóng modal (nhấn X / click overlay / Escape):
//   dừng timer và ghi nhận sự kiện DWELL_TIME
// ═══════════════════════════════════════════════════
import { useEffect, useRef, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, MapPin, Briefcase, BarChart3, CheckCircle2, Send,
  BookOpen, Code2, Laptop,
} from 'lucide-react';
import { getTracker } from '../../tracking/TrackingSDK';
import ApplyModal from '../modals/ApplyModal';
import { useJobTracking } from '../../hooks/useJobTracking';

export default function JobDetailModal({ job, company, isOpen, onClose }) {
  const tracker = getTracker();
  const { trackClick } = useJobTracking();
  const dwellStartRef = useRef(null);
  const [applyOpen, setApplyOpen] = useState(false);

  // ─── Bắt đầu tracking khi modal mở ────────────────
  useEffect(() => {
    if (isOpen && job) {
      dwellStartRef.current = Date.now();
      // Track CLICK khi mở modal detail
      trackClick(job.id, 0, { sourcePage: 'landing_modal' });
      // Dwell timer dùng plain job.id (KHÔNG dùng prefix — sẽ bị null ở backend)
      tracker.startDwellTimer(job.id);
    }

    return () => {
      if (dwellStartRef.current && job) {
        tracker.stopDwellTimer(job.id);
        dwellStartRef.current = null;
      }
    };
  }, [isOpen, job?.id]);

  // ─── Đóng bằng phím Escape ────────────────────────
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // ─── Lock body scroll khi modal mở ────────────────
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen || !job) return null;

  const skills = job.tags || job.required_skills || [];
  const descLines = job.description
    ? job.description.split(/\\n|\n/).filter(l => l.trim()).slice(0, 10)
    : [];

  return (<>
    <AnimatePresence>
      {isOpen && (
        <>
          {/* ─── Backdrop (vùng mờ bên ngoài) ─────── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
            onClick={onClose}
          />

          {/* ─── Modal ────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="w-full max-w-lg pointer-events-auto rounded-3xl overflow-hidden"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-card)',
                boxShadow: '0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)',
                maxHeight: '90vh',
                overflowY: 'auto',
              }}
            >
              {/* ═══ Header ═══ */}
              <div
                className="p-5 flex items-start justify-between"
                style={{ borderBottom: '1px solid var(--border-divider)' }}
              >
                <div className="flex-1 min-w-0">
                  <h2
                    className="text-lg font-display font-semibold truncate"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {job.title}
                  </h2>
                  <div className="flex flex-wrap gap-3 text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                    {company?.name && (
                      <span className="flex items-center gap-1">
                        <Briefcase size={11} /> {company.name}
                      </span>
                    )}
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
                <button
                  onClick={onClose}
                  className="ml-3 p-2 rounded-xl transition-all hover:bg-white/[0.06]"
                  style={{ color: 'var(--text-muted)' }}
                  aria-label="Đóng"
                >
                  <X size={20} />
                </button>
              </div>

              {/* ═══ Body — Giống hệt JobDetailCard trong CompanyDetailsPage ═══ */}
              <div
                className="px-5 pb-5 pt-4 space-y-4"
              >
                {/* ─── Job Description ─────────────────── */}
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

                {/* ─── Skills & Experience Required ────── */}
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
                </div>

                {/* ─── Môi trường làm việc ─────────────── */}
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
                      { icon: '💰', label: job.salary || job.salary_range || 'Competitive salary' },
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

                {/* ─── Apply Button ────────────────────── */}
                <button
                  onClick={() => setApplyOpen(true)}
                  className="w-full btn-primary text-sm py-3 flex items-center justify-center gap-2"
                >
                  <Send size={14} /> Apply Now
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>

    {/* Apply Modal */}
    <ApplyModal
      job={job}
      isOpen={applyOpen}
      onClose={() => setApplyOpen(false)}
    />
  </>);
}
