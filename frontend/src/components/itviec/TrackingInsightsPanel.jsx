// ═══════════════════════════════════════════════════
// TrackingInsightsPanel — "Hệ thống đang học gì từ bạn?"
//
// Floating panel góc dưới phải hiển thị:
// - Số events trong session
// - Top skills trending từ hành vi
// - Engagement level & dwell time
// - TTL countdown (dopamine timer)
// - Server-side stats khi expand
//
// Mục đích: Demo rõ ràng tracking → đề xuất pipeline
// ═══════════════════════════════════════════════════
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, ChevronDown, ChevronUp, Activity,
  Eye, Bookmark, Send, Search, Clock,
  TrendingUp, Zap, MousePointerClick,
  RefreshCw, Timer,
} from 'lucide-react';
import { useTrackingStats } from '../../hooks/useJobTracking';
import { trackingAPI } from '../../services/api';
import useAuthStore from '../../stores/authStore';

// Mapping event type → icon + color
const EVENT_ICONS = {
  CLICK: { icon: MousePointerClick, color: '#60a5fa', label: 'Click' },
  DWELL_TIME: { icon: Eye, color: '#34d399', label: 'Dwell' },
  BOOKMARK: { icon: Bookmark, color: '#fbbf24', label: 'Bookmark' },
  APPLY: { icon: Send, color: '#f472b6', label: 'Apply' },
  SEARCH: { icon: Search, color: '#a78bfa', label: 'Search' },
};

export default function TrackingInsightsPanel({ onFeedRefresh }) {
  const { isAuthenticated } = useAuthStore();
  const stats = useTrackingStats();
  const [isExpanded, setIsExpanded] = useState(false);
  const [serverStats, setServerStats] = useState(null);
  const [isLoadingServer, setIsLoadingServer] = useState(false);
  const [lastRefreshTime, setLastRefreshTime] = useState(null);
  const [pulse, setPulse] = useState(false);

  // Pulse animation khi có event mới
  useEffect(() => {
    if (stats.totalEvents > 0) {
      setPulse(true);
      const t = setTimeout(() => setPulse(false), 600);
      return () => clearTimeout(t);
    }
  }, [stats.totalEvents]);

  // Fetch server stats khi expand
  const fetchServerStats = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsLoadingServer(true);
    try {
      const { data } = await trackingAPI.getStats();
      setServerStats(data);
    } catch (err) {
      console.warn('Could not fetch tracking stats:', err.message);
    } finally {
      setIsLoadingServer(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isExpanded && isAuthenticated) {
      fetchServerStats();
    }
  }, [isExpanded, isAuthenticated]);

  // Không hiện panel nếu chưa login
  if (!isAuthenticated) return null;

  const totalEvents = stats.totalEvents;
  const hasEvents = totalEvents > 0;

  return (
    <div className="tracking-panel-container">
      <motion.div
        layout
        className="tracking-panel"
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {/* ─── Header (luôn hiển thị) ─── */}
        <button
          className="tracking-panel__header"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="tracking-panel__title">
            <div className={`tracking-panel__icon ${pulse ? 'tracking-panel__icon--pulse' : ''}`}>
              <Brain size={16} />
            </div>
            <span>Tracking Insights</span>
            {hasEvents && (
              <span className="tracking-panel__badge">
                {totalEvents}
              </span>
            )}
          </div>
          {isExpanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
        </button>

        {/* ─── Mini Stats (luôn hiển thị khi có events) ─── */}
        {hasEvents && !isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="tracking-panel__mini"
          >
            {Object.entries(stats.byType).map(([type, count]) => {
              if (count === 0) return null;
              const config = EVENT_ICONS[type];
              if (!config) return null;
              const Icon = config.icon;
              return (
                <div key={type} className="tracking-panel__mini-item" title={config.label}>
                  <Icon size={12} style={{ color: config.color }} />
                  <span>{count}</span>
                </div>
              );
            })}
            {stats.avgDwellSeconds > 0 && (
              <div className="tracking-panel__mini-item" title="Avg Dwell">
                <Clock size={12} style={{ color: '#34d399' }} />
                <span>{stats.avgDwellSeconds}s</span>
              </div>
            )}
          </motion.div>
        )}

        {/* ─── Expanded Content ─── */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="tracking-panel__body"
            >
              {/* Client-side Session Stats */}
              <div className="tracking-panel__section">
                <h4 className="tracking-panel__section-title">
                  <Activity size={13} />
                  Session này ({totalEvents} events)
                </h4>
                <div className="tracking-panel__event-grid">
                  {Object.entries(stats.byType).map(([type, count]) => {
                    const config = EVENT_ICONS[type];
                    if (!config) return null;
                    const Icon = config.icon;
                    return (
                      <div key={type} className="tracking-panel__event-row">
                        <div className="tracking-panel__event-label">
                          <Icon size={13} style={{ color: config.color }} />
                          <span>{config.label}</span>
                        </div>
                        <div className="tracking-panel__event-bar-wrapper">
                          <div
                            className="tracking-panel__event-bar"
                            style={{
                              width: `${totalEvents > 0 ? (count / totalEvents) * 100 : 0}%`,
                              backgroundColor: config.color,
                            }}
                          />
                        </div>
                        <span className="tracking-panel__event-count">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Engagement Distribution */}
              {(stats.engagement.GLANCE + stats.engagement.SKIM + stats.engagement.DEEP_READ > 0) && (
                <div className="tracking-panel__section">
                  <h4 className="tracking-panel__section-title">
                    <Eye size={13} />
                    Mức độ quan tâm
                  </h4>
                  <div className="tracking-panel__engagement">
                    {[
                      { key: 'GLANCE', label: '👀 Lướt qua', sub: '<5s', color: '#94a3b8' },
                      { key: 'SKIM', label: '📖 Đọc lướt', sub: '5-15s', color: '#fbbf24' },
                      { key: 'DEEP_READ', label: '🧠 Đọc kỹ', sub: '>15s', color: '#34d399' },
                    ].map(({ key, label, sub, color }) => (
                      <div key={key} className="tracking-panel__engagement-item">
                        <span className="tracking-panel__engagement-label">{label}</span>
                        <span className="tracking-panel__engagement-count" style={{ color }}>
                          {stats.engagement[key]}
                        </span>
                      </div>
                    ))}
                  </div>
                  {stats.avgDwellSeconds > 0 && (
                    <div className="tracking-panel__avg-dwell">
                      <Timer size={12} />
                      Avg dwell: <strong>{stats.avgDwellSeconds}s</strong>
                    </div>
                  )}
                </div>
              )}

              {/* Server Stats — Top Skills */}
              {serverStats && (
                <div className="tracking-panel__section">
                  <h4 className="tracking-panel__section-title">
                    <TrendingUp size={13} />
                    Top Skills (từ DB — TTL {serverStats.ttl_info?.ttl_minutes || 10} phút)
                  </h4>
                  {serverStats.top_skills?.length > 0 ? (
                    <div className="tracking-panel__skills">
                      {serverStats.top_skills.map(({ skill, frequency }) => (
                        <span key={skill} className="tracking-panel__skill-tag">
                          {skill}
                          <span className="tracking-panel__skill-freq">×{frequency}</span>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="tracking-panel__empty">Chưa có dữ liệu. Hãy tương tác với vài job!</p>
                  )}

                  {/* TTL Info */}
                  <div className="tracking-panel__ttl">
                    <Zap size={12} />
                    <span>
                      Dopamine TTL: data sống <strong>{serverStats.ttl_info?.ttl_minutes || 10} phút</strong>, sau đó reset
                    </span>
                  </div>
                </div>
              )}

              {/* Server Stats — Top Jobs */}
              {serverStats?.top_interacted_jobs?.length > 0 && (
                <div className="tracking-panel__section">
                  <h4 className="tracking-panel__section-title">
                    <Zap size={13} />
                    Jobs bạn quan tâm nhất
                  </h4>
                  <div className="tracking-panel__top-jobs">
                    {serverStats.top_interacted_jobs.slice(0, 3).map((job) => (
                      <div key={job.id} className="tracking-panel__top-job">
                        <span className="tracking-panel__top-job-title">{job.title}</span>
                        <span className="tracking-panel__top-job-score">
                          ⚡{job.affinity_score}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="tracking-panel__actions">
                <button
                  className="tracking-panel__action-btn"
                  onClick={() => {
                    fetchServerStats();
                    if (onFeedRefresh) {
                      onFeedRefresh();
                      setLastRefreshTime(new Date());
                    }
                  }}
                  disabled={isLoadingServer}
                >
                  <RefreshCw size={13} className={isLoadingServer ? 'animate-spin' : ''} />
                  {isLoadingServer ? 'Đang tải...' : 'Cập nhật đề xuất'}
                </button>
                {lastRefreshTime && (
                  <span className="tracking-panel__last-refresh">
                    Cập nhật: {lastRefreshTime.toLocaleTimeString('vi-VN')}
                  </span>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
