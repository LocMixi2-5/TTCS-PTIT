// ═══════════════════════════════════════════════════
// Tracking Hooks — React integration for tracking SDK
//
// useJobTracking()  → trackClick, trackApply, trackBookmark, trackSearch
// useJobDwellTime() → IntersectionObserver-based dwell tracking
// useTrackingStats() → Live session stats for UI panels
// ═══════════════════════════════════════════════════
import { useEffect, useRef, useCallback, useState } from 'react';
import { getTracker } from '../tracking/TrackingSDK';

export function useJobTracking() {
  const tracker = getTracker();

  return {
    trackClick: useCallback((jobId, position, context) => {
      tracker.trackClick(jobId, position, context);
    }, []),

    trackBookmark: useCallback((jobId, isBookmarked) => {
      tracker.trackBookmark(jobId, isBookmarked);
    }, []),

    trackApply: useCallback((jobId, context) => {
      tracker.trackApply(jobId, context);
    }, []),

    trackSearch: useCallback((keyword, filters) => {
      tracker.trackSearch(keyword, filters);
    }, []),
  };
}

/**
 * useJobDwellTime — Tự động track thời gian user nhìn thấy 1 job card
 * 
 * Cơ chế: IntersectionObserver quan sát khi element vào/ra viewport.
 * - Khi card visible > 50% viewport → start timer
 * - Khi card ra khỏi viewport hoặc unmount → stop timer + ghi event
 *
 * @param {string|number} jobId  — ID của job
 * @param {React.RefObject} elementRef — ref gắn vào DOM element cần observe
 */
export function useJobDwellTime(jobId, elementRef) {
  const tracker = getTracker();
  const timerStarted = useRef(false);

  useEffect(() => {
    const element = elementRef?.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !timerStarted.current) {
          // Card vừa visible trong viewport → bắt đầu đếm
          tracker.startDwellTimer(jobId);
          timerStarted.current = true;
        } else if (!entry.isIntersecting && timerStarted.current) {
          // Card ra khỏi viewport → dừng đếm + ghi event
          tracker.stopDwellTimer(jobId);
          timerStarted.current = false;
        }
      },
      { threshold: 0.5 } // 50% card phải visible mới tính
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      // Cleanup: nếu timer đang chạy khi unmount → dừng lại
      if (timerStarted.current) {
        tracker.stopDwellTimer(jobId);
        timerStarted.current = false;
      }
    };
  }, [jobId, elementRef]);
}

/**
 * useTrackingStats — Hook để UI components subscribe vào stats thay đổi realtime
 * Dùng cho TrackingInsightsPanel
 */
export function useTrackingStats() {
  const tracker = getTracker();
  const [stats, setStats] = useState(() => tracker.getSessionStats());

  useEffect(() => {
    // Subscribe to stats changes từ SDK
    const unsubscribe = tracker.onStatsChange((newStats) => {
      setStats(newStats);
    });

    return unsubscribe;
  }, []);

  return stats;
}
