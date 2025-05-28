import { useState, useEffect, useCallback } from 'react';

const usePullToRefresh = (onRefresh) => {
  const [isPulling, setIsPulling] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [startY, setStartY] = useState(0);
  const [pullDistance, setPullDistance] = useState(0);

  const PULL_THRESHOLD = 80; // Minimum distance to trigger refresh
  const MAX_PULL_DISTANCE = 120; // Maximum pull distance for visual feedback

  const handleTouchStart = useCallback((e) => {
    if (window.scrollY === 0) {
      setStartY(e.touches[0].clientY);
      setIsPulling(true);
    }
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (!isPulling || window.scrollY > 0) {
      setIsPulling(false);
      setPullDistance(0);
      return;
    }

    const currentY = e.touches[0].clientY;
    const distance = Math.min(currentY - startY, MAX_PULL_DISTANCE);
    
    if (distance > 0) {
      e.preventDefault();
      setPullDistance(distance);
    }
  }, [isPulling, startY, MAX_PULL_DISTANCE]);

  const handleTouchEnd = useCallback(async () => {
    if (isPulling && pullDistance > PULL_THRESHOLD) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } catch (error) {
        console.error('Refresh failed:', error);
      }
      setTimeout(() => {
        setIsRefreshing(false);
      }, 500); // Small delay to show refresh animation
    }
    
    setIsPulling(false);
    setPullDistance(0);
  }, [isPulling, pullDistance, onRefresh, PULL_THRESHOLD]);

  const handleMouseDown = useCallback((e) => {
    if (window.scrollY === 0) {
      setStartY(e.clientY);
      setIsPulling(true);
    }
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!isPulling || window.scrollY > 0) {
      setIsPulling(false);
      setPullDistance(0);
      return;
    }

    const currentY = e.clientY;
    const distance = Math.min(currentY - startY, MAX_PULL_DISTANCE);
    
    if (distance > 0) {
      e.preventDefault();
      setPullDistance(distance);
    }
  }, [isPulling, startY, MAX_PULL_DISTANCE]);

  const handleMouseUp = useCallback(async () => {
    if (isPulling && pullDistance > PULL_THRESHOLD) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } catch (error) {
        console.error('Refresh failed:', error);
      }
      setTimeout(() => {
        setIsRefreshing(false);
      }, 500);
    }
    
    setIsPulling(false);
    setPullDistance(0);
  }, [isPulling, pullDistance, onRefresh, PULL_THRESHOLD]);

  useEffect(() => {
    const element = document.body;

    // Touch events for mobile
    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: false });

    // Mouse events for desktop testing
    element.addEventListener('mousedown', handleMouseDown);
    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseup', handleMouseUp);

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
      element.removeEventListener('mousedown', handleMouseDown);
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd, handleMouseDown, handleMouseMove, handleMouseUp]);

  return {
    isPulling: isPulling && pullDistance > 0,
    isRefreshing,
    pullDistance,
    refreshProgress: Math.min(pullDistance / PULL_THRESHOLD, 1),
  };
};

export default usePullToRefresh; 