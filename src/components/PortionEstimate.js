/**
 * PortionEstimate Component
 *
 * Displays estimated portion size information
 */

import React from 'react';

function PortionEstimate({ portion }) {
  if (!portion) {
    return null;
  }

  const { estimated_serving, portion_multiplier, confidence, note } = portion;

  return (
    <div className="portion-section">
      <h3>Portion Estimate</h3>

      <div className="portion-content">
        {/* Portion Icon */}
        <div className="portion-icon">🍽️</div>

        {/* Portion Details */}
        <div className="portion-details">
          <div className="portion-serving">
            <strong>Estimated Serving:</strong>
            <span className="serving-amount">{estimated_serving}</span>
          </div>

          {portion_multiplier !== 1.0 && (
            <div className="portion-multiplier">
              <span className="multiplier-badge">
                {portion_multiplier.toFixed(1)}x standard serving
              </span>
            </div>
          )}

          {note && <p className="portion-note">{note}</p>}

          <div className="portion-confidence">
            <small>Confidence: {confidence}</small>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PortionEstimate;
