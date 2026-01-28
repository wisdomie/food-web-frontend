/**
 * HealthinessScore Component
 *
 * Displays healthiness score (0-100) with visual indicator
 */

import React from 'react';

function HealthinessScore({ healthiness }) {
  if (!healthiness) {
    return null;
  }

  const { score, category, breakdown } = healthiness;

  /**
   * Get color based on score
   */
  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981'; // Green
    if (score >= 60) return '#84cc16'; // Light green
    if (score >= 40) return '#f59e0b'; // Orange
    if (score >= 20) return '#f97316'; // Red-orange
    return '#ef4444'; // Red
  };

  const scoreColor = getScoreColor(score);

  /**
   * Calculate circular progress
   */
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const remaining = circumference - progress;

  return (
    <div className="healthiness-section">
      <h3>Healthiness Score</h3>

      <div className="healthiness-content">
        {/* Circular Score */}
        <div className="score-circle">
          <svg width="160" height="160" viewBox="0 0 160 160">
            {/* Background circle */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="12"
            />

            {/* Progress circle */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              stroke={scoreColor}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={`${progress} ${remaining}`}
              strokeDashoffset="0"
              transform="rotate(-90 80 80)"
              style={{
                transition: 'stroke-dasharray 1s ease-in-out',
              }}
            />

            {/* Score text */}
            <text
              x="80"
              y="75"
              textAnchor="middle"
              fontSize="36"
              fontWeight="bold"
              fill={scoreColor}
            >
              {score}
            </text>
            <text
              x="80"
              y="95"
              textAnchor="middle"
              fontSize="14"
              fill="#6b7280"
            >
              / 100
            </text>
          </svg>
        </div>

        {/* Category and Info */}
        <div className="score-info">
          <div
            className="score-category"
            style={{ backgroundColor: scoreColor }}
          >
            {category}
          </div>

          {/* Score Breakdown */}
          {breakdown && (
            <div className="score-breakdown">
              <h4>Score Breakdown</h4>

              <div className="breakdown-item">
                <span>Base Score:</span>
                <span>{breakdown.base_score}</span>
              </div>

              {/* Penalties */}
              {breakdown.penalties &&
                Object.keys(breakdown.penalties).length > 0 && (
                  <div className="breakdown-section penalties">
                    <strong>Penalties:</strong>
                    {Object.entries(breakdown.penalties).map(
                      ([key, value]) => (
                        <div key={key} className="breakdown-item">
                          <span>{key}:</span>
                          <span className="negative">
                            -{value.penalty.toFixed(1)}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                )}

              {/* Bonuses */}
              {breakdown.bonuses &&
                Object.keys(breakdown.bonuses).length > 0 && (
                  <div className="breakdown-section bonuses">
                    <strong>Bonuses:</strong>
                    {Object.entries(breakdown.bonuses).map(([key, value]) => (
                      <div key={key} className="breakdown-item">
                        <span>{key}:</span>
                        <span className="positive">
                          +{value.bonus.toFixed(1)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

              <div className="breakdown-item final">
                <strong>Final Score:</strong>
                <strong>{breakdown.final_score}</strong>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HealthinessScore;
