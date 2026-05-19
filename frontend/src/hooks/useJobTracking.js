// ═══════════════════════════════════════════════════
// Tracking Hooks — React integration for tracking SDK
// ═══════════════════════════════════════════════════
import { useEffect, useRef, useCallback } from 'react';
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
  };
}

export function useJobDwellTime(jobId, isVisible) {
  const tracker = getTracker();
  const timerStarted = useRef(false);

  useEffect(() => {
    if (isVisible && !timerStarted.current) {
      tracker.startDwellTimer(jobId);
      timerStarted.current = true;
    }

    return () => {
      if (timerStarted.current) {
        tracker.stopDwellTimer(jobId);
        timerStarted.current = false;
      }
    };
  }, [jobId, isVisible]);
}
