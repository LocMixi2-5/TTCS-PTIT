// ═══════════════════════════════════════════════════
// Results Page — AI Recommendations with Explainable AI
// ═══════════════════════════════════════════════════
import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Bookmark, BookmarkCheck, ExternalLink,
  MapPin, BarChart3, Target, Filter, SlidersHorizontal,
  CheckCircle2, AlertTriangle, Loader2, Search, Brain,
  BookOpen, Code2, Send
} from 'lucide-react';
import { toast } from 'sonner';
import { recommendationsAPI, jobsAPI } from '../services/api';
import { useJobTracking, useJobDwellTime } from '../hooks/useJobTracking';
import CompanyLogo from '../components/cards/CompanyLogo';
import ApplyModal from '../components/modals/ApplyModal';

// ─── Score Badge Component ───────────────────────
function ScoreBadge({ score }) {
  const cls = score >= 70 ? 'score-badge--high' : score >= 45 ? 'score-badge--medium' : 'score-badge--low';
  return (
    <span className={`score-badge ${cls}`}>
      <Target size={14} />
      {score.toFixed(1)}%
    </span>
  );
}

// ─── Circular Progress ───────────────────────────
function CircularProgress({ value, size = 56 }) {
  const radius = (size - 6) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  const color = value >= 70 ? '#34d399' : value >= 45 ? '#fbbf24' : '#f87171';

  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size/2} cy={size/2} r={radius} stroke="var(--border-card)" strokeWidth="4" fill="none" />
      <circle
        cx={size/2} cy={size/2} r={radius}
        stroke={color} strokeWidth="4" fill="none"
        strokeDasharray={circumference} strokeDashoffset={offset}
        strokeLinecap="round"
        className="transition-all duration-700"
      />
    </svg>
  );
}

// ─── Job Recommendation Card (with Explainable AI) ─
function JobCard({ rec, cvSkills, rank }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(rec.is_bookmarked);
  const [applyOpen, setApplyOpen] = useState(false);
  const cardRef = useRef(null);
  const { trackClick, trackBookmark, trackApply } = useJobTracking();
  useJobDwellTime(rec.job.id, cardRef);

  const job = rec.job;
  const matchScore = rec.match_score;

  // Skill analysis — Explainable AI
  const jobSkills = job.required_skills || [];
  const cvSkillsLower = (cvSkills || []).map(s => s.toLowerCase());
  const matchedSkills = jobSkills.filter(s => cvSkillsLower.includes(s.toLowerCase()));
  const missingSkills = jobSkills.filter(s => !cvSkillsLower.includes(s.toLowerCase()));
  const skillMatchPercent = jobSkills.length > 0 ? (matchedSkills.length / jobSkills.length) * 100 : 0;

  const handleClick = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      trackClick(job.id, rank, { matchScore, sourcePage: 'recommendations' });
    }
  };

  const handleBookmark = async (e) => {
    e.stopPropagation();
    try {
      const { data } = await jobsAPI.toggleBookmark(job.id);
      setIsBookmarked(data.is_bookmarked);
      trackBookmark(job.id, data.is_bookmarked);
      toast.success(data.is_bookmarked ? 'Đã lưu việc làm' : 'Đã bỏ lưu');
    } catch (err) {
      toast.error('Thao tác thất bại');
    }
  };

  const handleApply = (e) => {
    e.stopPropagation();
    trackApply(job.id, { appliedVia: 'apply_modal' });
    setApplyOpen(true);
  };

  return (<>
    <motion.div
      ref={cardRef}
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.05 }}
      className="glass-card overflow-hidden group hover:border-white/[0.1] transition-all"
    >
      {/* Card Header — Always Visible */}
      <div
        className="p-5 cursor-pointer flex items-start gap-4"
        onClick={handleClick}
      >
        {/* Rank + Score */}
        <div className="flex flex-col items-center gap-1 flex-shrink-0">
          <span className="text-xs font-bold" style={{ color: 'var(--text-muted)' }}>#{rank}</span>
          <div className="relative">
            <CircularProgress value={matchScore} />
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
              {Math.round(matchScore)}
            </span>
          </div>
        </div>

        {/* Job Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <CompanyLogo
              company={{ name: job.company_name, logo_url: job.logo_url, website: job.website }}
              size={36}
            />
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-display font-semibold group-hover:text-primary-400 transition-colors truncate" style={{ color: 'var(--text-primary)' }}>
                {job.title}
              </h3>
              {job.company_name && (
                <span className="text-xs font-medium text-primary-400">{job.company_name}</span>
              )}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
            <span className="flex items-center gap-1">
              <MapPin size={12} /> {job.location || 'Remote'}
            </span>
            <span className="flex items-center gap-1">
              <BarChart3 size={12} /> {job.experience_level || 'N/A'}
            </span>
          </div>

          {/* Quick skill preview */}
          {matchedSkills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {matchedSkills.slice(0, 4).map(skill => (
                <span key={skill} className="skill-tag skill-tag--matched">{skill}</span>
              ))}
              {matchedSkills.length > 4 && (
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>+{matchedSkills.length - 4}</span>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button onClick={handleBookmark} className="p-2 rounded-lg hover:bg-white/[0.06] transition-all" title="Bookmark">
            {isBookmarked ? (
              <BookmarkCheck size={18} className="text-primary-400" />
            ) : (
              <Bookmark size={18} className="text-surface-400 hover:text-white" />
            )}
          </button>
          <button
            onClick={handleApply}
            id={`apply-btn-${job.id}`}
            className="btn-primary text-xs px-3 py-2 flex items-center gap-1.5"
          >
            <Send size={12} />
            Apply Now
          </button>
        </div>
      </div>

      {/* ═══ EXPANDED: Explainable AI Section ═══ */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-3 space-y-4" style={{ borderTop: '1px solid var(--border-divider)' }}>

              {/* Skill Analysis — XAI */}
              <div className="job-detail-section">
                <h4 className="flex items-center gap-2 text-sm font-semibold mb-3">
                  <Brain size={15} className="text-primary-400" />
                  🔍 Phân tích kỹ năng — Explainable AI
                </h4>
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span style={{ color: 'var(--text-secondary)' }}>Mức độ trùng khớp</span>
                    <span className="font-bold" style={{ color: 'var(--text-primary)' }}>{matchedSkills.length}/{jobSkills.length} skills</span>
                  </div>
                  <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'var(--border-card)' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${skillMatchPercent}%` }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
                    />
                  </div>
                </div>
                {matchedSkills.length > 0 && (
                  <div className="mb-3">
                    <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-500 mb-2">
                      <CheckCircle2 size={12} /> Kỹ năng trùng khớp
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {matchedSkills.map(s => <span key={s} className="skill-tag skill-tag--matched">{s}</span>)}
                    </div>
                  </div>
                )}
                {missingSkills.length > 0 && (
                  <div>
                    <span className="flex items-center gap-1.5 text-xs font-medium text-amber-500 mb-2">
                      <AlertTriangle size={12} /> Cần bổ sung
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {missingSkills.map(s => <span key={s} className="skill-tag skill-tag--missing">{s}</span>)}
                    </div>
                  </div>
                )}
              </div>

              {/* Job Description */}
              {job.description && (
                <div className="job-detail-section">
                  <h4 className="flex items-center gap-2 text-sm font-semibold mb-2">
                    <BookOpen size={14} className="text-primary-400" /> Job Description
                  </h4>
                  <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: 'var(--text-secondary)' }}>
                    {job.description.substring(0, 800)}{job.description.length > 800 && '...'}
                  </p>
                </div>
              )}

              {/* Skills desc */}
              {job.skills_desc && (
                <div className="job-detail-section">
                  <h4 className="flex items-center gap-2 text-sm font-semibold mb-2">
                    <Code2 size={14} className="text-violet-400" /> Skills &amp; Experience
                  </h4>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{job.skills_desc}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>

    {/* Apply Modal */}
    <ApplyModal
      job={{ ...job, id: job.id }}
      isOpen={applyOpen}
      onClose={() => setApplyOpen(false)}
    />
  </>);
}

// ═══════════════════════════════════════════════════
// Results Page Main Component
// ═══════════════════════════════════════════════════
export default function ResultsPage() {
  const { cvId } = useParams();
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [minScore, setMinScore] = useState(0);
  const [locationFilter, setLocationFilter] = useState('');
  const [expFilter, setExpFilter] = useState('');

  useEffect(() => {
    fetchResults();
  }, [cvId]);

  const fetchResults = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = {};
      if (minScore > 0) params.min_score = minScore;
      if (locationFilter) params.location = locationFilter;
      if (expFilter) params.experience_level = expFilter;

      const { data } = await recommendationsAPI.getForCV(cvId, params);
      setResults(data);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Không thể tải kết quả');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter results client-side for instant response
  const filteredResults = results?.results?.filter(r => {
    if (minScore > 0 && r.match_score < minScore) return false;
    if (locationFilter && !r.job.location?.toLowerCase().includes(locationFilter.toLowerCase())) return false;
    if (expFilter && r.job.experience_level !== expFilter) return false;
    return true;
  }) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={48} className="text-primary-400 animate-spin mx-auto mb-4" />
          <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>Đang tải kết quả gợi ý...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center px-4">
        <div className="glass-card p-8 max-w-md text-center">
          <AlertTriangle size={48} className="text-amber-400 mx-auto mb-4" />
          <h2 className="text-xl font-display font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Không thể tải kết quả</h2>
          <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>{error}</p>
          <Link to="/dashboard" className="btn-primary inline-flex items-center gap-2">
            <ArrowLeft size={16} />
            Quay lại Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="ambient-bg" />
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-sm mb-4 transition-colors hover:text-primary-400" style={{ color: 'var(--text-secondary)' }}>
            <ArrowLeft size={14} />
            Quay lại Dashboard
          </Link>
          <h1 className="text-3xl font-display font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            🎯 Kết quả gợi ý việc làm
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Tìm thấy <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{results?.total_results || 0}</span> công việc phù hợp
          </p>

          {results?.cv_skills?.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Kỹ năng từ CV:</span>
              {results.cv_skills.map(skill => (
                <span key={skill} className="skill-tag skill-tag--matched">{skill}</span>
              ))}
            </div>
          )}
        </motion.div>

        <div className="flex gap-6">
          {/* ─── Filter Sidebar ─────────────────────── */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="hidden lg:block w-72 flex-shrink-0"
          >
            <div className="glass-card p-5 sticky top-24 space-y-5">
              <h3 className="flex items-center gap-2 font-display font-semibold" style={{ color: 'var(--text-primary)' }}>
                <SlidersHorizontal size={16} />
                Bộ lọc
              </h3>

              {/* Score Slider */}
              <div>
                <label className="text-sm mb-2 block" style={{ color: 'var(--text-secondary)' }}>
                  Điểm phù hợp tối thiểu: <span className="font-bold" style={{ color: 'var(--text-primary)' }}>{minScore}%</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={minScore}
                  onChange={(e) => setMinScore(parseInt(e.target.value))}
                  className="w-full accent-primary-500"
                  id="score-filter-slider"
                />
                <div className="flex justify-between text-xs text-surface-400 mt-1">
                  <span>0%</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="text-sm mb-2 block" style={{ color: 'var(--text-secondary)' }}>Địa điểm</label>
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
                  <input
                    type="text"
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="input-field pl-9 text-sm py-2.5"
                    placeholder="VD: Hanoi, Remote..."
                    id="location-filter"
                  />
                </div>
              </div>

              {/* Experience Level */}
              <div>
                <label className="text-sm mb-2 block" style={{ color: 'var(--text-secondary)' }}>Cấp độ</label>
                <select
                  value={expFilter}
                  onChange={(e) => setExpFilter(e.target.value)}
                  className="input-field text-sm py-2.5"
                  id="experience-filter"
                >
                  <option value="">Tất cả</option>
                  <option value="Entry level">Entry Level</option>
                  <option value="Associate">Associate</option>
                  <option value="Mid-Senior level">Mid-Senior</option>
                  <option value="Director">Director</option>
                  <option value="Executive">Executive</option>
                </select>
              </div>

              {/* Results count */}
              <div className="pt-3 text-center" style={{ borderTop: '1px solid var(--border-divider)' }}>
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Hiển thị <span className="font-bold" style={{ color: 'var(--text-primary)' }}>{filteredResults.length}</span> kết quả
                </span>
              </div>
            </div>
          </motion.aside>

          {/* ─── Results List ───────────────────────── */}
          <div className="flex-1 space-y-4">
            {filteredResults.length === 0 ? (
              <div className="glass-card p-12 text-center">
                <Filter size={48} className="mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
                <p style={{ color: 'var(--text-secondary)' }}>Không có kết quả phù hợp với bộ lọc hiện tại</p>
                <button onClick={() => { setMinScore(0); setLocationFilter(''); setExpFilter(''); }} className="btn-ghost text-sm mt-4">
                  Xóa bộ lọc
                </button>
              </div>
            ) : (
              filteredResults.map((rec, index) => (
                <JobCard
                  key={rec.recommendation_id}
                  rec={rec}
                  cvSkills={results?.cv_skills || []}
                  rank={index + 1}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
