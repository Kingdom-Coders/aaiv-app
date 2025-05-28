import React from 'react';
import './PullToRefreshIndicator.css';

const PullToRefreshIndicator = ({ isPulling, isRefreshing, pullDistance, refreshProgress }) => {
  if (!isPulling && !isRefreshing) return null;

  return (
    <div 
      className="pull-to-refresh-indicator"
      style={{ 
        transform: `translateX(-50%) translateY(${Math.max(0, pullDistance - 40)}px)`,
        opacity: isPulling ? Math.min(refreshProgress, 1) : 1
      }}
    >
      <div className="refresh-content">
        {isRefreshing ? (
          <>
            <div className="refresh-spinner spinning"></div>
            <span className="refresh-text">Refreshing...</span>
          </>
        ) : (
          <>
            <div 
              className={`refresh-spinner ${refreshProgress >= 1 ? 'ready' : ''}`}
              style={{ 
                transform: `rotate(${refreshProgress * 180}deg)` 
              }}
            >
              ↓
            </div>
            <span className="refresh-text">
              {refreshProgress >= 1 ? 'Release to refresh' : 'Pull to refresh'}
            </span>
          </>
        )}
      </div>
    </div>
  );
};

export default PullToRefreshIndicator; 