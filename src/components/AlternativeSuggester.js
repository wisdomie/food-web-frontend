/**
 * AlternativeSuggester Component
 *
 * Displays healthier alternatives when an unhealthy food is detected.
 * Appears proactively when healthiness score is below 60.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAlternatives } from '../services/api';

function AlternativeSuggester({ alternatives, originalFood, healthinessScore, onDismiss }) {
  const [loading, setLoading] = useState(false);
  const [moreAlternatives, setMoreAlternatives] = useState(null);
  const [showMore, setShowMore] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Parse alternatives (could be array of objects or text)
  const alternativesList = alternatives?.alternatives || alternatives?.alternatives_text || [];
  const isArrayFormat = Array.isArray(alternativesList);

  const handleShowMore = async () => {
    setLoading(true);
    try {
      const response = await getAlternatives(originalFood);
      if (response.success) {
        setMoreAlternatives(response.alternatives);
        setShowMore(true);
      }
    } catch (error) {
      console.error('Failed to get more alternatives:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAskAdvisor = () => {
    if (isAuthenticated) {
      navigate('/chat');
    } else {
      navigate('/login');
    }
  };

  const getHealthinessLabel = (score) => {
    if (score < 40) return { label: 'Low', color: '#f44336' };
    if (score < 60) return { label: 'Below Average', color: '#ff9800' };
    return { label: 'Average', color: '#ffc107' };
  };

  const healthLabel = getHealthinessLabel(healthinessScore);

  return (
    <div className="alternative-suggester">
      <div className="suggester-header">
        <div className="header-icon">💡</div>
        <div className="header-content">
          <h3>Healthier Alternatives Available</h3>
          <p>
            <span className="original-food">{originalFood}</span> has a{' '}
            <span className="health-label" style={{ color: healthLabel.color }}>
              {healthLabel.label.toLowerCase()}
            </span>{' '}
            healthiness score ({Math.round(healthinessScore)}/100).
            Consider these alternatives:
          </p>
        </div>
        {onDismiss && (
          <button className="btn-dismiss" onClick={onDismiss} title="Dismiss">
            ×
          </button>
        )}
      </div>

      <div className="alternatives-list">
        {isArrayFormat ? (
          // Structured format
          alternativesList.map((alt, index) => (
            <div key={index} className="alternative-card">
              <div className="alt-name">{alt.name}</div>
              <div className="alt-explanation">{alt.explanation}</div>
              <div className="alt-benefit">
                <span className="benefit-icon">✓</span>
                {alt.benefit}
              </div>
            </div>
          ))
        ) : (
          // Text format fallback
          <div className="alternatives-text">
            {alternativesList}
          </div>
        )}
      </div>

      {/* More alternatives section */}
      {showMore && moreAlternatives && (
        <div className="more-alternatives">
          <h4>Additional Suggestions</h4>
          <div className="more-text">{moreAlternatives}</div>
        </div>
      )}

      <div className="suggester-actions">
        {!showMore && (
          <button
            className="btn-secondary btn-more"
            onClick={handleShowMore}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Show More Alternatives'}
          </button>
        )}

        <button className="btn-primary btn-advisor" onClick={handleAskAdvisor}>
          {isAuthenticated ? 'Ask Diet Advisor' : 'Login for Personalized Advice'}
        </button>
      </div>

      <div className="suggester-note">
        <small>
          Suggestions are personalized based on your dietary preferences.
          {!isAuthenticated && ' Login to get better recommendations.'}
        </small>
      </div>
    </div>
  );
}

export default AlternativeSuggester;
