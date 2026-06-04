// ═══════════════════════════════════════════════════
// Tracking SDK — User Behavior Collection
//
// Captures implicit feedback events:
// - CLICK: User views job details
// - DWELL_TIME: Time spent reading (Glance/Skim/Deep Read)
// - BOOKMARK: Save/unsave job
// - APPLY: Click apply button
// - SEARCH: User searches for jobs
//
// Events are buffered and flushed every 5s to minimize
// network requests. Uses keepalive for beforeunload.
//
// Session Stats: Real-time in-memory stats for UI display.
// Dopamine TTL: Tracking data lives 5-10 min in DB,
// so recommendations stay fresh like dopamine.
// ═══════════════════════════════════════════════════
import { trackingAPI } from '../services/api';

class JobTrackingSDK {
  constructor() {
    this.sessionId = this._getOrCreateSession();
    this.eventBuffer = [];
    this.flushInterval = 5000;
    this.dwellTimers = new Map();

    // ─── Session Stats (in-memory, cho UI hiển thị) ───
    this.sessionStats = {
      totalEvents: 0,
      byType: { CLICK: 0, DWELL_TIME: 0, BOOKMARK: 0, APPLY: 0, SEARCH: 0 },
      engagement: { GLANCE: 0, SKIM: 0, DEEP_READ: 0 },
      totalDwellMs: 0,
      interactedJobIds: new Set(),
      lastEventTime: null,
      flushCount: 0,
    };

    // Callback list — UI components subscribe to stats changes
    this._onStatsChangeCallbacks = [];

    // Auto-flush buffer periodically
    this._intervalId = setInterval(() => this.flush(), this.flushInterval);

    // Xử lý khi reload trang hoặc đóng tab (cách cũ)
    window.addEventListener('beforeunload', () => {
      this.stopAllTimers();
      this.flush(true);
    });

    // Cách hiện đại hơn: xử lý khi người dùng chuyển tab hoặc ẩn trình duyệt
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.stopAllTimers();
        this.flush(true);
      }
    });
  }

  stopAllTimers() {
    for (const jobId of this.dwellTimers.keys()) {
      this.stopDwellTimer(jobId);
    }
  }

  _getOrCreateSession() {
    let sid = sessionStorage.getItem('tracking_session_id');
    if (!sid) {
      if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        sid = crypto.randomUUID();
      } else {
        // Fallback valid UUID v4 generator for Postgres
        sid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      }
      sessionStorage.setItem('tracking_session_id', sid);
    }
    return sid;
  }

  // ═══ CLICK TRACKING ═══════════════════════════
  trackClick(jobId, position, context = {}) {
    this._pushEvent('CLICK', {
      job_id: jobId,
      position_in_list: position,
      match_score: context.matchScore,
      source_page: context.sourcePage || 'recommendations',
    });
  }

  // ═══ DWELL TIME TRACKING ══════════════════════
  startDwellTimer(jobId) {
    if (this.dwellTimers.has(jobId)) return; // Tránh duplicate timer
    this.dwellTimers.set(jobId, {
      startTime: Date.now(),
      scrollDepth: 0,
    });
  }

  stopDwellTimer(jobId) {
    const timer = this.dwellTimers.get(jobId);
    if (!timer) return;

    const dwellMs = Date.now() - timer.startTime;
    const dwellSeconds = dwellMs / 1000;

    // Bỏ qua dwell time quá ngắn (< 500ms) — thường là glitch hoặc misfire
    if (dwellMs < 500) {
      this.dwellTimers.delete(jobId);
      return;
    }

    // Classify engagement: <5s = Glance, 5-15s = Skim, >15s = Deep Read
    let engagement;
    if (dwellSeconds < 5) engagement = 'GLANCE';
    else if (dwellSeconds <= 15) engagement = 'SKIM';
    else engagement = 'DEEP_READ';

    // Cập nhật session stats cho engagement
    this.sessionStats.engagement[engagement]++;
    this.sessionStats.totalDwellMs += dwellMs;

    this._pushEvent('DWELL_TIME', {
      job_id: jobId,
      dwell_time_ms: dwellMs,
      dwell_seconds: Math.round(dwellSeconds),
      engagement_level: engagement,
      scroll_depth_percent: timer.scrollDepth,
    });

    this.dwellTimers.delete(jobId);
  }

  // ═══ ACTION TRACKING ══════════════════════════
  trackBookmark(jobId, isBookmarked) {
    this._pushEvent('BOOKMARK', {
      job_id: jobId,
      action: isBookmarked ? 'ADD' : 'REMOVE',
    });
  }

  trackApply(jobId, context = {}) {
    this._pushEvent('APPLY', {
      job_id: jobId,
      applied_via: context.appliedVia || 'internal',
    });
  }

  // ═══ SEARCH TRACKING ═════════════════════════
  trackSearch(keyword, filters = {}) {
    this._pushEvent('SEARCH', {
      keyword: keyword || '',
      city: filters.city || '',
      filters: filters,
    });
  }

  // ═══ SESSION STATS ════════════════════════════
  // Trả về snapshot stats hiện tại (cho UI TrackingInsightsPanel)
  getSessionStats() {
    const dwellCount = this.sessionStats.byType.DWELL_TIME;
    return {
      ...this.sessionStats,
      interactedJobIds: [...this.sessionStats.interactedJobIds],
      avgDwellSeconds: dwellCount > 0
        ? Math.round(this.sessionStats.totalDwellMs / dwellCount / 1000 * 10) / 10
        : 0,
      activeTimers: this.dwellTimers.size,
      bufferSize: this.eventBuffer.length,
    };
  }

  // Subscribe to stats changes (returns unsubscribe function)
  onStatsChange(callback) {
    this._onStatsChangeCallbacks.push(callback);
    return () => {
      this._onStatsChangeCallbacks = this._onStatsChangeCallbacks.filter(cb => cb !== callback);
    };
  }

  _notifyStatsChange() {
    const stats = this.getSessionStats();
    this._onStatsChangeCallbacks.forEach(cb => {
      try { cb(stats); } catch (e) { /* ignore */ }
    });
  }

  // ═══ INTERNAL ═════════════════════════════════
  _pushEvent(eventType, payload) {
    const event = {
      event_type: eventType,
      session_id: this.sessionId,
      timestamp: new Date().toISOString(),
      payload,
    };
    this.eventBuffer.push(event);

    // Cập nhật session stats
    this.sessionStats.totalEvents++;
    if (this.sessionStats.byType[eventType] !== undefined) {
      this.sessionStats.byType[eventType]++;
    }
    if (payload.job_id) {
      this.sessionStats.interactedJobIds.add(payload.job_id);
    }
    this.sessionStats.lastEventTime = new Date();

    // Notify UI subscribers
    this._notifyStatsChange();

    console.log(
      `%c[TrackingSDK]%c ${eventType} %c(#${this.sessionStats.totalEvents})`,
      'color: #6366f1; font-weight: bold',
      'color: #22d3ee; font-weight: bold',
      'color: #94a3b8',
      payload
    );
  }

  async flush(useBeacon = false) {
    if (this.eventBuffer.length === 0) return;

    // Cắt tối đa 100 sự kiện để gửi, tránh bị Backend từ chối vì quá tải
    const eventsToSend = this.eventBuffer.splice(0, 100);
    this.sessionStats.flushCount++;

    console.log(
      `%c[TrackingSDK]%c 🚀 Flush #${this.sessionStats.flushCount}: ${eventsToSend.length} events (Beacon: ${useBeacon})`,
      'color: #6366f1; font-weight: bold',
      'color: #f59e0b'
    );

    try {
      if (useBeacon && navigator.sendBeacon) {
        // Sử dụng sendBeacon để đảm bảo gửi được request khi trang đang đóng/reload
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        const blob = new Blob([JSON.stringify({ events: eventsToSend })], { type: 'application/json' });
        navigator.sendBeacon(`${apiUrl}/api/tracking/events`, blob);
      } else {
        await trackingAPI.sendEvents(eventsToSend);
      }
      console.log(
        `%c[TrackingSDK]%c ✅ Sent ${eventsToSend.length} events`,
        'color: #6366f1; font-weight: bold',
        'color: #22c55e'
      );
    } catch (err) {
      console.error(`[TrackingSDK] ❌ Flush failed:`, err.response?.data || err.message);
      // Chỉ đẩy lại vào hàng chờ nếu lỗi Mạng hoặc Server (5xx). 
      // Bỏ qua nếu là lỗi 4xx (như 400 Bad Request, 401 Unauthorized) để tránh vòng lặp vô tận
      if (!useBeacon && (!err.response || err.response.status >= 500)) {
        this.eventBuffer.unshift(...eventsToSend);
      }
    }
  }

  destroy() {
    clearInterval(this._intervalId);
    this.flush();
  }
}

// Singleton instance
let tracker = null;

export function getTracker() {
  if (!tracker) {
    tracker = new JobTrackingSDK();
  }
  return tracker;
}

export default JobTrackingSDK;
