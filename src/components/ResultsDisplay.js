/**
 * ResultsDisplay Component
 *
 * Displays analysis results based on confidence level:
 * - High confidence (≥50%): Shows nutrition, portion, and healthiness score
 * - Low confidence (<50%): Shows LLM advice
 */

import React, { useState } from 'react';
import NutritionTable from './NutritionTable';
import PortionEstimate from './PortionEstimate';
import HealthinessScore from './HealthinessScore';
import AlternativeSuggester from './AlternativeSuggester';

function ResultsDisplay({ results, previewUrl, onReset }) {
  const isLowConfidence = results.low_confidence;
  const [showAlternatives, setShowAlternatives] = useState(results.show_alternatives);

  return (
    <div className="results-container">
      {/* Image Preview */}
      <div className="results-image">
        <img src={previewUrl} alt="Analyzed food" />
      </div>

      {/* Results Content */}
      <div className="results-content">
        {/* Food Identification */}
        <div className="food-identification">
          <h2>{results.food_name}</h2>
          <div className="confidence-badge">
            Confidence: {results.confidence.toFixed(1)}%
          </div>
        </div>

        {/* Top Predictions */}
        {results.top_predictions && results.top_predictions.length > 1 && (
          <div className="top-predictions">
            <h3>Other Possibilities:</h3>
            <div className="predictions-list">
              {results.top_predictions.slice(1, 4).map((pred, index) => (
                <div key={index} className="prediction-item">
                  <span className="pred-name">{pred.display_name}</span>
                  <span className="pred-confidence">
                    {pred.confidence.toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* HIGH CONFIDENCE: Show nutrition data */}
        {!isLowConfidence && results.nutrition ? (
          <div className="high-confidence-results">
            {/* Healthiness Score */}
            {results.healthiness && (
              <HealthinessScore healthiness={results.healthiness} />
            )}

            {/* Portion Estimate */}
            {results.portion_estimate && (
              <PortionEstimate portion={results.portion_estimate} />
            )}

            {/* Nutrition Table */}
            <NutritionTable nutrition={results.nutrition} />

            {/* Recommendations */}
            {results.recommendations && results.recommendations.length > 0 && (
              <div className="recommendations">
                <h3>Recommendations</h3>
                <ul>
                  {results.recommendations.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Proactive Alternative Suggester */}
            {showAlternatives && results.proactive_alternatives && (
              <AlternativeSuggester
                alternatives={results.proactive_alternatives}
                originalFood={results.food_name}
                healthinessScore={results.healthiness?.score}
                onDismiss={() => setShowAlternatives(false)}
              />
            )}
          </div>
        ) : null}

        {/* HIGH CONFIDENCE but NO NUTRITION: Show message */}
        {!isLowConfidence && !results.nutrition && (
          <div className="no-nutrition-message">
            <p>
              {results.error ||
                'Nutrition data is not available for this food item.'}
            </p>
          </div>
        )}

        {/* LOW CONFIDENCE: Show LLM advice */}
        {isLowConfidence && (
          <div className="low-confidence-results">
            <div className="low-confidence-warning">
              <div className="warning-icon">⚠</div>
              <h3>Low Confidence Detection</h3>
              <p>
                The model is not very confident about this prediction. Here's
                some general information:
              </p>
            </div>

            <div className="llm-advice">
              <h3>General Nutrition Information</h3>
              <p>{results.llm_advice}</p>
              {results.disclaimer && (
                <p className="disclaimer">{results.disclaimer}</p>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="results-actions">
          <button onClick={onReset} className="btn-primary">
            Analyze Another Image
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResultsDisplay;
