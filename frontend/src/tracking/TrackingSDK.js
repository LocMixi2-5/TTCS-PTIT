// ═══════════════════════════════════════════════════
// Tracking SDK — User Behavior Collection
//
// Captures implicit feedback events:
// - CLICK: User views job details
// - DWELL_TIME: Time spent reading (Glance/Skim/Deep Read)
// - BOOKMARK: Save/unsave job
// - APPLY: Click apply button
//
// Events are buffered and flushed every 5s to minimize
// network requests. Uses keepalive for beforeunload.
// ═══════════════════════════════════════════════════
import { trackingAPI } from '../services/api';

class JobTrackingSDK {
  constructor() {
    this.sessionId = this._getOrCreateSession();
    this.eventBuffer = [];
    this.flushInterval = 5000;
    this.dwellTimers = new Map();

    // Auto-flush buffer periodically
    this._intervalId = setInterval(() => this.flush(), this.flushInterval);

    // Flush before page unload
    window.addEventListener('beforeunload', () => this.flush());
  }

  _getOrCreateSession() {
    let sid = sessionStorage.getItem('tracking_session_id');
    if (!sid) {
      sid = crypto.randomUUID();
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

    // Classify engagement: <5s = Glance, 5-15s = Skim, >15s = Deep Read
    let engagement;
    if (dwellSeconds < 5) engagement = 'GLANCE';
    else if (dwellSeconds <= 15) engagement = 'SKIM';
    else engagement = 'DEEP_READ';

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

  // ═══ INTERNAL ═════════════════════════════════
  _pushEvent(eventType, payload) {
    this.eventBuffer.push({
      event_type: eventType,
      session_id: this.sessionId,
      timestamp: new Date().toISOString(),
      payload,
    });
  }

  async flush() {
    if (this.eventBuffer.length === 0) return;

    const events = [...this.eventBuffer];
    this.eventBuffer = [];

    try {
      await trackingAPI.sendEvents(events);
    } catch (err) {
      // Put events back on failure
      this.eventBuffer.unshift(...events);
      console.warn('Tracking flush failed:', err);
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
