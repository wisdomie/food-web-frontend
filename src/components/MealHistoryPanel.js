/**
 * MealHistoryPanel Component
 *
 * Displays today's meals and nutrition summary
 */

import React, { useState, useEffect } from 'react';
import { getTodayMeals, getMealStats } from '../services/api';

function MealHistoryPanel() {
  const [todayData, setTodayData] = useState(null);
  const [weeklyStats, setWeeklyStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState('today'); // 'today' or 'weekly'

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [todayResponse, weeklyResponse] = await Promise.all([
        getTodayMeals(),
        getMealStats('weekly')
      ]);

      if (todayResponse.success) {
        setTodayData(todayResponse);
      }

      if (weeklyResponse.success) {
        setWeeklyStats(weeklyResponse.stats);
      }
    } catch (err) {
      console.error('Failed to load meal data:', err);
      setError('Failed to load meal history');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getHealthinessColor = (score) => {
    if (score >= 70) return '#4caf50';
    if (score >= 50) return '#ff9800';
    return '#f44336';
  };

  if (loading) {
    return (
      <div className="meal-history-panel loading">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="meal-history-panel error">
        <p>{error}</p>
        <button className="btn-secondary" onClick={loadData}>
          Retry
        </button>
      </div>
    );
  }

  const renderTodayView = () => {
    if (!todayData) return null;

    const { meals, totals } = todayData;

    return (
      <div className="today-view">
        {/* Daily Summary */}
        <div className="daily-summary">
          <h4>Today's Summary</h4>
          <div className="summary-stats">
            <div className="stat-item">
              <span className="stat-value">{Math.round(totals.calories)}</span>
              <span className="stat-label">Calories</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{Math.round(totals.protein)}g</span>
              <span className="stat-label">Protein</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{Math.round(totals.carbs)}g</span>
              <span className="stat-label">Carbs</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{Math.round(totals.fat)}g</span>
              <span className="stat-label">Fat</span>
            </div>
          </div>
          {totals.average_healthiness > 0 && (
            <div className="average-healthiness">
              <span>Average Healthiness: </span>
              <span
                className="healthiness-score"
                style={{ color: getHealthinessColor(totals.average_healthiness) }}
              >
                {totals.average_healthiness}/100
              </span>
            </div>
          )}
        </div>

        {/* Meals List */}
        <div className="meals-list">
          <h4>Today's Meals ({meals.length})</h4>
          {meals.length === 0 ? (
            <p className="no-meals">No meals logged today</p>
          ) : (
            <div className="meal-items">
              {meals.map(meal => (
                <div key={meal.id} className="meal-item">
                  <div className="meal-info">
                    <span className="meal-name">{meal.food_name}</span>
                    <span className="meal-time">{formatTime(meal.logged_at)}</span>
                  </div>
                  <div className="meal-details">
                    {meal.nutrition && (
                      <span className="meal-calories">
                        {Math.round(meal.nutrition.calories || 0)} cal
                      </span>
                    )}
                    {meal.healthiness_score && (
                      <span
                        className="meal-healthiness"
                        style={{ color: getHealthinessColor(meal.healthiness_score) }}
                      >
                        {Math.round(meal.healthiness_score)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderWeeklyView = () => {
    if (!weeklyStats) return null;

    const { averages, daily_data, total_meals, days_with_meals } = weeklyStats;

    return (
      <div className="weekly-view">
        {/* Weekly Summary */}
        <div className="weekly-summary">
          <h4>Weekly Averages</h4>
          <div className="summary-stats">
            <div className="stat-item">
              <span className="stat-value">{Math.round(averages.calories)}</span>
              <span className="stat-label">Avg Calories/Day</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{Math.round(averages.protein)}g</span>
              <span className="stat-label">Avg Protein</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{total_meals}</span>
              <span className="stat-label">Total Meals</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{days_with_meals}/7</span>
              <span className="stat-label">Days Tracked</span>
            </div>
          </div>
        </div>

        {/* Daily Breakdown */}
        <div className="daily-breakdown">
          <h4>Daily Breakdown</h4>
          <div className="day-bars">
            {daily_data.map((day, index) => {
              const dayName = new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' });
              const maxCalories = Math.max(...daily_data.map(d => d.calories), 2000);
              const heightPercent = (day.calories / maxCalories) * 100;

              return (
                <div key={index} className="day-bar-container">
                  <div
                    className="day-bar"
                    style={{
                      height: `${Math.max(heightPercent, 5)}%`,
                      backgroundColor: day.meal_count > 0 ? '#4a90a4' : '#ddd'
                    }}
                    title={`${day.calories} cal, ${day.meal_count} meals`}
                  />
                  <span className="day-label">{dayName}</span>
                  <span className="day-calories">{Math.round(day.calories)}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="meal-history-panel">
      <div className="panel-header">
        <h3>Meal History</h3>
        <div className="view-toggle">
          <button
            className={`toggle-btn ${view === 'today' ? 'active' : ''}`}
            onClick={() => setView('today')}
          >
            Today
          </button>
          <button
            className={`toggle-btn ${view === 'weekly' ? 'active' : ''}`}
            onClick={() => setView('weekly')}
          >
            Week
          </button>
        </div>
      </div>

      {view === 'today' ? renderTodayView() : renderWeeklyView()}

      <button className="btn-refresh" onClick={loadData}>
        Refresh
      </button>
    </div>
  );
}

export default MealHistoryPanel;
