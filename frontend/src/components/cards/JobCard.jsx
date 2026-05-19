// ═══════════════════════════════════════════════════
// JobCard (small) — Used in CompanyDetailsPage grid
// Theme-aware with company logo
// ═══════════════════════════════════════════════════
import { Link } from 'react-router-dom';
import { MapPin, BarChart3, Target } from 'lucide-react';
import CompanyLogo from './CompanyLogo';

export default function JobCard({ job }) {
  return (
    <div
      className="glass-card p-5 flex flex-col h-full hover:border-primary-500/30 transition-all group"
    >
      {/* Company logo + title */}
      <div className="flex items-start gap-3 mb-3">
        <CompanyLogo
          company={{ name: job.company_name, logo_url: job.logo_url, website: job.website }}
          size={40}
        />
        <div className="flex-1 min-w-0">
          <h3
            className="text-sm font-bold line-clamp-2 group-hover:text-primary-400 transition-colors"
            style={{ color: 'var(--text-primary)' }}
          >
            {job.title}
          </h3>
          {job.company_name && (
            <div className="mt-0.5 text-xs font-medium text-primary-400">
              {job.company_id ? (
                <Link to={`/companies/${job.company_id}`} className="hover:underline">
                  {job.company_name}
                </Link>
              ) : job.company_name}
            </div>
          )}
        </div>
      </div>

      {/* Location + Experience */}
      <div className="flex-grow space-y-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
        <div className="flex items-center gap-1.5">
          <MapPin size={12} />
          <span className="truncate">{job.location || 'Remote'}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <BarChart3 size={12} />
          <span>{job.experience_level || 'Không yêu cầu'}</span>
        </div>
      </div>

      {/* Match Score */}
      {job.match_score != null && (
        <div
          className="flex items-center gap-1.5 mt-3 pt-3"
          style={{ borderTop: '1px solid var(--border-divider)' }}
        >
          <Target size={14} className="text-emerald-500" />
          <span className="text-emerald-500 font-bold text-xs">
            Phù hợp: {job.match_score.toFixed(1)}%
          </span>
        </div>
      )}
    </div>
  );
}
