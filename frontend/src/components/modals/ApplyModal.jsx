// ═══════════════════════════════════════════════════
// ApplyModal — Nộp CV & xem kết quả so khớp ngay
// Upload CV PDF → AI so khớp với job cụ thể → hiển thị score + skills
// ═══════════════════════════════════════════════════
import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import {
  X, Upload, FileText, Loader2, CheckCircle2, AlertTriangle,
  Target, Sparkles, ChevronRight, RotateCcw, ExternalLink,
  TrendingUp, BookOpen, Lightbulb,
} from 'lucide-react';
import { toast } from 'sonner';
import { jobsAPI } from '../../services/api';

// ─── Score Ring (SVG) ──────────────────────────────
function ScoreRing({ score, size = 120 }) {
  const radius = (size - 10) / 2;
  const circ = 2 * Math.PI * radius;
  const pct = Math.min(Math.max(score || 0, 0), 100);
  const offset = circ - (pct / 100) * circ;
  const color = pct >= 70 ? '#34d399' : pct >= 45 ? '#fbbf24' : '#f87171';
  const label = pct >= 70 ? 'Xuất sắc' : pct >= 45 ? 'Khá phù hợp' : 'Cần cải thiện';

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius}
            stroke="rgba(255,255,255,0.08)" strokeWidth="8" fill="none" />
          <motion.circle
            cx={size / 2} cy={size / 2} r={radius}
            stroke={color} strokeWidth="8" fill="none"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-3xl font-bold"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            style={{ color }}
          >
            {Math.round(pct)}%
          </motion.span>
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>phù hợp</span>
        </div>
      </div>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-sm font-semibold"
        style={{ color }}
      >
        {label}
      </motion.span>
    </div>
  );
}

// ─── Upload Zone ───────────────────────────────────
function CVDropzone({ onFile, isLoading }) {
  const [dragging, setDragging] = useState(false);

  const onDrop = useCallback((accepted) => {
    if (accepted[0]) onFile(accepted[0]);
  }, [onFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
    disabled: isLoading,
  });

  return (
    <div
      {...getRootProps()}
      id="apply-modal-dropzone"
      className={`rounded-2xl border-2 border-dashed p-8 text-center cursor-pointer transition-all duration-300 ${
        isDragActive
          ? 'border-primary-500 bg-primary-500/10 scale-[1.02]'
          : isLoading
            ? 'border-white/[0.06] opacity-50 cursor-not-allowed'
            : 'border-white/[0.1] hover:border-primary-500/50 hover:bg-primary-500/5'
      }`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-3">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)' }}
        >
          <Upload size={24} className="text-primary-400" />
        </div>
        <div>
          <p className="font-medium text-white mb-1">
            {isDragActive ? 'Thả file vào đây...' : 'Kéo thả hoặc nhấn để chọn CV'}
          </p>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>PDF • Tối đa 10MB</p>
        </div>
      </div>
    </div>
  );
}

// ─── Skill Tag ─────────────────────────────────────
function SkillTag({ skill, type }) {
  const colors = {
    matched: { bg: 'rgba(52,211,153,0.12)', border: 'rgba(52,211,153,0.3)', text: '#34d399' },
    missing: { bg: 'rgba(251,191,36,0.12)', border: 'rgba(251,191,36,0.3)', text: '#fbbf24' },
    cv: { bg: 'rgba(99,102,241,0.12)', border: 'rgba(99,102,241,0.3)', text: '#818cf8' },
  };
  const c = colors[type] || colors.cv;
  return (
    <span
      className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium"
      style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.text }}
    >
      {skill}
    </span>
  );
}

// ═══════════════════════════════════════════════════
// ApplyModal — Main Component
// ═══════════════════════════════════════════════════
export default function ApplyModal({ job, isOpen, onClose }) {
  const [phase, setPhase] = useState('upload'); // 'upload' | 'loading' | 'result' | 'error'
  const [selectedFile, setSelectedFile] = useState(null);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const reset = () => {
    setPhase('upload');
    setSelectedFile(null);
    setResult(null);
    setErrorMsg('');
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFile = (file) => {
    setSelectedFile(file);
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;
    setPhase('loading');
    try {
      const { data } = await jobsAPI.applyWithCV(job.id, selectedFile);
      setResult(data);
      setPhase('result');
    } catch (err) {
      const msg = err.response?.data?.detail || err.response?.data?.error || err.message;
      setErrorMsg(msg || 'Đã xảy ra lỗi khi xử lý CV');
      setPhase('error');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
            onClick={handleClose}
          />

          {/* Modal */}
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
              {/* Header */}
              <div
                className="p-5 flex items-start justify-between"
                style={{ borderBottom: '1px solid var(--border-divider)' }}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-7 h-7 rounded-lg bg-primary-500/20 flex items-center justify-center">
                      <Sparkles size={14} className="text-primary-400" />
                    </div>
                    <span className="text-xs font-medium text-primary-400">Apply Now</span>
                  </div>
                  <h2 className="text-lg font-display font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                    {job?.title}
                  </h2>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {job?.company_name} {job?.location ? `• ${job.location}` : ''}
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  id="apply-modal-close"
                  className="ml-3 p-2 rounded-xl transition-all hover:bg-white/[0.06]"
                  style={{ color: 'var(--text-muted)' }}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Body */}
              <div className="p-5">
                <AnimatePresence mode="wait">

                  {/* ── Phase: Upload ── */}
                  {phase === 'upload' && (
                    <motion.div
                      key="upload"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center gap-2 p-3 rounded-xl" style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)' }}>
                        <Target size={16} className="text-primary-400 flex-shrink-0" />
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                          Upload CV của bạn — AI sẽ so khớp ngay với vị trí này và cho biết độ phù hợp
                        </p>
                      </div>

                      <CVDropzone onFile={handleFile} isLoading={false} />

                      {selectedFile && (
                        <motion.div
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-3 p-3 rounded-xl"
                          style={{ background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)' }}
                        >
                          <FileText size={18} className="text-emerald-400 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-emerald-400 truncate">{selectedFile.name}</p>
                            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                              {(selectedFile.size / 1024).toFixed(0)} KB • PDF
                            </p>
                          </div>
                          <button
                            onClick={() => setSelectedFile(null)}
                            className="text-xs px-2 py-1 rounded-lg transition-all hover:bg-white/[0.06]"
                            style={{ color: 'var(--text-muted)' }}
                          >
                            Xóa
                          </button>
                        </motion.div>
                      )}

                      <button
                        onClick={handleSubmit}
                        disabled={!selectedFile}
                        id="apply-modal-submit"
                        className="w-full btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <Sparkles size={16} />
                        Phân tích độ phù hợp với AI
                        <ChevronRight size={16} />
                      </button>
                    </motion.div>
                  )}

                  {/* ── Phase: Loading ── */}
                  {phase === 'loading' && (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="py-12 flex flex-col items-center gap-5"
                    >
                      <div className="relative">
                        <div
                          className="w-20 h-20 rounded-3xl flex items-center justify-center"
                          style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)' }}
                        >
                          <Loader2 size={36} className="text-primary-400 animate-spin" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                          <motion.div
                            animate={{ scale: [1, 1.3, 1] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            className="w-2 h-2 rounded-full bg-emerald-400"
                          />
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="font-semibold text-white mb-1">AI đang phân tích CV...</p>
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                          Đọc CV → Trích xuất kỹ năng → So khớp với yêu cầu vị trí
                        </p>
                      </div>
                      <div className="flex gap-1.5">
                        {[0, 0.2, 0.4].map((delay) => (
                          <motion.div
                            key={delay}
                            animate={{ y: [0, -8, 0] }}
                            transition={{ repeat: Infinity, duration: 0.8, delay }}
                            className="w-2 h-2 rounded-full bg-primary-400"
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* ── Phase: Result ── */}
                  {phase === 'result' && result && (
                    <motion.div
                      key="result"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-5"
                    >
                      {/* Score Ring */}
                      <div className="flex justify-center py-2">
                        {result.ai_available === false ? (
                          <div className="text-center py-4">
                            <AlertTriangle size={40} className="text-amber-400 mx-auto mb-3" />
                            <p className="font-semibold text-white mb-1">AI Worker chưa khả dụng</p>
                            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                              {result.message}
                            </p>
                          </div>
                        ) : (
                          <ScoreRing score={result.match_score} size={140} />
                        )}
                      </div>

                      {result.ai_available !== false && (
                        <>
                          {/* Matched skills */}
                          {result.matched_skills?.length > 0 && (
                            <div className="p-4 rounded-2xl" style={{ background: 'rgba(52,211,153,0.06)', border: '1px solid rgba(52,211,153,0.15)' }}>
                              <div className="flex items-center gap-2 mb-3">
                                <CheckCircle2 size={15} className="text-emerald-400" />
                                <span className="text-sm font-semibold text-emerald-400">
                                  Kỹ năng phù hợp ({result.matched_skills.length})
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-1.5">
                                {result.matched_skills.map(s => (
                                  <SkillTag key={s} skill={s} type="matched" />
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Missing skills */}
                          {result.missing_skills?.length > 0 && (
                            <div className="p-4 rounded-2xl" style={{ background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.15)' }}>
                              <div className="flex items-center gap-2 mb-3">
                                <AlertTriangle size={15} className="text-amber-400" />
                                <span className="text-sm font-semibold text-amber-400">
                                  Kỹ năng cần bổ sung ({result.missing_skills.length})
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-1.5">
                                {result.missing_skills.map(s => (
                                  <SkillTag key={s} skill={s} type="missing" />
                                ))}
                              </div>
                            </div>
                          )}

                          {/* CV skills extracted */}
                          {result.cv_skills?.length > 0 && (
                            <div>
                              <p className="text-xs font-medium mb-2 flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
                                <TrendingUp size={12} /> Kỹ năng trích xuất từ CV của bạn
                              </p>
                              <div className="flex flex-wrap gap-1.5">
                                {result.cv_skills.map(s => (
                                  <SkillTag key={s} skill={s} type="cv" />
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Tip */}
                          <div className="p-3 rounded-xl flex items-start gap-2.5" style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.12)' }}>
                            <Lightbulb size={15} className="text-primary-400 flex-shrink-0 mt-0.5" />
                            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                              {result.match_score >= 70
                                ? '🎉 CV của bạn rất phù hợp với vị trí này! Hãy ứng tuyển ngay.'
                                : result.match_score >= 45
                                  ? '👍 CV khá phù hợp. Bổ sung thêm kỹ năng còn thiếu vào CV để tăng cơ hội.'
                                  : '📚 Hãy bổ sung các kỹ năng còn thiếu vào CV trước khi ứng tuyển.'}
                            </p>
                          </div>
                        </>
                      )}

                      {/* Action buttons */}
                      <div className="flex gap-3 pt-1">
                        <button
                          onClick={reset}
                          id="apply-modal-retry"
                          className="flex-1 btn-ghost py-2.5 flex items-center justify-center gap-2 text-sm"
                        >
                          <RotateCcw size={14} />
                          Thử CV khác
                        </button>
                        {job?.job_url && (
                          <a
                            href={job.job_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            id="apply-modal-external"
                            className="flex-1 btn-primary py-2.5 flex items-center justify-center gap-2 text-sm"
                          >
                            <ExternalLink size={14} />
                            Nộp hồ sơ chính thức
                          </a>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* ── Phase: Error ── */}
                  {phase === 'error' && (
                    <motion.div
                      key="error"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="py-10 flex flex-col items-center gap-4 text-center"
                    >
                      <div className="w-16 h-16 rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                        <AlertTriangle size={28} className="text-red-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-white mb-1">Xử lý thất bại</p>
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{errorMsg}</p>
                      </div>
                      <button onClick={reset} className="btn-ghost flex items-center gap-2 text-sm">
                        <RotateCcw size={14} /> Thử lại
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
